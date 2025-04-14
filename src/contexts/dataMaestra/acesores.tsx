import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { Acesor } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const AcesoresContext = createContext<GlobalContextState<Acesor>>({} as GlobalContextState<Acesor>)

export default function AcesoresProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Acesor>(Urls.DataMaestra.Acesores);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            activo: true,
        });
    }

    return (
        <AcesoresContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </AcesoresContext.Provider>
    )
}
