import fs from "fs";
import path from "path";
import * as esbuild from "esbuild";
import { WebSocketServer } from "ws";
import * as http from "node:http";
import CodeAdder from "./lib/code-adder";

const PORT = 3000;
const WS_PORT = 3001;

const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", (ws) => {
  console.log("🔌 Client WebSocket connecté");
});

const broadcastReload = () => {
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send("reload");
    }
  }
};

// Watch files in public and src folders
fs.watch(path.join(__dirname, "../public"), { recursive: true }, () => {
  console.log("⚡ Fichier modifié, rechargement...");
  broadcastReload();
});

fs.watch(path.join(__dirname, "../src"), { recursive: true }, () => {
  console.log("⚡ Fichier modifié, recompilation...");
  broadcastReload();
});
const tsconfigPath = path.resolve(__dirname, "..", "tsconfig.json");

const compileTsToJs = async (filePath: string): Promise<string> => {
  try {
    const result = await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      format: "esm",
      sourcemap: true,
      write: false,
      tsconfig: tsconfigPath,
      platform: "node", // Ensure platform is set to 'node'
      target: "es2020", // Ensure target is set to 'es2020'
    });
    const { outputFiles } = result;
    if (outputFiles && outputFiles.length > 0 && outputFiles[0] !== void 0) {
      let code = outputFiles[0].text;
      const adding = new CodeAdder(code);
      return adding.addInit();
    } else {
      throw new Error("No output files generated");
    }
  } catch (error) {
    console.error(`Error compiling ${filePath}:`, error);
    throw error;
  }
};

const server = http.createServer(async (req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url!;
  let fullPath = path.join(__dirname, "../public", filePath);

  if (!fs.existsSync(fullPath)) {
    if (filePath.endsWith("/")) {
      filePath = "/index.html";
      fullPath = path.join(__dirname, "../public", filePath);
    } else {
      // Check if the requested file is a TypeScript file in the src directory
      const tsPath = path.join(
        __dirname,
        "../",
        filePath.replace(/\.js$/, ".ts"),
      );
      const tsPathWithExt = tsPath + (path.extname(tsPath) ? "" : ".ts");
      if (fs.existsSync(tsPathWithExt)) {
        const jsCode = await compileTsToJs(tsPathWithExt);
        res.writeHead(200, { "Content-Type": "application/javascript" });
        return res.end(jsCode);
      }
      res.writeHead(404);
      return res.end("Not found");
    }
  }
  let code: string = "";
  if (filePath.endsWith("/")) {
    filePath = "/index.html";
    fullPath = path.join(__dirname, "../public", filePath);
  }
  try {
    code = fs.readFileSync(fullPath, "utf-8");
  } catch (error) {
    console.error(error);
    res.writeHead(404);
    return res.end("Not found");
  }
  let contentType = "text/plain";

  if (filePath.endsWith(".html")) {
    contentType = "text/html";
    // Inject WebSocket client for HMR
    code = code.replace(
      "</body>",
      `<script>
        const ws = new WebSocket('ws://localhost:${WS_PORT}');
        ws.onmessage = () => location.reload();
      </script></body>`,
    );
  }

  if (filePath.endsWith(".js")) contentType = "application/javascript";
  if (filePath.endsWith(".ts")) {
    contentType = "application/javascript";
    code = await compileTsToJs(fullPath);
  }

  res.writeHead(200, { "Content-Type": contentType });
  res.end(code);
});

function extractFileNameWithoutExtension(filePath: string): string {
  // Utiliser path.basename pour obtenir le nom du fichier avec l'extension
  const baseName = path.basename(filePath);
  // Utiliser path.extname pour obtenir l'extension du fichier
  const extName = path.extname(baseName);
  // Extraire le nom du fichier sans l'extension

  return baseName.slice(0, -extName.length);
}

server.listen(PORT, () => {
  console.log(`🚀 Mini-Vite running at http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running at ws://localhost:${WS_PORT}`);
});
