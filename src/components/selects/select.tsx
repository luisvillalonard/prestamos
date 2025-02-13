import { Form, Select, SelectProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputSelect(props: Pick<SelectProps, "value" | "options" | "onChange" | "disabled" | "placeholder" | "labelRender" | "allowClear"> & {
    name: string,
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, label, value, rules, options, disabled, placeholder, allowClear, labelRender, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}>
            <Select
                allowClear={allowClear}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                labelRender={labelRender}
                options={options}
                onChange={onChange}>
            </Select>
        </Form.Item>
    )
}