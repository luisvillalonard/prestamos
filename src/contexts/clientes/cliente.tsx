import { Urls } from "@hooks/useConstants"
import { DD_MM_YYYY } from "@hooks/useDate"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { getParamsUrlToString } from "@hooks/useUtils"
import { Cliente, VwCliente } from "@interfaces/clientes"
import { ControlProps, RequestFilter, ResponseResult } from "@interfaces/globales"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface ClienteContextState<T> extends GlobalContextState<T> {
    todos: (filtro?: RequestFilter) => Promise<ResponseResult<VwCliente[]>>,
    activos: (filtro?: RequestFilter) => Promise<ResponseResult<VwCliente[]>>,
    porId: (id: number) => Promise<ResponseResult<T>>,
    porDocumento: (documento: string) => Promise<ResponseResult<T>>,
    cargar: (clientes: T[]) => Promise<ResponseResult<T[]>>,
}

export const ClientesContext = createContext<ClienteContextState<Cliente>>({} as ClienteContextState<Cliente>)

export default function ClientesProvider(props: Pick<ControlProps, "children">) {

    const urlBase = `${Urls.Clientes.Base}`;
    const urlTodos = `${Urls.Clientes.Base}/todos`;
    const urlActivos = `${Urls.Clientes.Base}/activos`;
    const urlPorId = `${Urls.Clientes.Base}/byId`;
    const urlDocumento = `${Urls.Clientes.Base}/documento`;
    const urlCarga = `${Urls.Clientes.Base}/carga`;
    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, errorResult } = useReducerHook<Cliente>(urlBase);
    const api = useFetch();

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            codigo: '',
            empleadoId: '',
            nombres: '',
            apellidos: '',
            documentoTipo: undefined,
            documento: '',
            sexo: undefined,
            fechaCreacion: DD_MM_YYYY(new Date()),
            activo: true,
        });
    }

    const porId = async (id: number): Promise<ResponseResult<Cliente>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Cliente>;

        try {
            resp = await api.Get<Cliente>(`${urlPorId}?id=${id}`);
        } catch (error: any) {
            resp = errorResult<Cliente>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;
    }

    const porDocumento = async (documento: string): Promise<ResponseResult<Cliente>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Cliente>;

        try {
            resp = await api.Get<Cliente>(`${urlDocumento}?documento=${documento}`);
        } catch (error: any) {
            resp = errorResult<Cliente>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;
    }

    const todos = async (req?: RequestFilter): Promise<ResponseResult<VwCliente[]>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<VwCliente[]>;

        try {
            const params = getParamsUrlToString(req);
            resp = await api.Get<VwCliente[]>(`${urlTodos}${params}`.trim());
        } catch (error: any) {
            resp = errorResult<VwCliente[]>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }

    const activos = async (req?: RequestFilter): Promise<ResponseResult<VwCliente[]>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<VwCliente[]>;

        try {
            const params = getParamsUrlToString(req);
            resp = await api.Get<VwCliente[]>(`${urlActivos}${params}`.trim());
        } catch (error: any) {
            resp = errorResult<VwCliente[]>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }

    const cargar = async (clientes: Cliente[]): Promise<ResponseResult<Cliente[]>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Cliente[]>;

        try {
            resp = await api.Post<Cliente[]>(urlCarga, clientes);
        } catch (error: any) {
            resp = errorResult<Cliente[]>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }

    return (
        <ClientesContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            porId,
            porDocumento,
            todos,
            activos,
            cargar,
        }}>
            {children}
        </ClientesContext.Provider>
    )
}
