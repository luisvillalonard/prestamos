//DatePicker
import { DatePicker, DatePickerProps, Form } from "antd"
import { Rule } from "antd/es/form"
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.locale('es-DO');
dayjs.extend(customParseFormat);

export default function InputDate(props: Pick<DatePickerProps, Required<"name"> | "onChange" | "readOnly" | "disabled" | "placeholder" | "width" | "style"> & Omit<DatePickerProps, "value"> & {
    value: string | undefined,
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, value, label, rules, readOnly, disabled, placeholder, width, style, onChange } = props
    const dateFormat = 'DD/MM/YYYY'

    return (
        <Form.Item
            name={name}
            label={label} 
            initialValue={!value ? undefined : dayjs(value, dateFormat)}
            rules={rules}>
            <DatePicker
                name={name}
                placeholder={placeholder}
                format={dateFormat}
                value={!value ? undefined : dayjs(value, dateFormat)}
                readOnly={readOnly}
                disabled={disabled}
                width={width}
                style={style}
                onChange={onChange} />
        </Form.Item>
    )
}