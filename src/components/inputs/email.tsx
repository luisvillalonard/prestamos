import { Form, Input, InputProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputEmail(props: Pick<InputProps, Required<"name"> | "value" | "maxLength" | "onChange" | "style"> & {
    label?: React.ReactNode, rules?: Rule[]
}) {

    const { name, label, value, rules, style, maxLength, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            style={{
                ...style,
                marginBottom: 6,
            }}
            rules={[
                ...(rules ?? []), {
                    type: "email",
                    message: `Este no es un correo válido`
                }
            ]}>
            <Input
                name={name}
                maxLength={maxLength}
                value={value || ''}
                onChange={onChange} />
        </Form.Item>
    )
}