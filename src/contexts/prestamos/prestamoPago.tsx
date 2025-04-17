import { Urls } from "@hooks/useConstants"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps, ResponseResult } from "@interfaces/globales"
import { PrestamoPago } from "@interfaces/prestamos"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface PrestamoPagoContextState<T> extends GlobalContextState<T> {
    automaticos: (pagos: PrestamoPago[]) => Promise<ResponseResult<PrestamoPago[]>>,
}
export const PrestamosPagosContext = createContext<PrestamoPagoContextState<PrestamoPago>>({} as PrestamoPagoContextState<PrestamoPago>)

export default function PrestamosPagosProvider(props: Pick<ControlProps, "children">) {

    const urlBase = `${Urls.Prestamos.Base}/pagos`;
    const urlAutomaticos = `${urlBase}/automaticos`;
    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<PrestamoPago>(urlBase);
    const api = useFetch();

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            prestamoId: 0,
            prestamoCuotaId: 0,
            metodoPago: undefined,
            monto: 0,
            usuario: undefined,
            anulado: false,
        });
    }

    const automaticos = async (pagos: PrestamoPago[]): Promise<ResponseResult<PrestamoPago[]>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<PrestamoPago[]>;

        try {
            resp = await api.Post<PrestamoPago[]>(urlAutomaticos, pagos);
        } catch (error: any) {
            resp = errorResult<PrestamoPago[]>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }


    return (
        <PrestamosPagosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
            automaticos,
        }}>
            {children}
        </PrestamosPagosContext.Provider>
    )
}
