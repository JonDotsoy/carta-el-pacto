const numberToChunkHex = (b: number) => b.toString(16).padStart(2, '0')


export const shaFromString = async (algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512', str: string) => {
    const payload = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest(algorithm, payload);
    return Array.from(new Uint8Array(digest), numberToChunkHex)
        .join('');
}

/** @deprecated use {@link shaFromString} instead */
export const sha1FromString = async (str: string) => shaFromString('SHA-1', str)
/** @deprecated use {@link shaFromString} instead */
export const sha256FromString = async (str: string) => shaFromString('SHA-256', str)
/** @deprecated use {@link shaFromString} instead */
export const sha512FromString = async (str: string) => shaFromString('SHA-512', str)
