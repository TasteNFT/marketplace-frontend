import _ from 'lodash'
import { FC, useEffect, useState } from 'react'
import { useQuery } from '../../hooks/useQuery'

export interface ISelectOption<T = any> {
    label: string
    value: string | number
    meta?: T
}

export const Select: FC<{
    options: ISelectOption[]
    title?: string
    unknownValue?: string
    name?: string
    onChange?: (option?: ISelectOption) => void
    value?: ISelectOption
}> = ({ options, title, unknownValue, name, value, onChange }) => {
    const [show, setShow] = useState(false)
    const query = useQuery(name)
    const [st, setSt] = useState(
        options.find((op) => op.value === query.getValue()) ||
            value ||
            _.head(options)
    )

    function selecting(option: ISelectOption) {
        setShow(false)
        setSt(option)
        if (onChange) onChange(option)
        query.setValue(option.value.toString())
    }

    useEffect(() => {
        if (onChange) onChange(st)
    }, [])

    return (
        <div className="select">
            {title ? <div className="select__title">{title}</div> : null}
            <div className="select__body" onClick={() => setShow(!show)}>
                <div className="select__field">{st?.label || unknownValue}</div>
                <div
                    className={`select__options ${
                        show ? 'select__options--show' : ''
                    }`}
                >
                    {options.map((option) => (
                        <div
                            className={`select__option ${
                                option.value === st?.value
                                    ? 'select__option-active'
                                    : ''
                            }`}
                            onClick={() => selecting(option)}
                            key={option.value}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
