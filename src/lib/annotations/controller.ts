// src/lib/annotations/controller.ts
import { ClassDecoratorFactory } from "./class-decorator-factory";

export interface ControllerMarker {
  __controllerBrand: true; // un "brand type" invisible à l'exécution
}
// Classe de base obligatoire
export abstract class BaseController {
  abstract init(): void;
  abstract render(container: HTMLElement): void;
  __className?: string;
}

// Un constructeur de Controller
export type ControllerClass<T extends BaseController = BaseController> = new (
  ...args: any[]
) => T;

export interface ControllerMeta {
  class: Function; // la classe elle-même
  name: string; // nom de la classe
  filePath?: string; // chemin relatif / module (optionnel)
}
export function getControllerName(c: ControllerClass | BaseController): string {
  return (
    (c as any).__className ??
    (c as BaseController).__className ??
    "UnknownController"
  );
}

export const CONTROLLERS: ControllerMeta[] = [];

export const Controller: ClassDecoratorFactory<string> =
  (name?: string) =>
  <T extends new (...args: any[]) => {}>(target: T) => {
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

    // On crée une sous-classe qui hérite automatiquement de BaseController
    class ControllerWrapper extends (target as any) implements BaseController {
      __className = className;

      constructor(...args: any[]) {
        super();
        const instance = new target(...args);
        Object.assign(this, instance); // copie les props de la classe originale
      }

      init!: () => void; // TS exige init()
      render!: (container: HTMLElement) => void;
    }

    // ✅ On colle aussi la meta sur le wrapper (static et prototype)
    Object.defineProperty(ControllerWrapper, "__className", {
      value: className,
      writable: false,
    });
    Object.defineProperty(ControllerWrapper.prototype, "__className", {
      value: className,
      writable: false,
    });

    // Enregistrement dans la liste globale
    CONTROLLERS.push({
      class: target,
      name: className,
    });

    console.log(`🟢 Controller enregistré : ${className}`);

    return ControllerWrapper as unknown as ControllerClass;
  };
