import { ChangeEvent, ReactNode } from 'react'

interface IPropsWithState {
    state: Array<any>
}
interface IProps {
    title?: string
    helper?: string
    info?: string
    value?: string | number
    type?: string
    name?: string
    onChange?: (e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => void
    icon?: ReactNode
    textarea?: boolean
    iconTitle?: string
    errorMessage?: string
    filter?: RegExp
}

export const Input = ({
    helper,
    title,
    info,
    value,
    type,
    name,
    onChange,
    icon,
    textarea,
    iconTitle,
    errorMessage,
    filter,
}: IProps) => {
    const inputProps = {
        name,
        value,
        type,
    }
    function change(e: ChangeEvent<HTMLTextAreaElement & HTMLInputElement>) {
        if (filter && !e.target.value.match(filter)) {
            return
        }
        if (onChange) {
            onChange(e)
        }
    }
    return (
        <div className="input">
            {title ? <div className="input__title">{title}</div> : null}
            <div className="input__inner">
                {icon ? <div className="input__icon">{icon}</div> : null}
                {iconTitle ? (
                    <div className="input__logotitle">{iconTitle}</div>
                ) : null}
                <div className="input__body">
                    {textarea ? (
                        <textarea {...inputProps} onChange={change}></textarea>
                    ) : (
                        <input {...inputProps} onChange={change} />
                    )}
                    {helper ? (
                        <div className="input__helper">{helper}</div>
                    ) : null}
                    {errorMessage ? (
                        <div className="input__error">{errorMessage}</div>
                    ) : null}
                </div>
                {info ? <div className="input__info">{info}</div> : null}
            </div>
        </div>
    )
}

export const floatFilter = /^([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))?$/

export const InputWithState = (props: IProps & IPropsWithState) => {
    const [state, setState] = props.state

    return (
        <Input
            {...props}
            value={state}
            onChange={(e) => setState(e.target.value)}
        ></Input>
    )
}
