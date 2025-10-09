class CodeAdder {
  private readonly CONTROLLER = "@Controller";
  constructor(private readonly code: string) {}

  private appendCode(code: string): string {
    return this.code + "\r\n" + code;
  }

  addInit(): string {
    let addLines = "";
    if (this.isController()) {
      let classes = this.getClasses();
      const classNames = classes[classes.length - 1];

      addLines = `const page = new ${classNames}(); 
            if(typeof page['init'] === 'function'){
                page.init();
            }
            if(typeof page['render'] === 'function'){
                page.render();
            }
            `;
    }
    return this.appendCode(addLines);
  }

  private getClasses(): string[] {
    const regex = /var\s+([A-Za-z_$][\w$]*)\s*=\s*class\b/g;
    const classNames: string[] = [];
    let match;
    while ((match = regex.exec(this.code)) !== null) {
      classNames.push(match[1]);
    }

    return classNames;
  }

  private isController() {
    return this.code.indexOf(this.CONTROLLER) > -1;
  }
}

export default CodeAdder;
