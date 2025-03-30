import { HElement as HTMLElement } from "./h-element";
import { $cartFiltered } from "./legacy-ststes";

export class CartButtonAddFilter extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", () => {
            if (this.dataset.for) {
                if (this.dataset.for === "__ADDED__") {
                    $cartFiltered.set({
                        __ADDED__: !(
                            $cartFiltered.get()["__ADDED__"] ?? false
                        ),
                    });
                    return;
                }
                $cartFiltered.set({
                    ...$cartFiltered.get(),
                    __ADDED__: false,
                    [this.dataset.for]: !(
                        $cartFiltered.get()[this.dataset.for] ?? false
                    ),
                });
            }
        });
        $cartFiltered.subscribe(() => {
            if (this.dataset.for) {
                this.dataset.active = $cartFiltered.get()[this.dataset.for]
                    ? "true"
                    : "";
            }
        });
    }
    disconnectedCallback() { }
}
