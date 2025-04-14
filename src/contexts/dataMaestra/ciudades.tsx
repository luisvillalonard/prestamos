import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { Ciudad } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const CiudadesContext = createContext<GlobalContextState<Ciudad>>({} as GlobalContextState<Ciudad>)

export default function CiudadesProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Ciudad>(Urls.DataMaestra.Ciudades);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            activo: true,
        });
    }

    return (
        <CiudadesContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </CiudadesContext.Provider>
    )
}
