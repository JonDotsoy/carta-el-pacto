import { atom } from "nanostores";
import { localStorageSubscribeAtom } from "../../utils/localsgorage-subscribe-atom";

export const productsInCart = atom<Record<string, number>>({})
export const activeFilters = atom<Record<string, boolean>>({})
export const isShowingCartOnly = atom<boolean>(false)

localStorageSubscribeAtom("settings_products_in_cart", productsInCart)
localStorageSubscribeAtom("settings_active_filters", activeFilters)
