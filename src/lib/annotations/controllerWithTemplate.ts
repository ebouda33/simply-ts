import { Template } from "./template";
import { Controller } from "./controller";

/**
 * Combinaison de @Controller et @Template pour garantir l'ordre correct.
 * @param path - route du controller
 * @param html - nom du fichier HTML associé
 * @param css - nom du fichier css associé
 */
export function ControllerWithTemplate(
  path: string,
  html?: string,
  css?: string,
) {
  return function (target: any) {
    // ⚠️ Template doit être appliqué en premier
    // Controller appliqué ensuite
    target = Template({ html: html, css: css })(target);
    Controller(path)(target);
  };
}
