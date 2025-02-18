import { Form, Select, SelectProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputSelect(props: SelectProps & {
    name: string,
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
            <Select
                style={{
                    width: '100%',
                    ...props.style,
                }}>
            </Select>
        </Form.Item>
    )
}