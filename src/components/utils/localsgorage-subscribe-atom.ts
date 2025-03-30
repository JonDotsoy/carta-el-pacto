import type { WritableAtom } from "nanostores";

export const localStorageSubscribeAtom = <T extends WritableAtom>(
  storeName: string,
  atom: T,
) => {
  if (globalThis.localStorage) {
    const storedValue = globalThis.localStorage.getItem(storeName);
    if (storedValue) {
      atom.set(JSON.parse(storedValue));
    }
    atom.listen((newState) => {
      globalThis.localStorage.setItem(storeName, JSON.stringify(newState));
    });
  }
};
