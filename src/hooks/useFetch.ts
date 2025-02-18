import { UserApp } from "@interfaces/seguridad"
import { ResponseResult, SessionStorageKeys } from "../interfaces/globales"

const baseFetch = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        mode: 'cors', // no-cors, *cors, same-origin,
        Authorization: '',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: undefined // body data type must match "Content-Type" header
}

export const useFetch = () => {

    async function customFetch<T>(url: string, options?: RequestInit): Promise<ResponseResult<T>> {

        let resp: ResponseResult<T> = {
            ok: false,
            datos: undefined,
            mensaje: undefined,
            paginacion: undefined
        }

        // Establezco el usuario logueado
        let user: UserApp | null = null;
        const dataStorage = sessionStorage.getItem(SessionStorageKeys.User)
        if (dataStorage) {
            user = JSON.parse(dataStorage);
        }

        const defaultHeaders = { ...baseFetch.headers, Authorization: user?.token || '' };
        const reqMethod = !options?.method ? baseFetch.method : options.method;
        const reqHeader = options?.headers ? { ...options.headers, ...defaultHeaders } : defaultHeaders;
        const reqBody = !options?.body ? null : JSON.stringify(options?.body);
        const reqOptions = {
            method: reqMethod,
            headers: reqHeader,
            body: reqBody,
        }

        try {
            const fetchResult = await fetch(`${process.env.VITE_API_URL}/api/${url}`, reqOptions);
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