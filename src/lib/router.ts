import { RouterPath } from "../../public/module.router";
import { RenderIt } from "../renderIt";
import {
  BaseController,
  ControllerClass,
  getControllerName,
} from "./annotations/controller";

export class Router {
  private readonly app: HTMLElement | null;

  constructor(
    readonly renderer: RenderIt,
    appSelector?: string,
  ) {
    this.app =
      appSelector === undefined
        ? document.querySelector("render")
        : document.querySelector(appSelector);

    // écoute les événements "route-change" envoyés par AppNavigation
    document.addEventListener("route-change", (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const { href } = customEvent.detail;
      this.navigate(href);
    });

    // gère le bouton retour/avant du navigateur
    globalThis.addEventListener("popstate", () => {
      this.render(location.pathname);
    });

    // au chargement, afficher la route courante
    this.render(location.pathname);
  }

  private navigate(href: string) {
    history.pushState({}, "", href);
    this.render(href);
  }

  public render(path: string) {
    if (!this.app) return;

    const normalizedPath =
      path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

    // Recherche directe dans RouterPath
    const route = RouterPath.find((r) => r.path === normalizedPath);

    if (route) {
      const renderElement = document.getElementsByTagName("render");
      let instance: ControllerClass | undefined =
        this.renderer.controllers.find(
          (cmp) =>
            getControllerName(cmp) === getControllerName(route.component),
        );
      if (undefined === instance) {
        console.warn(
          `⚠️ Aucun controller instancié trouvé pour ${getControllerName(route.component)}`,
        );
      } else {
        (instance as any).render(renderElement[0]);
      }
    } else {
      this.app.innerHTML = "<h1>404 - Page non trouvée</h1>";
    }
  }
}

function createControllerInstance<T extends BaseController>(
  Ctor: ControllerClass<T>,
): T {
  return new Ctor();
}
