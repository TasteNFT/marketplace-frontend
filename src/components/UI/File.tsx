import { useCallback, useMemo } from 'react'
import { ChangeEvent, DragEvent, useEffect, useState } from 'react'
import { errors } from '../../utils/notification'
import { FileHelper } from '../../utils/file'
import _ from 'lodash'
interface IProps {
    accept: Array<string>
    onFile?: (callback: File | undefined) => void
    minWidth: number
    minHeight: number
    maxSize: number
    title?: string
    state: [
        File | undefined,
        React.Dispatch<React.SetStateAction<File | undefined>>
    ]
    name?: string
}

export const File = (props: IProps) => {
    const [file, setFile] = props.state

    const [url, setUrl] = useState<string>()
    const [drag, setDrag] = useState(false)
    let inputRef: HTMLInputElement | null = null

    const toString = useCallback(async () => {
        if (file) {
            setUrl(await FileHelper.getBase64(file))
        }
    }, [file])

    useEffect(() => {
        toString()
    }, [toString])

    const extensionString = useMemo(() => {
        return props.accept
            .map((i) => i.replace(/\./, '').toUpperCase())
            .join(', ')
    }, [props])

    function accepting(name: string) {
        const reg = new RegExp(
            props.accept.map((i) => `\\${i.toLowerCase()}`).join('|')
        )
        return name.toLowerCase().match(reg) ? true : false
    }

    async function filesHandler(files: FileList | null) {
        if (!files) return
        const file = _.head(files)
        if (!file) return

        if (!accepting(file.name)) {
            errors.invalidFileExtension()
            return
        }

        setFile(file)
        await toString()
        if (props.onFile) {
            props.onFile(file)
        }
    }

    async function onFile(e: ChangeEvent<HTMLInputElement>) {
        const { files } = e.target
        filesHandler(files)
    }

    function remove() {
        setUrl('')
        setFile(undefined)
        if (props.onFile) {
            props.onFile(file)
        }
    }
    function dragStartHandler(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        if (!drag) setDrag(true)
    }
    function dragLeaveHandler(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDrag(false)
    }
    async function dropHandler(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        await filesHandler(e.dataTransfer.files)
        setDrag(false)
    }
    return (
        <div className="file">
            <div className="file__input">
                <input
                    type="file"
                    ref={(e) => (inputRef = e)}
                    onChange={(e) => onFile(e)}
                    accept={props.accept.join(', ')}
                />
            </div>
            {props.title ? (
                <div className="file__title">{props.title}</div>
            ) : null}
            {!file ? (
                <div
                    className={`file__body ${
                        drag ? 'file__body-bordered' : ''
                    }`}
                    onClick={() => inputRef?.click()}
                    onDragStart={dragStartHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragStartHandler}
                    onDrop={dropHandler}
                >
                    <div className="file__await">
                        {!!props.name && (
                            <div className="file__meta">{props.name}</div>
                        )}
                        <div className="file__meta">
                            Min {props.minWidth}x{props.minHeight} px.
                        </div>
                        <div className="file__meta">{extensionString}</div>
                        <div className="file__meta">
                            {props.maxSize}MB max size.
                        </div>
                        <div className="file__text">
                            Drag and drop a file here,
                            <br />
                            or click to browse
                        </div>
                    </div>
                </div>
            ) : (
                <div className="file__body">
                    <div className="file__completed">
                        <div className="file__preview">
                            {(() => {
                                if (file.type.match(/video/))
                                    return (
                                        <video loop autoPlay muted>
                                            <source
                                                src={url}
                                                type={file.type}
                                            />
                                        </video>
                                    )
                                else if (file.type.match(/image/))
                                    return <img src={url} alt="" />
                                else return null
                            })()}
                        </div>
                        <div className="file__await">
                            {!!props.name && (
                                <div className="file__meta">{props.name}</div>
                            )}
                            <div className="file__meta">{file.name}</div>
                            <div className="file__meta">{file.size}</div>
                            <div
                                className="file__meta-delete"
                                onClick={() => remove()}
                            >
                                Delete file
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
