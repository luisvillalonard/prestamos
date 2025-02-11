import { ResponseResult } from "../interfaces/globales"
import { useConstants } from "./useConstants"

export const useFetch = () => {

    const { API_URL } = useConstants()

    async function customFetch<T>(url: string, options?: RequestInit): Promise<ResponseResult<T>> {

        let resp: ResponseResult<T> = {
            ok: false,
            datos: undefined,
            mensaje: undefined,
            paginacion: undefined
        }

        const token = '';
        const defaultHeaders = { ...API_URL.ApiDefaultProps.headers, Authorization: token };
        const reqMethod = !options?.method ? API_URL.ApiDefaultProps.method : options.method;
        const reqHeader = options?.headers ? { ...options.headers, ...defaultHeaders } : defaultHeaders;
        const reqBody = !options?.body ? null : JSON.stringify(options?.body);
        const reqOptions = {
            method: reqMethod,
            headers: reqHeader,
            body: reqBody,
        }

        try {
            const fetchResult = await fetch(`${API_URL.Base}/api/${url}`, reqOptions);
            const result = await fetchResult.json();

            if (fetchResult.ok) {
                return result;
            }

            return Promise.resolve({
                ok: false,
                datos: result,
                mensaje: fetchResult.statusText
            } as ResponseResult<T>);

        } catch (err: unknown) {
            const { message } = err as Error;
            return Promise.resolve({
                ...resp,
                ok: false,
                mensaje: (message || 'Situación inesperada tratando de obtener los datos')
            });
        }
    }

    const Get = async <T extends unknown>(url: string) => await customFetch<T>(url);

    const Post = async <T extends unknown>(url: string, item: T | any) => {
        return await customFetch<T>(url, {
            method: 'POST',
            body: item
        })
    }

    const Put = async <T extends unknown>(url: string, item: T | any) => {
        return await customFetch<T>(url, {
            method: 'PUT',
            body: item
        })
    }

    const Del = async (url: string, item?: any) => {
        return await customFetch(url, {
            method: 'DELETE',
            body: item
        })
    }

    return {
        Get,
        Post,
        Put,
        Del,
    }

}