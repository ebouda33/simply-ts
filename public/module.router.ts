import { AccueilController } from "./accueil/accueil";
import { Page1 } from "./page1/page1";
import { ModelRouterPath } from "../src/module/module.global";
import { NotFoundController } from "./404/NotFoundController";
import { Page2Controller } from "./page2/page2";

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
  {
    path: "/page2",
    component: Page2Controller,
  },
  {
    path: "**",
    component: NotFoundController,
  },
];
