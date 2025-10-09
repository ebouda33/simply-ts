// src/lib/annotations/controller.ts
export interface ControllerMeta {
  class: Function; // la classe elle-même
  name: string; // nom de la classe
  filePath?: string; // chemin relatif / module (optionnel)
}

export const CONTROLLERS: ControllerMeta[] = [];

/**
 * Décorateur Controller
 * @param filePath Optionnel : chemin ou module pour référence
 */
export function Controller(name?: string) {
  return function <T extends new (...args: any[]) => {}>(target: T) {
    const className = name || target.name || "UnknownController";
    // Ajout d'une propriété prototype pour nom
    Object.defineProperty(target, "__className", {
      value: className,
      writable: false,
    });
    Object.defineProperty(target.prototype, "__className", {
      value: className,
      writable: false,
    });

    // Enregistrement dans la liste globale
    CONTROLLERS.push({
      class: target,
      name: className,
    });

    console.log(`🟢 Controller enregistré : ${className}`);
  };
}
