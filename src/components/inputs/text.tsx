import { Form, Input, InputProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputText(props: InputProps & {
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, label, rules } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            style={{
                width: '100%',
            }}>
            <Input
                style={{
                    width: '100%',
                    ...props.style,
                }} />
        </Form.Item>
    )
}