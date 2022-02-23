interface IProps {
    state: [number, React.Dispatch<React.SetStateAction<number>>]
    title?: string
    min?: number
    max?: number
}

export const Counter = ({ state, title, min, max }: IProps) => {
    const [count, setCount] = state
    const isMin = count <= (min || 0)
    const isMax = count >= (max || 1000)

    function increment() {
        if (isMax) return
        setCount(count + 1)
    }
    function decrement() {
        if (isMin) return
        setCount(count - 1)
    }

    return (
        <div className="counter">
            {title ? <div className="counter__title">{title}</div> : null}
            <div className="counter__body">
                <div
                    className={`counter__btn ${
                        isMin ? 'counter__btn-disabled' : ''
                    }`}
                    onClick={decrement}
                >
                    -
                </div>
                <div className="counter__field">{count}</div>
                <div
                    className={`counter__btn ${
                        isMax ? 'counter__btn-disabled' : ''
                    }`}
                    onClick={increment}
                >
                    +
                </div>
            </div>
        </div>
    )
}
