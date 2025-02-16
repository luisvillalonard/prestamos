import { Form, Input, InputProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputText(props: Pick<InputProps, Required<"name"> | "value" | "maxLength" | "onChange" | "readOnly" | "disabled" | "style" | "width"> & { label?: React.ReactNode, rules?: Rule[] }) {

    const { name, label, value, rules, maxLength, readOnly, disabled, style, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            style={{
                ...style,
                marginBottom: 5,
            }}>
            <Input
                name={name}
                width="100%"
                maxLength={maxLength}
                value={value || ''}
                readOnly={readOnly}
                disabled={disabled}
                onChange={onChange}
                style={style} />
        </Form.Item>
    )
}