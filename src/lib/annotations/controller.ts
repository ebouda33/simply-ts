// src/shared/decorator/Controller.ts
export const CONTROLLERS: any[] = []; // liste globale

// décorateur direct
export function Controller(target: new (...args: any[]) => {}) {
  CONTROLLERS.push(target);
  console.log(`🟢 Controller enregistré : ${target.name}`);
}
