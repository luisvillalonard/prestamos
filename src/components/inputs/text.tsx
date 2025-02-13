import { Form, Input, InputProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputText(props: Pick<InputProps, Required<"name"> | "value" | "maxLength" | "onChange" | "readOnly" | "disabled" | "style" | "width"> & { label?: React.ReactNode, rules?: Rule[] }) {

    const { name, label, value, rules, maxLength, readOnly, disabled, style, width, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            style={{ 
                ...style,
                width: '100%',
             }}>
            <Input
                name={name}
                width={width}
                maxLength={maxLength}
                value={value || ''}
                readOnly={readOnly}
                disabled={disabled}
                style={style}
                onChange={onChange} />
        </Form.Item>
    )
}