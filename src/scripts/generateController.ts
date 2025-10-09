import { readdirSync, readFileSync, writeFileSync } from "fs";
import { extname, join } from "path";

const SRC_DIR = "./src";
const OUTPUT_FILE = "./public/controllers.json";

interface ControllerInfo {
  name: string;
  path: string;
}

const controllers: ControllerInfo[] = [];

function scan(folder: string) {
  const entries = readdirSync(folder, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(folder, entry.name);

    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.isFile() && extname(entry.name) === ".ts") {
      const content = readFileSync(fullPath, "utf-8");

      if (/@Controller\b/.test(content)) {
        // Extraire le nom de la classe
        const match = content.match(/export\s+class\s+(\w+)/);
        if (match) {
          controllers.push({
            name: match[1],
            path: fullPath.replace(/\\/g, "/").replace(/^src\//, "/src/"), // chemin relatif pour navigateur
          });
        }
      }
    }
  }
}

scan(SRC_DIR);

// Écrire le JSON
writeFileSync(OUTPUT_FILE, JSON.stringify(controllers, null, 2), "utf-8");
console.log(
  `🎯 ${controllers.length} controllers trouvés. Fichier généré : ${OUTPUT_FILE}`,
);
