export const useValidate = () => {
    return {
        url: {
            isTwitter(str: string): boolean {
                return (
                    !str ||
                    !!(
                        str.match(
                            /http(s)?:\/\/(www\.)?twitter\.\w+(\/\w+)?(\/)?/
                        ) || []
                    ).length
                )
            },
            isInstagram(str: string): boolean {
                return (
                    !str ||
                    !!(
                        str.match(
                            /http(s)?:\/\/(www\.)?instagram\.\w+(\/\w+)?(\/)?/
                        ) || []
                    ).length
                )
            },
            isTwitch(str: string): boolean {
                return (
                    !str ||
                    !!(
                        str.match(
                            /http(s)?:\/\/(www\.)?twitch\.\w+(\/\w+)?(\/)?/
                        ) || []
                    ).length
                )
            },
            isOnlyfans(str: string): boolean {
                return (
                    !str ||
                    !!(
                        str.match(
                            /http(s)?:\/\/(www\.)?onlyfans\.\w+(\/\w+)?(\/)?/
                        ) || []
                    ).length
                )
            },
        },
        isEmail(str: string): boolean {
            return (
                !str ||
                !!(
                    str.match(
                        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                    ) || []
                ).length
            )
        },
        isName(str: string): boolean {
            // console.log()
            return !!str
        },
    }
}

export function useValidateHelper(errorMsg: string, validator: boolean) {
    return !validator ? errorMsg : undefined
}

export const useValidateHasMistake = () => {
    return (mistakes: Array<string | undefined>) => {
        return mistakes.reduce((acc, m) => {
            if (m) acc = true
            return acc
        }, false)
    }
}
