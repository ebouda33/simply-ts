import { RouterPath } from "../../public/module.router";
import { RenderIt } from "../renderIt";
import { getControllerName } from "./annotations/controller";

export class Router {
  private readonly app: HTMLElement | null;
  private readonly CATCH_ALL = "**";
  private readonly notFoundControllerRoute;

  constructor(
    readonly renderer: RenderIt,
    appSelector?: string,
  ) {
    this.notFoundControllerRoute = RouterPath.find(
      (r) => r.path === this.CATCH_ALL,
    );

    this.app = appSelector
      ? document.querySelector(appSelector)
      : document.querySelector("render");

    // Écoute les événements "route-change" envoyés par AppNavigation
    document.addEventListener("route-change", (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      this.navigate(customEvent.detail.href);
    });

    // Gestion du bouton retour/avant du navigateur
    globalThis.addEventListener("popstate", () => {
      this.render(location.pathname);
    });

    // Affiche la route courante au chargement
    this.render(location.pathname);
  }

  private navigate(href: string) {
    history.pushState({}, "", href);
    this.render(href);
  }

  public render(path: string) {
    if (!this.app) return;

    // Normalisation du path (supprime le slash final sauf pour la racine)
    const normalizedPath =
      path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

    let route = RouterPath.find((r) => r.path === normalizedPath);
    if (this.notFoundControllerRoute) {
      route ??= this.notFoundControllerRoute;
    } else {
      this.app.innerHTML = "<h1>404 - Page non trouvée</h1>";
      return;
    }

    const renderElement = document.querySelector("render");
    if (!renderElement) return;

    // Recherche de l'instance correspondante
    const instance = this.renderer.controllers.find(
      // @ts-ignore
      (ctrl) => getControllerName(ctrl) === getControllerName(route.component),
    );

    if (!instance) {
      console.warn(
        // @ts-ignore
        `⚠️ Aucun controller instancié trouvé pour ${getControllerName(route.component)}`,
      );
      return;
    }

    // Appel de render() de l'instance
    // @ts-ignore
    if (typeof instance.render === "function") {
      // @ts-ignore
      instance.render(renderElement);
    } else {
      // @ts-ignore
      console.error(`No Template for  ${instance.__className}`);
    }
  }
}
