//ici mettre toute les classes necessaire au demarrage
// src/module/module.global.ts
import {CONTROLLER_REGISTRY} from "../../public/module";

export default CONTROLLER_REGISTRY;

export async function loadPublicControllers() {
  // L'URL sera servie par Vite (ou ton serveur) depuis /public/module.js
  const moduleUrl = "/module.js"; // ⚠️ le fichier doit être en JS pur
  const mod = await import(moduleUrl);
  console.log("Chargé depuis /public :", mod.CONTROLLER_REGISTRY);
  return mod.CONTROLLER_REGISTRY;
}
