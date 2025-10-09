// src/module/module.global.ts
import "../../public/module";
import {CONTROLLERS} from "../lib/annotations/controller";

/**
 * Retourne tous les controllers enregistrés
 */
export function loadControllers() {
  return CONTROLLERS;
}
