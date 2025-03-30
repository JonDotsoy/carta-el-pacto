import { map, computed } from "nanostores";

/** @deprecated prefer {@link cartService} to mutate state */
export const cartAddedLocalStorage = localStorage.getItem("_cart_added");
/** @deprecated prefer {@link cartService} to mutate state */
export const cartFilteredLocalStorage = localStorage.getItem("_cart_filtered");

/** @deprecated prefer {@link cartService} to mutate state */
export const $cartProductAdded = map<Record<string, number>>(
    cartAddedLocalStorage ? JSON.parse(cartAddedLocalStorage) : {},
);

/** @deprecated prefer {@link cartService} to mutate state */
export const $cartFiltered = map<Record<string, boolean>>(
    cartFilteredLocalStorage ? JSON.parse(cartFilteredLocalStorage) : {},
);

/** @deprecated prefer {@link cartService} to mutate state */
export const $cartProductAddedAndcartFiltered = computed(
    [$cartProductAdded, $cartFiltered],
    (cartProductAdded, cartFiltered) => {
        return {
            cartProductAdded: cartProductAdded,
            cartFiltered: cartFiltered,
        };
    },
);


$cartProductAdded.listen(() =>
    localStorage.setItem(
        "_cart_added",
        JSON.stringify($cartProductAdded.get()),
    ),
);

$cartFiltered.listen(() =>
    localStorage.setItem(
        "_cart_filtered",
        JSON.stringify($cartFiltered.get()),
    ),
);
