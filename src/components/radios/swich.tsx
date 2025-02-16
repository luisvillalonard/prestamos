import { Form, Space, Switch, SwitchProps } from "antd"
import { Rule } from "antd/es/form"

export default function RadioSwitch(props: Pick<SwitchProps, "checked" | "onChange" | "disabled" | "id"> & {
    label: string,
    rules?: Rule[]
}) {

    const { id, label, checked, rules, disabled, onChange } = props

    return (
        <>
            <Form.Item
                valuePropName="checked"
                rules={rules}
                style={{ marginBottom: 6 }}>
                <Space>
                    <Switch id={id}
                        checked={checked}
                        disabled={disabled}
                        onChange={onChange} />
                    <span>{label}</span>
                </Space>
            </Form.Item>
        </>
    )
}