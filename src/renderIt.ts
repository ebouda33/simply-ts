import { loadControllers } from "./module/module.global";

export class RenderIt {
  controllers: any[] = [];

  rechercheController() {
    const registry = loadControllers();
    for (const controllerClass of registry) {
      // @ts-ignore
      const instance = new controllerClass.class();
      this.controllers.push(instance);
      console.log(`✅ Controller instancié : ${instance.__className}`);
    }
    console.log("🎯 Tous les controllers :", this.controllers);
  }
}

// Initialisation
window.addEventListener("DOMContentLoaded", () => {
  const render = new RenderIt();
  const renderElement = document.getElementsByTagName("render");
  console.log("Render démarré");
  render.rechercheController();
  render.controllers[0].render(renderElement[0]);
});
