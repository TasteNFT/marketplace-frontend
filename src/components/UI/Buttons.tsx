import { FC, useMemo } from 'react'
import { ReactNode, useState } from 'react'
import { State } from '../../types/app'

export const Button: FC<{
    stylePreset?: 'semitransparent' | 'orange'
    type?: 'submit' | 'button' | 'reset'
    fill?: boolean
    className?: string
    children: ReactNode
    icon?: ReactNode
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    size?: 'large' | 'small'
    disabled?: boolean
}> = ({
    children,
    fill,
    className,
    icon,
    onClick,
    size,
    type,
    stylePreset,
    disabled,
}) => {
    const classNameFinal = useMemo(
        () =>
            [
                'btn',
                className,
                fill ? 'btn_fill' : '',
                size ? `btn_${size}` : '',
                stylePreset ? `btn_${stylePreset}` : '',
            ].join(' '),
        [className, fill, size, stylePreset]
    )
    return (
        <button
            className={classNameFinal}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {icon ? <div className="btn__icon">{icon}</div> : null}
            <span>{children}</span>
        </button>
    )
}

export interface IOption {
    label: string
    value: string
    gradient?: boolean
}

interface IProps {
    options: IOption[]
    onChange?: (value: IOption) => void
    state: State<IOption | undefined>
}

export const TextButtons = ({ options, onChange, state }: IProps) => {
    const [s, setS] = state

    function select(option: IOption) {
        if (setS) {
            setS(option)
        }
        if (onChange) {
            onChange(option)
        }
    }

    return (
        <div className="text-btns">
            {options.map((option) => (
                <div
                    className={`text-btns__btn ${
                        s?.value === option.value ? 'text-btns__btn-active' : ''
                    } ${option.gradient ? 'text-btns__btn-gradient' : ''}`}
                    key={option.value}
                    onClick={() => select(option)}
                >
                    {option.label}
                </div>
            ))}
        </div>
    )
}

export interface IconButtonProps {
    handler?: () => void
}

export const IconMenu: FC = ({ children }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="actions__menu">
            <div className="actions__menubtn">
                <IconButton handler={() => setOpen(!open)}>
                    <i className="fas fa-ellipsis-v"></i>
                </IconButton>
            </div>
            <div
                className={`actions__menulist ${
                    open ? 'actions__menulist-show' : ''
                }`}
            >
                {children}
            </div>
        </div>
    )
}

export const IconMenuButton: FC<IconButtonProps & { title: string }> = ({
    children,
    handler,
    title,
}) => {
    function click() {
        if (handler) handler()
    }
    return (
        <div className="actions__menuitem" onClick={click}>
            <div className="actions__menuicon">{children}</div>
            <div className="actions__menutitle">{title}</div>
        </div>
    )
}

export const IconButton: FC<IconButtonProps> = ({ children, handler }) => {
    function click() {
        if (handler) handler()
    }
    return (
        <div className="actions__item" onClick={click}>
            {children}
        </div>
    )
}

interface IconProps {
    children?: ReactNode
}
export const IconButtons = ({ children }: IconProps) => {
    return <div className="actions">{children}</div>
}
