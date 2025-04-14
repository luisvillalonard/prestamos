import { InputNumber, InputNumberProps } from "antd"


export default function InputNumbers(props: InputNumberProps) {

    const { name, value, min, disabled, style, onFocus, onChange } = props

    return (
        <InputNumber
            name={name}
            value={value}
            min={min}
            disabled={disabled}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            onFocus={onFocus}
            onChange={onChange}
            style={{
                ...style,
                width: '100%'
            }} />
    )
}