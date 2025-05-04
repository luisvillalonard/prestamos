import { DateArray } from '@interfaces/globales';
import dayjs from 'dayjs';

dayjs.locale('es-DO');

export const dateFormat = 'DD-MM-YYYY';

export function DD_MM_YYYY(date?: Date): string {
    if (!date) return ''
    return dayjs(date).format(dateFormat)
}

export function Date_To_Dayjs(date?: Date): (dayjs.Dayjs | undefined) {
    if (!date) return undefined
    return dayjs(date)
}

export function String_To_Dayjs(value?: string): (dayjs.Dayjs | undefined) {
    if (!value) return undefined
    return dayjs(value, dateFormat)
}

export function String_To_Date(value?: string): (Date | undefined) {
    const date = String_To_Dayjs(value)
    if (!date) return undefined
    return date.toDate()
}

export function DateList(date: Date, dias: number[], cantidad: number): DateArray[] {

    const result: DateArray[] = [];
    const fechaInicio: Date = date;
    const fechaDeHoy: Date = new Date();

    while (result.length < cantidad) {
        if (dias.filter(num => num === fechaInicio.getDate()).length > 0) {
            const nuevaFecha = DD_MM_YYYY(fechaInicio)
            if (nuevaFecha) {
                result.push({
                    fecha: nuevaFecha,
                    anterior: fechaInicio < fechaDeHoy ? true : false
                });
            }
        }
        fechaInicio.setDate(fechaInicio.getDate() + 1);
    }

    return result;

}
