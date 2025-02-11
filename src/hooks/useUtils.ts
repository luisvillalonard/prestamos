import { useNavigate } from "react-router-dom";
import { RequestFilter } from "../interfaces/globales";
import { secretKey } from "./useConstants";
import * as CryptoJS from 'crypto-js';
import { GetProp, UploadProps } from "antd";

type StringOrNull = string | null | undefined;

export const getParamsUrlToString = (params: RequestFilter | null | undefined) => {

    if (!params) return '';

    const searchParams: Record<string, any> = new URLSearchParams();

    if (params?.pageSize)
        searchParams.append('pageSize', params.pageSize);

    if (params?.currentPage)
        searchParams.append('currentPage', params.currentPage);

    if (params?.filter)
        searchParams.append('filter', params.filter);

    if (searchParams.length === 0)
        return '';

    return '?' + searchParams.toString();
}

export const FormatDate_DDMMYYYY = (fecha: StringOrNull) => {
    if (!fecha)
        return null;

    try {
        // 1900-01-01 - YEAR-MONTH-DAY
        let [day, month, year] = fecha.split('-');

        day = day.length <= 1 ? '0'.concat(day) : day;
        month = month.length <= 1 ? '0'.concat(month) : month;

        // 01/01/1900 - DAY-MONTH-YEAR
        return [day, month, year].reverse().join('/');
    } catch (e) { }
}

export const FormatDate_YYYYMMDD = (fecha: string): StringOrNull => {
    if (!fecha)
        return null;

    try {
        // 01/01/1900 - DAY-MONTH-YEAR
        let [day, month, year] = fecha.split('/');

        day = day.length <= 1 ? '0'.concat(day) : day;
        month = month.length <= 1 ? '0'.concat(month) : month;

        // 1900-01-01 - YEAR-MONTH-DAY
        return [day, month, year].reverse().join('-');
    } catch (e) { }
}

export const GetTimeFromString = (time: string | null | undefined): Date | null => {
    if (!time)
        return null;

    try {
        // 01/01/1900 - DAY-MONTH-YEAR
        let [hours, minutes, seconds] = time.split(':');

        const tiempo: Date = new Date(1900, 1, 1, Number(hours), Number(minutes), Number(seconds));

        // 1900-01-01 - YEAR-MONTH-DAY
        return tiempo;
    } catch (e) { }

    return null;
}

export const FormatCedula = (cedula: StringOrNull): string => {
    if (!cedula)
        return '';

    try {
        // Filter non numbers
        const numeros = cedula.replace(/[^0-9\.]+/g, '');

        let inicio: string = numeros.slice(0, 3);

        let medio: string = '';
        if (numeros.length > 3) {
            medio = numeros.slice(3, 10)
        }

        let final: string = '';
        if (numeros.length > 3) {
            final = numeros.slice(10, 11)
        }

        return [inicio, medio, final].join('-');
    } catch (e) { }

    return '';
}

export const FormatNumber = (valor: any, pos_dec: number = 0) => {

    let strNumero: string = '0.00';
    if (IsNullOrUndefined(valor)) {
        return strNumero;
    };

    if (IsNullOrUndefined(pos_dec)) {
        pos_dec = 0;
    };

    try {
        let _numero = parseFloat(valor);
        if (!IsNullOrUndefined(_numero)) {
            strNumero = _numero.toFixed(pos_dec).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
    } catch (e) {
        return strNumero;
    }

    return strNumero;
}

export const GetFileBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const fileBase64 = (img: any) => {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onerror = reject
        fileReader.onload = function () {
            resolve(fileReader.result)
        }
        fileReader.readAsDataURL(img)
    })
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const encrypt = (valor: any) => {
    if (!valor) {
        return null;
    }

    return CryptoJS.AES.encrypt(JSON.stringify(valor), secretKey).toString();
}

export const decrypt = (valor: any) => {
    if (!valor) {
        return null;
    }

    const bytes = CryptoJS.AES.decrypt(valor, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function IsNullOrUndefined(e: any) {
    if (e === "undefined") {
        return true;
    } else if (e === undefined) {
        return true;
    } else if (e === null) {
        return true;
    };
    return false;
}

export const navUrl = (url: string) => {
    const nav = useNavigate();
    nav(url, { replace: true });
}

/* export function pickObjectKeys<T, K extends keyof T>(obj: T, keys: K[]) {
    let result = {} as Pick<T, K>
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key]
        }
    }
    return result
} */

export function stringifyObjectKeyValues<T extends Record<string, any>>(obj: T) {
    return Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        [key]: JSON.stringify(obj[key])
    }), {} as { [K in keyof T]: string })
}

export function ToTitleCase(value: string) {
    const newStr = value.split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');

    return newStr;
}