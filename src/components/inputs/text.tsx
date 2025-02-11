import { Form, Input, InputProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputText(props: Pick<InputProps, Required<"name"> | "value" | "maxLength" | "onChange"> & { label?: React.ReactNode, rules?: Rule[] }) {

    const { name, label, value, rules, maxLength, onChange } = props

    return (
        <Form.Item name={name} label={label} rules={rules}>
            <Input name={name} maxLength={maxLength} value={value || ''} onChange={onChange} />
        </Form.Item>
    )
}