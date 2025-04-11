//DatePicker
import { Date_To_Dayjs, String_To_Dayjs } from "@hooks/useDate";
import { FormatDate_DDMMYYYY } from "@hooks/useUtils";
import { DatePicker, DatePickerProps, Form } from "antd";
import { Rule } from "antd/es/form";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('es-DO');
dayjs.extend(customParseFormat);

const dateFormat = 'DD-MM-YYYY';


export default function InputDate(props: Pick<DatePickerProps, Required<"name"> | "onChange" | "readOnly" | "disabled" | "placeholder" | "width" | "style"> &
    Omit<DatePickerProps, "value" | "minDate" | "defaultValue"> & {
        value: string | undefined,
        label?: React.ReactNode,
        minDate: Date | undefined,
        defaultValue: Date | undefined,
        rules?: Rule[]
    }) {

    const { name, value, label, minDate, defaultValue, rules, disabled, placeholder, style, onChange } = props
    const startInDate = !minDate ? undefined : dayjs(FormatDate_DDMMYYYY(new Date().toISOString().substring(0, 10))!, dateFormat)
    const startDefaultValue = !defaultValue ? undefined : dayjs(FormatDate_DDMMYYYY(new Date().toISOString().substring(0, 10))!, dateFormat)

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
                minDate={startInDate}
                defaultValue={startDefaultValue}
                disabled={disabled}
                onChange={onChange}
                style={{
                    width: '100%',
                    ...style,
                }} />
        </Form.Item>
    )
}

interface InputDatePickerProps extends Omit<DatePickerProps, "value" | "minDate" | "defaultValue"> { }

export function InputDatePicker(props: InputDatePickerProps & {
    minDate?: Date,
    value?: string,
}) {

    const { minDate, value, disabled, placeholder, onChange } = props

    return (
        <DatePicker
            placeholder={placeholder}
            minDate={Date_To_Dayjs(minDate)}
            defaultValue={String_To_Dayjs(value)}
            format={dateFormat}
            disabled={disabled}
            onChange={onChange}
            style={{ width: '100%' }} />
    )
}