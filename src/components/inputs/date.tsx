//DatePicker
import { DatePicker, DatePickerProps, Form } from "antd";
import { Rule } from "antd/es/form";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('es-DO');
dayjs.extend(customParseFormat);

const dateFormat = 'DD-MM-YYYY';

export default function InputDate(props: Pick<DatePickerProps, Required<"name"> | "onChange" | "readOnly" | "disabled" | "placeholder" | "width" | "style"> & Omit<DatePickerProps, "value"> & {
    value: string | undefined,
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, value, label, rules, disabled, placeholder, style, onChange } = props

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            initialValue={!value ? undefined : dayjs(value, dateFormat)}
            style={{
                width: '100%',
            }}>
            <DatePicker
                placeholder={placeholder}
                format={{
                    format: dateFormat,
                    type: 'mask',
                }}
                //value={dayjs('09-10-1980', dateFormat)}
                disabled={disabled}
                onChange={onChange}
                style={{
                    width: '100%',
                    ...style,
                }} />
        </Form.Item>
    )
}