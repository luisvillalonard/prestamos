import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { Ocupacion } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const OcupacionesContext = createContext<GlobalContextState<Ocupacion>>({} as GlobalContextState<Ocupacion>)

export default function OcupacionesProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Ocupacion>(Urls.DataMaestra.Ocupaciones);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            activo: true,
        });
    }

    return (
        <OcupacionesContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </OcupacionesContext.Provider>
    )
}
