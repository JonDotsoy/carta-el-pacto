import { cartService } from "./cart/cart.service";
import { HElement as HTMLElement } from "./h-element";
import { $cartProductAdded } from "./legacy-ststes";

export class CartButtonAddProduct extends HTMLElement {
  transform() {}

  onClick(event: MouseEvent) {
    console.log("🚀 ~ CartButtonAddProduct ~ onClick ~ event:", event);
  }

  // connectedCallback() {
  //     this.addEventListener("click", () => {
  //         if (this.dataset.addFor)
  //             $cartProductAdded.setKey(
  //                 this.dataset.addFor,
  //                 ($cartProductAdded.get()[this.dataset.addFor] ?? 0) + 1
  //             );
  //     });
  // }
  // disconnectedCallback() { }
}
