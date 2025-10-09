// src/lib/data-binding.ts
export class DataBinding {
  private readonly data: { [key: string]: any } = {};
  private readonly prop = "data-binding";

  constructor(data?: { [key: string]: any }) {
    if (data !== void 0) {
      this.data = data;
    }
    window.addEventListener("DOMContentLoaded", () => {
      this.autoBinding();
      this.bindData();
    });
  }

  private autoBinding() {
    //recherche des proprietes et creation/update data
    const elements = document.querySelectorAll(`[${this.prop}]`);
    elements.forEach((element: Element) => {
      const key = element.getAttribute(this.prop);
      if (key && !this.data.hasOwnProperty(key)) {
        this.data[key] = "";
      }
    });
  }

  private bindData() {
    const elements = document.querySelectorAll(`[${this.prop}]`);
    elements.forEach((element: Element) => {
      const key = element.getAttribute(this.prop);
      if (key && this.data.hasOwnProperty(key)) {
        const value = this.data[key];
        if (element instanceof HTMLInputElement) {
          const scope = this;
          element.addEventListener("input", () => {
            scope.updateData(key, element.value);
          });
        }

        this.updateData(key, value);
      }
    });
  }

  updateData(key: string, value: any) {
    this.data[key] = value;
    const elements = document.querySelectorAll(`[${this.prop}="${key}"]`);
    elements.forEach((element: Element) => {
      if (element instanceof HTMLInputElement) {
        element.value = value;
      } else {
        element.textContent = value;
      }
    });
  }
}
