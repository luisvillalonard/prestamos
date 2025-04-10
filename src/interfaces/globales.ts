import { ButtonType } from 'antd/es/button';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { CSSProperties } from 'react';
import { IconType } from 'react-icons';

export interface ControlProps {
    children: React.ReactNode | React.ReactNode[],
    title?: string | React.ReactNode,
    icon?: React.ReactElement | JSX.Element | IconType,
    extra: React.ReactNode,
    message?: string,

    item?: any,
    list?: any[],
    filter?: string,

    active?: boolean,
    isOpen: boolean,
    inside?: boolean,
    loading?: boolean,
    wait?: boolean,

    size?: SizeType,
    buttonType?: ButtonType;
    buttonCircle?: boolean,
    style?: CSSProperties | undefined,
    color?: string,
    onClick?: (value: any) => void,
    onChange?: (value: any) => void,
    onCancel?: (value: any) => void,
    onRemove?: (value: any) => void,
    setFocus?: () => void,
}

export interface GlobalState<DataType> {
    data: DataType | undefined,
    isProcessing: boolean,
}

export enum SessionStorageKeys {
    User = '_p.usr',
    Token = '_p.tk',
    ShowMenu = '_p.sm',
    ShowUserInfo = '_p.sui',
}

export interface RequestFilter {
    pageSize: number,
    currentPage: number,
    filter: string
}

export interface PagingResult {
    totalRecords: number,
    totalPage: number,
    previousPage: number | null,
    nextPage: number | null,
    descripcion: string,
    pageSize: number,
    currentPage: number,
    filter: string
}

export interface ResponseResult<T> {
    ok: boolean,
    datos: T | undefined,
    mensaje: string | undefined,
    paginacion: PagingResult | undefined
}

export interface Anexo {
    id: number,
    imagen: string,
    extension: string
}

export interface DateArray {
    fecha: string,
    anterior: boolean,
}