import { Urls } from "@hooks/useConstants"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { FormatDate_DDMMYYYY, FormatDate_YYYYMMDD } from "@hooks/useUtils"
import { ControlProps, ResponseResult } from "@interfaces/globales"
import { Prestamo } from "@interfaces/prestamos"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface PrestamoContextState<T> extends GlobalContextState<T> {
    actual: (id: number) => Promise<ResponseResult<T>>,
}

export const PrestamosContext = createContext<PrestamoContextState<Prestamo>>({} as PrestamoContextState<Prestamo>)

export default function PrestamosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<Prestamo>(Urls.Prestamos.Base);
    const api = useFetch();

    const nuevo = async (): Promise<void> => {
        const diaActual: string = FormatDate_DDMMYYYY(FormatDate_YYYYMMDD(new Date().toLocaleDateString('es-DO').substring(0, 10)))!;

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
        });
    }

    const actual = async (id: number): Promise<ResponseResult<Prestamo>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Prestamo>;

        try {
            resp = await api.Get<Prestamo>(`${Urls.Prestamos.Base}/actual?id=${id}`);
        } catch (error: any) {
            resp = errorResult<Prestamo>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: false });
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
            actual,
        }}>
            {children}
        </PrestamosContext.Provider>
    )
}
