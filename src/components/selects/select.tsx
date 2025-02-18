import { Form, Select, SelectProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputSelect(props: SelectProps & {
    name: string,
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, label, rules, options, defaultValue, style } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}>
            <Select
                defaultValue={defaultValue}
                options={options}
                style={{
                    width: '100%',
                    ...style,
                }}>
            </Select>
        </Form.Item>
    )
}