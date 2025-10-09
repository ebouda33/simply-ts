// src/copy-public.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Récupérer le dossier courant du fichier (équivalent de __dirname en ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir les chemins de base
const publicDir = path.join(__dirname, "../public");
const distDir = path.join(__dirname, "../dist");

/**
 * Copie récursivement un dossier source vers une destination
 * (tous les fichiers et sous-dossiers inclus)
 */
function copyDir(srcDir, destDir) {
  // Créer le dossier de destination s’il n’existe pas
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Lire le contenu du dossier source
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Récursion sur les sous-dossiers
      copyDir(srcPath, destPath);
    } else {
      // Copie simple du fichier
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 Copied ${srcPath} → ${destPath}`);
    }
  }
}

// --- Exécution du script principal ---
if (!fs.existsSync(publicDir)) {
  console.error("❌ Le dossier /public n’existe pas.");
  process.exit(1);
}

console.log("📁 Copie de /public → /dist ...");
copyDir(publicDir, distDir);
console.log("✅ Copie terminée !");
