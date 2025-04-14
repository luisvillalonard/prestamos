import { Urls } from "@hooks/useConstants"
import { DD_MM_YYYY } from "@hooks/useDate"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { Cliente } from "@interfaces/clientes"
import { ControlProps, ResponseResult } from "@interfaces/globales"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface ClienteContextState<T> extends GlobalContextState<T> {
    porCodigo: (documento: string) => Promise<ResponseResult<T>>,
}

export const ClientesContext = createContext<ClienteContextState<Cliente>>({} as ClienteContextState<Cliente>)

export default function ClientesProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<Cliente>(Urls.Clientes.Base);
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

    const porCodigo = async (documento: string): Promise<ResponseResult<Cliente>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Cliente>;

        try {
            resp = await api.Get<Cliente>(`${Urls.Clientes.Base}/documento?documento=${documento}`);
        } catch (error: any) {
            resp = errorResult<Cliente>(error);
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
            todos,
            porCodigo,
        }}>
            {children}
        </ClientesContext.Provider>
    )
}
