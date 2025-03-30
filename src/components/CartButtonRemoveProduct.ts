import { HElement as HTMLElement } from "./h-element";
import { $cartProductAdded } from "./legacy-ststes";

export class CartButtonRemoveProduct extends HTMLElement {
  connectedCallback() {
    this.addEventListener("click", () => {
      if (this.dataset.removeFor)
        $cartProductAdded.setKey(
          this.dataset.removeFor,
          Math.max(
            0,
            ($cartProductAdded.get()[this.dataset.removeFor] ?? 0) - 1,
          ),
        );
    });
  }
  disconnectedCallback() {}
}
