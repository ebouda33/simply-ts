import { loadControllers } from "./module/module.global";
import { Router } from "./lib/router";
import { ControllerClass } from "./lib/annotations/controller";

export class RenderIt {
  controllers: ControllerClass[] = [];

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
globalThis.addEventListener("DOMContentLoaded", () => {
  const render = new RenderIt();
  render.rechercheController();
  let router: Router = new Router(render);
  router.render("/");
});
