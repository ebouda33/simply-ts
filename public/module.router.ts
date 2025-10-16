import { AccueilController } from "./accueil/accueil";
import { Page1 } from "./page1/page1";
import { ModelRouterPath } from "../src/module/module.global";

export const RouterPath: ModelRouterPath[] = [
  {
    path: "",
    component: AccueilController,
  },
  {
    path: "/",
    component: AccueilController,
  },
  {
    path: "/page1",
    component: Page1,
  },
];
