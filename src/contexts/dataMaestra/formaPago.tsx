import { useConstants } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps } from "@interfaces/globales"
import { FormaPago } from "@interfaces/dataMaestra"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const FormasPagoContext = createContext<GlobalContextState<FormaPago>>({} as GlobalContextState<FormaPago>)

export default function FormasPagoProvider({ children }: ControlProps) {

    const { Urls } = useConstants()
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<FormaPago>(Urls.DataMaestra.FormasPago);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
        });
    }

    return (
        <FormasPagoContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </FormasPagoContext.Provider>
    )
}
