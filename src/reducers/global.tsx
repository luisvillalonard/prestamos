import { PagingResult, RequestFilter, ResponseResult } from "@interfaces/globales";

export enum ACTIONS {
    EDITING = 'EDITING',
    FETCHING = 'FETCHING',
    FETCH_COMPLETE = 'FETCH_COMPLETE',
    CANCEL = 'CANCEL',
}

export type ACTIONTYPES<DataType> =
    | { type: ACTIONS.EDITING; model: DataType | undefined }
    | { type: ACTIONS.CANCEL }
    | { type: ACTIONS.FETCHING }
    | { type: ACTIONS.FETCH_COMPLETE; data?: DataType[]; model?: DataType; paginacion?: PagingResult; recargar?: boolean }

export interface State<DataType> {
    modelo?: DataType | null,
    datos: DataType[],
    procesando: boolean,
    editando: boolean,
    recargar: boolean,
    cargado: boolean,
    paginacion?: PagingResult
}

export interface GlobalContextState<T> {
    state: State<T>,
    editar: (item: T) => Promise<void>,
    agregar: (item: T) => Promise<ResponseResult<T>>,
    actualizar: (item: T) => Promise<ResponseResult<T>>,
    todos: (filter?: RequestFilter) => void,
    cancelar: () => void,
}

export function initState<DataType extends unknown>() {
    const init: State<DataType> = {
        datos: [],
        procesando: false,
        editando: false,
        recargar: false,
        cargado: false,
    };
    return init;
}

const reducer = <DataType extends unknown>(state: State<DataType>, action: ACTIONTYPES<DataType>): State<DataType> => {

    switch (action.type) {

        case ACTIONS.EDITING: {
            return {
                ...state,
                modelo: action.model,
                editando: true
            };
        }

        case ACTIONS.CANCEL: {
            return {
                ...state,
                modelo: null,
                editando: false
            };
        }

        case ACTIONS.FETCHING: {
            return {
                ...state,
                procesando: true,
            };
        }

        case ACTIONS.FETCH_COMPLETE: {
            return {
                ...state,
                modelo: action.model,
                datos: action.data ?? [],
                editando: false,
                procesando: false,
                recargar: action.recargar ?? false,
                cargado: true,
            };
        }

        default: {
            return state;
        }
    }

};

export default reducer;