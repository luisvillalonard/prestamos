import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { MetodoPago } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const MetodosPagoContext = createContext<GlobalContextState<MetodoPago>>({} as GlobalContextState<MetodoPago>)

export default function MetodosPagoProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<MetodoPago>(Urls.DataMaestra.MetodosPago);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            activo: true,
        });
    }

    return (
        <MetodosPagoContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </MetodosPagoContext.Provider>
    )
}
