export function useShare(name: string, link?: string) {
    const url = link ? link : window.location
    return {
        telegram() {
            window.open(`https://t.me/share/url?url=${url}&text=${name}`)
        },
        twitter() {
            window.open(
                `https://twitter.com/intent/tweet?url=${url}&text=${name}`
            )
        },
        facebook() {
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${name}`
            )
        },
    }
}
