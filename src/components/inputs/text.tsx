import { Form, Input, InputProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputText(props: InputProps & {
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, label, rules, value, disabled } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}>
            <Input
                value={value}
                disabled={disabled}
                style={{
                    width: '100%',
                    ...props.style,
                }} />
        </Form.Item>
    )
}