import { Controller } from "../../src/lib/annotations/controller";
import { Template } from "../../src/lib/annotations/template";
import { DataBinding } from "../../src/lib/data-binding";
import "../../src/webco/navigation";

@Controller("AccueilController")
@Template({ html: "/accueil/accueil.html", css: "/accueil/accueil.css" })
export class AccueilController {
  model1: string = "";
  model2: string = "";
  constructor() {}

  init() {
    const binding = new DataBinding();

    const msg = document.getElementById("msg")!;
    msg.textContent = `Dernière mise à jour : ${new Date().toLocaleTimeString()}`;

    this.model1 = "sqfqfdfs";
    binding.updateData("model1", this.model1);

    this.model2 = "init";
    binding.updateData("model2", this.model2);
  }

  maMethode() {
    console.debug("Ma Methode");
  }
}
