import { Controller } from "../../src/lib/annotations/controller";
import { Template } from "../../src/lib/annotations/template";

@Controller("NotFoundController")
@Template({ html: "/404/index.html", css: "/404/404.css" })
export class NotFoundController {}
