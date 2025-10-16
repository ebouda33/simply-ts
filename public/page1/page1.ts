import { Controller } from "../../src/lib/annotations/controller";
import { Template } from "../../src/lib/annotations/template";

@Controller("Page1")
@Template({
  html: "/page1/page1.html",
  css: "/page1/page1.css",
})
export class Page1 {
  init() {}
}
