import { Form, FormItemProps } from "antd";

export default function FormItem(props: FormItemProps & {
    label?: React.ReactNode,
    required?: boolean,
    message?: string,
}) {

    const { name, label, rules, style, children } = props
    const labelIsText = typeof label === 'string'

    return (
        <Form.Item
            name={name}
            label={labelIsText ? <strong>{label}</strong> : <>{label}</>}
            rules={rules}
            style={style}>
            {children}
        </Form.Item>
    )
}