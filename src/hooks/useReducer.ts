import { Reducer, useReducer } from "react";
import reducer, { ACTIONS, ACTIONTYPES, initState, State } from "../reducers/global";
import { useFetch } from "./useFetch";
import { ResponseResult } from "../interfaces/globales";

export function useReducerHook<T extends unknown>(urlBase: string) {
    const [state, dispatch] = useReducer<Reducer<State<T>, ACTIONTYPES<T>>>(reducer, initState<T>());
    const api = useFetch();

    const editar = async (item: T): Promise<void> => {
        dispatch({ type: ACTIONS.EDITING, model: item });
    }

    const cancelar = async () => {
        dispatch({ type: ACTIONS.CANCEL });
    }

    const agregar = async (item: T): Promise<ResponseResult<T>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<T>;

        try {
            resp = await api.Post<T>(urlBase, item);
        } catch (error: any) {
            resp = errorResult<T>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: true });
        return resp;
    }

    const actualizar = async (item: T): Promise<ResponseResult<T>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<T>;

        try {
            resp = await api.Put<T>(urlBase, item);
        } catch (error: any) {
            resp = errorResult<T>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: true });
        return resp;
    }

    const todos = async (): Promise<void> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<T[]>;

        try {
            resp = await api.Get<T[]>(urlBase);
            dispatch({
                type: ACTIONS.FETCH_COMPLETE,
                data: resp.datos ?? Array<T>(),
                paginacion: resp.paginacion ?? initState<T>().paginacion,
                recargar: false
            });
        } catch {
            dispatch({
                type: ACTIONS.FETCH_COMPLETE,
                recargar: false
            });
        }

    }

    const errorResult = <T>(ex: any) => {
        let message = 'Situación inesperada tratando de ejecutar la petición'
        if (ex instanceof Error) message = ex.message
        return {
            ok: false,
            mensaje: message,
        } as ResponseResult<T>
    }

    return {
        state,
        dispatch,
        editar,
        cancelar,
        agregar,
        actualizar,
        todos,
        errorResult,
    }

}