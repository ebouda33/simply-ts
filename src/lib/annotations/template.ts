// src/shared/decorator/template.ts
import { ClassDecoratorFactory } from "./class-decorator-factory";

interface TemplateOptions {
  html?: string;
  css?: string;
}

export const Template: ClassDecoratorFactory<TemplateOptions> = (
  options: TemplateOptions = {},
) => {
  const { html, css } = options;

  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    (constructor as any).template = html || null;
    (constructor as any).style = css || null;

    console.log(`🧩 Template appliqué à ${constructor.name}`);
    if (html) console.log(`HTML : ${html}`);
    if (css) console.log(`CSS  : ${css}`);

    return class extends constructor {
      template = html || null;
      style = css || null;

      private _bindControllerMethods() {
        let proto = Object.getPrototypeOf(this);
        while (proto && proto !== Object.prototype) {
          for (const methodName of Object.getOwnPropertyNames(proto)) {
            const fn = (this as any)[methodName];
            if (
              methodName !== "constructor" &&
              methodName !== "render" &&
              methodName !== "init" &&
              typeof fn === "function" &&
              !methodName.startsWith("_")
            ) {
              (window as any)[methodName] = fn.bind(this);
            }
          }
          proto = Object.getPrototypeOf(proto);
        }

        if (typeof (this as any).init === "function") {
          (this as any).init();
        }
      }

      render(container: HTMLElement) {
        if (!html) return;

        fetch(html)
          .then((res) => res.text())
          .then((htmlContent) => {
            container.innerHTML = htmlContent;

            this._bindControllerMethods();

            if (css) {
              fetch(css)
                .then((res) => res.text())
                .then((styleContent) => {
                  const styleEl = document.createElement("style");
                  styleEl.textContent = styleContent;
                  document.head.appendChild(styleEl);
                });
            }
          })
          .catch((err) =>
            console.error(`Erreur lors du chargement du template :`, err),
          );
      }
    };
  };
};
