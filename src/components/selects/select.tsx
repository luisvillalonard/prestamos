import { Form, Select, SelectProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputSelect(props: Pick<SelectProps, "value" | "options" | "onChange" | "disabled" | "placeholder" | "labelRender" | "allowClear" | "style"> & {
    name: string,
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, label, value, rules, options, disabled, placeholder, allowClear, style, labelRender, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            style={{
                ...style,
                marginBottom: 6,
            }}>
            <Select
                allowClear={allowClear}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                labelRender={labelRender}
                options={options}
                onChange={onChange}
                style={style}>
            </Select>
        </Form.Item>
    )
}