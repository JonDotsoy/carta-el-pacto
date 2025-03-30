import { cartService } from "./cart/cart.service";


const attempt = <T>(cb: () => T) => {
    try {
        return cb()
    } catch {
        return null
    }
}

namespace attrUtils {
    export const searchEndsWith = (namedNodeMap: NamedNodeMap, searchString: string) => {
        for (const attr of namedNodeMap) {
            if (attr.name.endsWith(searchString)) {
                return of(attr)
            }
        }
        return null
    }

    export const of = (attr: Attr | null) => {
        const value = attr?.value;

        return {
            attr,
            string: () => value,
            number: () => {
                const number = Number(value)
                if (Number.isNaN(number)) return undefined
                return number
            },
        }
    }
}

const parseNumberFormatOptions = (input: object): object => {
    return input
}

const services = {
    cartService,
}

const calls = new Map<string, (...args: any[]) => void>()

for (const [serviceName, service] of Object.entries(services)) {
    for (const methodNames of Reflect.ownKeys(Reflect.getPrototypeOf(service)!)) {
        if (!(typeof methodNames === 'string') || methodNames === 'contructor') continue

        const k = `${serviceName}.${methodNames}`;
        calls.set(k, (a: object) => {
            // @ts-ignore
            return service[methodNames](a);
        })

    }
}

console.log(calls)

const withSubscribe = (value: unknown): value is { subscribe: (...args: any[]) => any } => typeof value === 'object' && value !== null && Reflect.has(value, 'subscribe') && typeof Reflect.get(value, 'subscribe') === 'function'

const createSubscribe = (value: unknown, cb: (value: any) => void) => {

    if (withSubscribe(value)) {
        const unsub = value.subscribe(cb)

        if (typeof unsub === 'function') return unsub;
    }

    return () => {

    }
}

export abstract class HElement {
    // abstract transform?(): void
    // abstract onClick?(event: MouseEvent): void

    // static 

    static define(name: string) {
        if (globalThis.customElements) {
            const unsubs = new Set<() => void>()

            globalThis.customElements.define(name, class extends HTMLElement {
                connectedCallback() {
                    const hIntl = attrUtils.of(this.attributes.getNamedItem('h-intl')).string()?.toLowerCase()
                    if (hIntl) {
                        const locale = attrUtils.of(this.attributes.getNamedItem('h-locale')).string()
                        if (hIntl === "numberformat") {
                            const value = attrUtils.of(this.attributes.getNamedItem('h-value')).number()
                            if (value) {
                                this.innerText = new Intl.NumberFormat(locale,
                                    parseNumberFormatOptions({
                                        style: attrUtils.of(this.attributes.getNamedItem('h-intl-style')).string(),
                                        currency: attrUtils.of(this.attributes.getNamedItem('h-intl-currency')).string(),
                                        currencyDisplay: attrUtils.of(this.attributes.getNamedItem('h-intl-currencyDisplay')).string(),
                                        minimumFractionDigits: attrUtils.of(this.attributes.getNamedItem('h-intl-minimum-fraction-digits')).number(),
                                        maximumFractionDigits: attrUtils.of(this.attributes.getNamedItem('h-intl-maximum-fraction-digits')).number(),
                                    })
                                ).format(value)
                            }
                        }
                    }
                    const hCall = attrUtils.of(this.attributes.getNamedItem('h-call')).string()
                    if (hCall && calls.has(hCall)) {
                        const attrs = Array.from(Object.values(this.attributes)).filter(attr => attr.name.startsWith('h-call-'))

                        this.addEventListener('click', () => {
                            const a = Object.fromEntries(
                                attrs.map(attr => [
                                    attr.name.substring('h-call-'.length),
                                    attrUtils.of(attr).string(),
                                ])
                            )
                            calls.get(hCall)!(a);
                        })
                    }
                    const attrWithSub = attrUtils.searchEndsWith(this.attributes, ":h-call")
                    if (attrWithSub) {
                        const attrName = attrWithSub.attr!.name.substring(0, attrWithSub.attr!.name.length - ":h-call".length)
                        const attrs = Array.from(Object.values(this.attributes)).filter(attr => attr.name.startsWith('h-call-'))
                        const a = Object.fromEntries(
                            attrs.map(attr => [
                                attr.name.substring('h-call-'.length),
                                attrUtils.of(attr).string(),
                            ])
                        )

                        unsubs.add(
                            createSubscribe(calls.get(attrWithSub.string()!)!(a), (value: any) => {
                                const attr = this.attributes.getNamedItem(attrName);
                                if (attr) {
                                    attr.value = value;
                                    return
                                }
                                const newAttr = globalThis.document.createAttribute(attrName);
                                newAttr.value = value;
                                this.attributes.setNamedItem(newAttr)
                            })
                        )
                    }
                }
                disconnectedCallback() {
                    for (const unsub of unsubs) {
                        unsub()
                    }
                }
            })
        }
    }
}
