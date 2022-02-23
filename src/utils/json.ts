export const json = {
    stringify(data: any[] | object) {
        return JSON.stringify(data)
    },
    parse<T>(json?: string | null) {
        if (!json) return null
        try {
            return JSON.parse(json) as T
        } catch {
            return null
        }
    },
}
