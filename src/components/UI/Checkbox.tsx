interface IPropsCheckbox {
    title?: string
    state: [boolean, (b: boolean) => void]
}

export const Checkbox = ({ title, state }: IPropsCheckbox) => {
    const [data, setData] = state
    return (
        <div className="checkbox">
            <div
                className={`checkbox__dot ${
                    data ? 'checkbox__dot-active' : ''
                }`}
                onClick={() => setData(!data)}
            ></div>
            {title ? <div className="checkbox__title">{title}</div> : null}
        </div>
    )
}
