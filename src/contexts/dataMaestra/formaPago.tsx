import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { FormaPago } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const FormasPagoContext = createContext<GlobalContextState<FormaPago>>({} as GlobalContextState<FormaPago>)

export default function FormasPagoProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<FormaPago>(Urls.DataMaestra.FormasPago);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            activo: true,
            dias: [],
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
