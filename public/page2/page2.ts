import { ControllerWithTemplate } from "../../src/lib/annotations/controllerWithTemplate";

// @Controller("Page2Controller")
// @Template({ html: "/page1/page1.html" })
@ControllerWithTemplate("Page2Controller", "/page1/page1.html")
export class Page2Controller {
  model1: string = "";
  model2: string = "";
  init() {}
}
