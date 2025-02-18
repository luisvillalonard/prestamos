import { Form, InputNumber, InputNumberProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputNumbers(props: InputNumberProps & { label?: React.ReactNode, rules?: Rule[] }) {

    const { name, label, rules } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            style={{
                width: '100%',
            }}>
            <InputNumber {...props} style={{ width: '100%' }} />
        </Form.Item>
    )
}