import { HElement as HTMLElement } from "./h-element";

export class DataCurrency extends HTMLElement {
  // connectedCallback() {
  //     try {
  //         const currency = this.dataset.currency;
  //         const value = this.dataset.value;
  //         this.innerText = new Intl.NumberFormat("es-CL", {
  //             style: "currency",
  //             currency,
  //             currencyDisplay: "symbol",
  //             minimumFractionDigits: 0,
  //             maximumFractionDigits: 0,
  //         }).format(Number(value));
  //     } catch { }
  // }
  // disconnectedCallback() { }
}
