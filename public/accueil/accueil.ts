import {DataBinding} from "../../src/lib/data-binding";
import {Controller} from "../../src/lib/annotations/controller";
import {Template} from "../../src/lib/annotations/Template";

@Controller("AccueilController")
@Template({ html: "/accueil/accueil.html", css: "/accueil/accueil.css" })
export class AccueilController {
  private model1: string;
  private binding: DataBinding;

  constructor() {
    this.model1 = "";
    this.binding = new DataBinding({});
  }

  init() {
    this.binding = new DataBinding({ model1: this.model1 });

    const message: string = "Hello depuis TypeScript 🎉";
    document.body.innerHTML += `<p>${message}</p>`;

    const msg = document.getElementById("msg")!;
    msg.textContent = `Dernière mise à jour : ${new Date().toLocaleTimeString()}`;

    this.model1 = "sqfqfdfs";
    this.binding.updateData("model1", this.model1);

    this.binding.updateData("model2", "init");
  }
}
