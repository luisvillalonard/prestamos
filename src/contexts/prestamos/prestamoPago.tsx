import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps } from "@interfaces/globales"
import { PrestamoPago } from "@interfaces/prestamos"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const PrestamosPagosContext = createContext<GlobalContextState<PrestamoPago>>({} as GlobalContextState<PrestamoPago>)

export default function PrestamosPagosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<PrestamoPago>(`${Urls.Prestamos.Base}/pagos`);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            prestamoId: 0,
            prestamoCuotaId: 0,
            metodoPago: undefined,
            monto: 0,
            multaMora: 0,
            usuario: undefined,
            anulado: false,
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
