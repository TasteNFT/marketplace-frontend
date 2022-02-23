export function OGTitleHelper(title: string) {
    return `${title} | TasteNFT`
}

export function OGSetTitle(title: string) {
    document
        .querySelector('meta[property="og:title"]')
        ?.setAttribute('content', title)
    document.title = title
}

export function OGSetDescription(description: string) {
    document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute('content', description)
    document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', description)
}

export function OGSetImage(sha256: string) {
    document
        .querySelector('meta[property="og:image"]')
        ?.setAttribute('content', `${window.location.origin}/sha256/${sha256}`)
}

export function OGUpdateUrl() {
    document
        .querySelector('meta[property="og:url"]')
        ?.setAttribute('content', window.location.href)
}
