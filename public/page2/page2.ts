import { Template } from "../../src/lib/annotations/template";
import { Controller } from "../../src/lib/annotations/controller";

@Controller("Page2Controller")
@Template({ html: "/page1/page1.html" })
export class Page2Controller {
  init() {}
}
