import { Form, Radio, RadioGroupProps } from "antd"
import { Rule } from "antd/es/form"


export default function InputRadioGroup(props: RadioGroupProps & {
    label?: React.ReactNode,
    rules?: Rule[],
    block?: boolean,
}) {

    const { name, label, value, rules, disabled, block, style, children, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            initialValue={value}
            style={{
                ...style,
                width: '100%',
                marginBottom: 5
            }}>
            <Radio.Group
                block={block}
                value={value}
                disabled={disabled}
                optionType="button"
                buttonStyle="solid"
                onChange={onChange}>
                {children}
            </Radio.Group>
        </Form.Item>
    )
}