// src/shared/decorator/Template.ts
interface TemplateOptions {
  html?: string;
  css?: string;
}

export const Template = (options: TemplateOptions = {}) => {
  const { html, css } = options;

  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    // Ajout de propriétés statiques pour introspection éventuelle
    (constructor as any).template = html || null;
    (constructor as any).style = css || null;

    console.log(`🧩 Template appliqué à ${constructor.name}`);
    if (html) console.log(`HTML : ${html}`);
    if (css) console.log(`CSS  : ${css}`);

    // On retourne une version étendue de la classe
    return class extends constructor {
      template = html || null;
      style = css || null;

      render(container: HTMLElement) {
        // Si pas de HTML défini → rien à faire
        if (!html) return;

        fetch(html)
          .then((res) => res.text())
          .then((htmlContent) => {
            container.innerHTML = htmlContent;

            if (typeof (this as any).init === "function") {
              (this as any).init();
            }
            // Si CSS défini → injecter
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
