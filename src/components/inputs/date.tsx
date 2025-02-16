//DatePicker
import { DatePicker, DatePickerProps, Form } from "antd";
import { Rule } from "antd/es/form";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('es-DO');
dayjs.extend(customParseFormat);

export default function InputDate(props: Pick<DatePickerProps, Required<"name"> | "onChange" | "readOnly" | "disabled" | "placeholder" | "width" | "style"> & Omit<DatePickerProps, "value"> & {
    value: string | undefined,
    label?: React.ReactNode,
    rules?: Rule[]
}) {

    const { name, value, label, rules, readOnly, disabled, placeholder, style, onChange } = props
    const dateFormat = 'DD-MM-YYYY';


    console.log(value)

    return (
        <Form.Item
            name={name}
            label={label}
            //initialValue={!value ? undefined : dayjs(value, dateFormat)}
            rules={rules}
            style={{
                ...style,
                width: '100%',
                marginBottom: 8,
            }}>
            <DatePicker
                name={name}
                placeholder={placeholder}
                format={{
                    format: dateFormat,
                    type: 'mask',
                }}
                //defaultValue={getDateFromValue(value)}
                //value={dayjs('09-10-1980', dateFormat)}
                readOnly={readOnly}
                disabled={disabled}
                style={{ width: '100%' }}
                onChange={onChange} />
        </Form.Item>
    )
}