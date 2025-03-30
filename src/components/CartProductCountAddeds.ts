import { HElement as HTMLElement } from "./h-element";
import { $cartProductAdded } from "./legacy-ststes";

export class CartProductCountAddeds extends HTMLElement {
  connectedCallback() {
    $cartProductAdded.subscribe(() => {
      if (this.dataset.for) {
        this.innerText = `${$cartProductAdded.get()[this.dataset.for] ?? 0}`;
      }
    });
    this.addEventListener("click", () => {
      if (this.dataset.addFor)
        $cartProductAdded.setKey(
          this.dataset.addFor,
          ($cartProductAdded.get()[this.dataset.addFor] ?? 0) + 1,
        );
    });
  }
  disconnectedCallback() {}
}
