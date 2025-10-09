export class Render extends HTMLElement {
  constructor() {
    super();
    console.debug("render create");
  }

  // appelé quand l'élément est inséré dans le DOM
  connectedCallback(): void {
    // intentionally empty — ne fait rien
  }

  // appelé quand l'élément est retiré du DOM
  disconnectedCallback(): void {
    // intentionally empty — ne fait rien
  }

  // Optionnel : éviter les effets de recopie si on veut utiliser un shadow root plus tard
  // attachShadow({ mode: 'open' });
}

// Enregistrement du custom element (à exécuter une seule fois)
if (!customElements.get("render")) {
  customElements.define("render", Render);
}
