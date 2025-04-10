import { PagingResult, RequestFilter, ResponseResult } from "@interfaces/globales";

export enum ACTIONS {
    FETCHING = 'FETCHING',
    FETCH_COMPLETE = 'FETCH_COMPLETE',
    EDITING = 'EDITING',
    CANCEL = 'CANCEL',
    SET_DATA = 'SET_DATA',
    RELOAD = 'RELOAD',
}

export type ACTIONTYPES<DataType> =
    | { type: ACTIONS.FETCHING }
    | { type: ACTIONS.FETCH_COMPLETE }
    | { type: ACTIONS.EDITING; model?: DataType }
    | { type: ACTIONS.CANCEL }
    | { type: ACTIONS.SET_DATA; data: DataType[]; paginacion?: PagingResult; }
    | { type: ACTIONS.RELOAD; recargar: boolean }

export interface State<DataType> {
    modelo?: DataType,
    datos: DataType[],
    procesando: boolean,
    editando: boolean,
    recargar: boolean,
    cargado: boolean,
    paginacion?: PagingResult
}

export interface GlobalContextState<T> {
    state: State<T>,
    nuevo: () => void,
    editar: (item: T) => void,
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

        case ACTIONS.FETCHING: {
            return { ...state, procesando: true };
        }

        case ACTIONS.FETCH_COMPLETE: {
            return { ...state, procesando: false };
        }

        case ACTIONS.EDITING: {
            return { ...state, modelo: action.model };
        }

        case ACTIONS.CANCEL: {
            return { ...state, modelo: undefined, editando: false };
        }

        case ACTIONS.SET_DATA: {
            return { ...state, datos: action.data, paginacion: action.paginacion, cargado: true };
        }

        case ACTIONS.RELOAD: {
            return { ...state, recargar: action.recargar };
        }

        default: {
            return state;
        }
    }

};

export default reducer;