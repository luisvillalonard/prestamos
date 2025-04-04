import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { FormatDate_DDMMYYYY } from "@hooks/useUtils"
import { ControlProps } from "@interfaces/globales"
import { Prestamo } from "@interfaces/prestamos"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const PrestamosContext = createContext<GlobalContextState<Prestamo>>({} as GlobalContextState<Prestamo>)

export default function PrestamosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Prestamo>(Urls.Prestamos.Base);

    const nuevo = async (): Promise<void> => {
        const diaActual: string = FormatDate_DDMMYYYY(new Date().toISOString().substring(0, 10))!;

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

    return (
        <PrestamosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </PrestamosContext.Provider>
    )
}
