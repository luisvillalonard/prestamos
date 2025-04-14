import { Urls } from "@hooks/useConstants"
import { DD_MM_YYYY } from "@hooks/useDate"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { getParamsUrlToString } from "@hooks/useUtils"
import { ControlProps, RequestFilter, ResponseResult } from "@interfaces/globales"
import { Prestamo } from "@interfaces/prestamos"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface PrestamoContextState<T> extends GlobalContextState<T> {
    activos: (filtro: RequestFilter) => Promise<ResponseResult<Prestamo[]>>,
    actual: (clienteId: number) => Promise<ResponseResult<T>>,
    porId: (id: number) => Promise<ResponseResult<T>>,
}

export const PrestamosContext = createContext<PrestamoContextState<Prestamo>>({} as PrestamoContextState<Prestamo>)

export default function PrestamosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<Prestamo>(Urls.Prestamos.Base);
    const api = useFetch();

    const nuevo = (): void => {
        const diaActual: string = DD_MM_YYYY(new Date());

        editar({
            id: 0,
            codigo: '',
            cliente: undefined,
            fechaRegistro: diaActual,
            fechaCredito: diaActual,
            formaPago: undefined,
            metodoPago: undefined,
            moneda: undefined,
            cantidadCuotas: 0,
            deudaInicial: 0,
            interes: 0,
            capital: 0,
            amortizacion: 0,
            saldoFinal: 0,
            estado: undefined,
            destino: '',
            acesor: undefined,
            usuario: undefined,
            cancelado: false,
            cuotas: [],
            reenganche: false,
            deudaNueva: 0,
            aplicaDescuento: false,
        });
    }

    const activos = async (filtro: RequestFilter): Promise<ResponseResult<Prestamo[]>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Prestamo[]>;

        try {
            resp = await api.Get<Prestamo[]>(`${Urls.Prestamos.Base}/activos${getParamsUrlToString(filtro)}`);
        } catch (error: any) {
            resp = errorResult<Prestamo[]>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }

    const actual = async (clienteId: number): Promise<ResponseResult<Prestamo>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Prestamo>;

        try {
            resp = await api.Get<Prestamo>(`${Urls.Prestamos.Base}/actual?id=${clienteId}`);
        } catch (error: any) {
            resp = errorResult<Prestamo>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }

    const porId = async (id: number): Promise<ResponseResult<Prestamo>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Prestamo>;

        try {
            resp = await api.Get<Prestamo>(`${Urls.Prestamos.Base}/porId?id=${id}`);
        } catch (error: any) {
            resp = errorResult<Prestamo>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;

    }

    return (
        <PrestamosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
            activos,
            actual,
            porId,
        }}>
            {children}
        </PrestamosContext.Provider>
    )
}
