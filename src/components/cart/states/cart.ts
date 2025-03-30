import { atom, computed } from "nanostores";
import { localStorageSubscribeAtom } from "../../utils/localsgorage-subscribe-atom";

export const productsInCart = atom<Record<string, number>>({});
export const activeFilters = atom<Record<string, boolean>>({});
export const isShowingCartOnly = atom<boolean>(false);
export const listActiveFilters = computed(
  [productsInCart, activeFilters, isShowingCartOnly],
  (productsInCart, activeFilters, isShowingCartOnly) => {
    return {
      isShowingCartOnly,
      productsInCart: Object.entries(productsInCart)
        .filter(([k, v]) => v > 0)
        .map(([k]) => k),
      activeFilters: Object.entries(activeFilters)
        .filter(([key, active]) => active)
        .map(([k]) => k),
    };
  },
);

localStorageSubscribeAtom("settings_products_in_cart", productsInCart);
localStorageSubscribeAtom("settings_active_filters", activeFilters);
