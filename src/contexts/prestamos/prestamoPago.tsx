import { useConstants } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps } from "@interfaces/globales"
import { PrestamoPago } from "@interfaces/prestamos"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const PrestamosPagosContext = createContext<GlobalContextState<PrestamoPago>>({} as GlobalContextState<PrestamoPago>)

export default function PrestamosPagosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { Urls } = useConstants()
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<PrestamoPago>(Urls.Prestamos.Base);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            codigo: '',
            cliente: undefined,
            fechaCredito: new Date().toISOString().substring(0, 10),
            formaPago: undefined,
            metodoPago: undefined,
            moneda: undefined,
            cuotas: 0,
            fechaCuotas: 0,
            deudaInicial: 0,
            interes: 0,
            capital: 0,
            amortizacion: 0,
            saldoFinal: 0,
            abonoCuota: 0,
            multaRetrazo: 0,
            fechaPago: '',
            estado: undefined,
            diasMora: 0,
            destino: '',
            acesor: undefined,
            usuario: undefined,
        });
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
        }}>
            {children}
        </PrestamosPagosContext.Provider>
    )
}
