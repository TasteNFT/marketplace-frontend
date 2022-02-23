import { useCallback, useEffect, useState } from 'react'
import { FileHelper } from '../utils/file'

export function useFileChanger(
    sha256: string | undefined | null,
    link: string
) {
    const [file, setFile] = useState<File>()
    const [changed, setChanged] = useState(false)
    const [show, setShow] = useState(!sha256)

    const initFile = useCallback(async () => {
        if (!sha256) return
        setFile(await FileHelper.getFileFromUrl(link))
        setShow(true)
    }, [link, sha256])

    useEffect(() => {
        initFile()
    }, [initFile])

    return {
        file,
        setFile,
        changed,
        setChanged,
        show,
        setShow,
    }
}
