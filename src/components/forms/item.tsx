import { Form, FormItemProps } from "antd";

export default function FormItem(props: FormItemProps & {
    label?: React.ReactNode,
    required?: boolean,
    message?: string,
}) {

    const { name, label, rules, children } = props


    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}>
            {children}
        </Form.Item>
    )
}