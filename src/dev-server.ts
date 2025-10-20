import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import * as http from "node:http";
import {WebSocketServer} from "ws";
import CodeAdder from "./lib/code-adder";

const PORT = 3000;
const WS_PORT = 3001;

const PUBLIC_DIR = path.join(__dirname, "../public");
const SRC_DIR = path.join(__dirname, "../src");
const TSCONFIG_PATH = path.resolve(__dirname, "..", "tsconfig.json");

// ----------------------
// WebSocket HMR Server
// ----------------------
const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", (ws) => console.log("🔌 Client WebSocket connecté"));

const broadcastReload = () => {
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send("reload");
    }
  }
};

// ----------------------
// Watch files for changes
// ----------------------
for (const dir of [PUBLIC_DIR, SRC_DIR]) {
  fs.watch(dir, { recursive: true }, () => {
    console.log("⚡ Fichier modifié, rechargement...");
    broadcastReload();
  });
}

// ----------------------
// Compile TypeScript to JS
// ----------------------
const compileTsToJs = async (filePath: string): Promise<string> => {
  try {
    const result = await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      format: "esm",
      sourcemap: true,
      write: false,
      tsconfig: TSCONFIG_PATH,
      platform: "node",
      target: "es2020",
    });

    const outputFile = result.outputFiles?.[0];
    if (!outputFile) throw new Error("No output files generated");

    const code = outputFile.text;
    return new CodeAdder(code).addInit();
  } catch (err) {
    console.error(`Error compiling ${filePath}:`, err);
    throw err;
  }
};

// ----------------------
// Serve a file
// ----------------------
const serveFile = async (reqUrl: string, res: http.ServerResponse) => {
  let filePath = reqUrl || "/";
  let fullPath = path.join(PUBLIC_DIR, filePath);

  // Normaliser / → /index.html
  if (filePath.endsWith("/")) {
    filePath = "/index.html";
    fullPath = path.join(PUBLIC_DIR, filePath);
  }

  // Si le fichier n'existe pas dans public, vérifier si c'est un TS dans src
  if (!fs.existsSync(fullPath)) {
    const tsPath = path.join(__dirname, "..", filePath.replace(/\.js$/, ".ts"));
    const tsPathWithExt = tsPath + (path.extname(tsPath) ? "" : ".ts");

    if (fs.existsSync(tsPathWithExt)) {
      const jsCode = await compileTsToJs(tsPathWithExt);
      res.writeHead(200, { "Content-Type": "application/javascript" });
      return res.end(jsCode);
    }

    res.writeHead(404);
    return res.end("Not found");
  }

  // Lecture du fichier
  let code: string;
  try {
    code = fs.readFileSync(fullPath, "utf-8");
  } catch (err) {
    console.error(err);
    res.writeHead(404);
    return res.end("Not found");
  }

  // Déterminer le type de contenu et injection HMR
  let contentType = "text/plain";

  if (filePath.endsWith(".html")) {
    contentType = "text/html";
    code = code.replace(
      "</body>",
      `<script>
        const ws = new WebSocket('ws://localhost:${WS_PORT}');
        ws.onmessage = () => location.reload();
      </script></body>`,
    );
  } else if (filePath.endsWith(".js")) {
    contentType = "application/javascript";
  } else if (filePath.endsWith(".ts")) {
    contentType = "application/javascript";
    code = await compileTsToJs(fullPath);
  }

  res.writeHead(200, { "Content-Type": contentType });
  res.end(code);
};

// ----------------------
// HTTP Server
// ----------------------
const server = http.createServer((req, res) => {
  if (!req.url) return res.end();
  serveFile(req.url, res);
});

// ----------------------
// Helper: extract filename without extension
// ----------------------
function extractFileNameWithoutExtension(filePath: string): string {
  const baseName = path.basename(filePath);
  const extName = path.extname(baseName);
  return baseName.slice(0, -extName.length);
}

// ----------------------
// Start servers
// ----------------------
server.listen(PORT, () => {
  console.log(`🚀 Mini-Vite running at http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running at ws://localhost:${WS_PORT}`);
});
