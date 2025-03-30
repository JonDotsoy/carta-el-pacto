import type { ReadableAtom, WritableAtom } from "nanostores";
import {
  activeFilters,
  isShowingCartOnly,
  listActiveFilters,
  productsInCart,
} from "./states/cart";

type ProductsInCart = Record<string, number>;
type ActiveFilters = Record<string, boolean>;
type IsShowingCartOnly = boolean;

export class CartService {
  constructor(
    private readonly productsInCartAtom: WritableAtom<ProductsInCart> = productsInCart,
    private readonly activeFiltersAtom: WritableAtom<ActiveFilters> = activeFilters,
    private readonly listActiveFiltersAtom: ReadableAtom<{
      isShowingCartOnly: boolean;
      productsInCart: string[];
      activeFilters: string[];
    }> = listActiveFilters,
    private readonly isShowingCartOnlyAtom: WritableAtom<IsShowingCartOnly> = isShowingCartOnly,
  ) {}

  subscribeCategoryActive({ category }: { category: string }) {
    return {
      subscribe: (cb: (value: any) => any) => {
        return this.activeFiltersAtom.subscribe((s) => {
          cb(s[category]);
        });
      },
    };
  }

  subscribeCountProducts({
    "product-id": productId,
  }: {
    "product-id": string;
  }) {
    return {
      subscribe: (cb: (value: any) => any) => {
        return this.productsInCartAtom.subscribe((s) => {
          const v = Math.max(0, s[productId]);
          cb(Number.isNaN(v) ? 0 : v);
        });
      },
    };
  }

  subscribeFilteredByCategories({
    "product-id": productId,
    categories: categoriesStr,
  }: {
    "product-id": string;
    categories: string;
  }) {
    const categories: string[] = JSON.parse(categoriesStr);
    return {
      subscribe: (cb: (value: any) => any) => {
        return this.listActiveFiltersAtom.subscribe(
          ({ activeFilters, productsInCart, isShowingCartOnly }) => {
            if (isShowingCartOnly && !productsInCart.includes(productId))
              return cb("true");

            if (activeFilters.length === 0) return cb("");
            if (categories.length === 0) return cb("");

            cb(
              !categories.some((c) => activeFilters.includes(c)) ? "true" : "",
            );
          },
        );
      },
    };
  }

  subscribeShowPrice({
    "product-id": productId,
    "product-price": productPriceStr,
  }: {
    "product-id": string;
    "product-price": string;
  }) {
    const productPrice = Number(productPriceStr);

    return {
      subscribe: (cb: (value: any) => any) => {
        return this.productsInCartAtom.subscribe((s) => {
          const e = Math.max(s[productId], 0);
          const b = Number.isNaN(e) ? 0 : e;

          cb(productPrice * b);
        });
      },
    };
  }

  addProduct({
    "product-id": productId,
    count = 1,
  }: {
    "product-id": string;
    count?: number;
  }) {
    const state = this.productsInCartAtom.get();
    this.productsInCartAtom.set({
      ...state,
      [productId]: (state[productId] ?? 0) + count,
    });
  }

  removeProduct({
    "product-id": productId,
    count = 1,
  }: {
    "product-id": string;
    count?: number;
  }) {
    const state = this.productsInCartAtom.get();
    this.productsInCartAtom.set({
      ...state,
      [productId]: Math.max(0, (state[productId] ?? 0) - count),
    });
  }

  toggleFilter({ category }: { category: string }) {
    const state = this.activeFiltersAtom.get();
    this.activeFiltersAtom.set({
      ...state,
      [category]: !(state[category] ?? false),
    });
    this.offShowOnlyCart();
  }

  cleanFilters() {
    this.activeFiltersAtom.set({});
  }

  toggleShowOnlyCart() {
    const state = this.isShowingCartOnlyAtom.get();
    const newState = !state;
    this.isShowingCartOnlyAtom.set(newState);
    if (newState) this.cleanFilters();
  }

  offShowOnlyCart() {
    this.isShowingCartOnlyAtom.set(false);
  }
}

export const cartService = new CartService();
