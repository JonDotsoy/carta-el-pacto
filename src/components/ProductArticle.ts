import { HElement as HTMLElement } from "./h-element";
import { $cartProductAdded, $cartProductAddedAndcartFiltered, $cartFiltered } from "./legacy-ststes";

export class ProductArticle extends HTMLElement {
    connectedCallback() {
        $cartProductAdded.subscribe(() => {
            if (this.id)
                this.dataset.onCard = $cartProductAdded.get()[this.id]
                    ? "true"
                    : "";
        });
        $cartProductAddedAndcartFiltered.subscribe(
            ({ cartFiltered, cartProductAdded }) => {
                const { __ADDED__, ...e } = $cartFiltered.get();

                const cartListFiltered = Object.entries(e)
                    .filter(([k, v]) => v)
                    .map(([k]) => k);

                if (__ADDED__ && this.id) {
                    const cartAdded = $cartProductAdded.get()[this.id] ?? 0;

                    if (cartAdded === 0) {
                        this.dataset.filtered = "true";
                        return;
                    }
                }

                if (cartListFiltered.length === 0) {
                    this.dataset.filtered = "";
                    return;
                }

                if (this.dataset.categories) {
                    const categories: string[] = JSON.parse(
                        this.dataset.categories
                    );

                    this.dataset.filtered = categories.some((c) => cartListFiltered.includes(c)
                    )
                        ? ""
                        : "true";
                }
            }
        );
    }
    disconnectedCallback() { }
}
