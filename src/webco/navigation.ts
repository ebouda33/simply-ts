export class Navigation extends HTMLElement {
  static get observedAttributes() {
    return ["items"]; // attribut JSON avec les liens du menu
  }
  attributeChangedCallback() {
    this.render();
  }

  private readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }
  private render(): void {
    const items: { label: string; href: string }[] = this.getAttribute("items")
      ? JSON.parse(this.getAttribute("items")!)
      : [];

    this.shadow.innerHTML = `
      <style>
        nav {
          display: flex;
          gap: 1rem;
          background: #222;
          padding: 0.5rem 1rem;
        }
        a {
          color: white;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
      <nav>
        ${items.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
      </nav>
    `;

    for (const link of this.shadow.querySelectorAll("a")) {
      link.addEventListener("click", (event) => {
        event.preventDefault(); // stoppe la navigation classique

        const href = (event.currentTarget as HTMLAnchorElement).getAttribute(
          "href",
        );

        // Tu peux soit :
        // 1. Mettre à jour l'URL avec l’historique
        history.pushState({}, "", href);

        // 2. Déclencher un événement custom que ton app écoute
        this.dispatchEvent(
          new CustomEvent("route-change", {
            detail: { href },
            bubbles: true,
            composed: true,
          }),
        );
      });
    }
  }
}

customElements.define("app-navigation", Navigation);
