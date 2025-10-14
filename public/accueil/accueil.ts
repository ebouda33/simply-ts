import { Controller } from "../../src/lib/annotations/controller";
import { Template } from "../../src/lib/annotations/Template";
import { DataBinding } from "../../src/lib/data-binding";

@Controller("AccueilController")
@Template({ html: "/accueil/accueil.html", css: "/accueil/accueil.css" })
export class AccueilController {
  constructor() {}

  init() {
    const message: string = "Hello depuis TypeScript 🎉";
    document.body.innerHTML += `<p>${message}</p>`;
    const binding = new DataBinding();

    const msg = document.getElementById("msg")!;
    msg.textContent = `Dernière mise à jour : ${new Date().toLocaleTimeString()}`;

    const model1 = "sqfqfdfs";
    binding.updateData("model1", model1);

    binding.updateData("model2", "init");
  }
}
