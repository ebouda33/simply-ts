import { CONTROLLERS } from "./lib/annotations/controller";
import { CONTROLLER_REGISTRY } from "./module/module.global";

export class RenderIt {
  controllers: any[] = [];

  constructor() {}

  rechercheController() {
    for (const ControllerClass of CONTROLLERS) {
      const instance = new ControllerClass();
      this.controllers.push(instance);
      console.log(`✅ Controller instancié : ${ControllerClass.name}`);
    }
    console.log("🎯 Tous les controllers :", this.controllers);
  }
}

// Initialisation
window.addEventListener("DOMContentLoaded", () => {
  // loadPublicControllers().then(() => {
  const render = new RenderIt();
  console.log("Render démarré");
  render.rechercheController();
  // });
});
