import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { PrestamoEstado } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const PrestamosEstadosContext = createContext<GlobalContextState<PrestamoEstado>>({} as GlobalContextState<PrestamoEstado>)

export default function PrestamosEstadosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<PrestamoEstado>(Urls.DataMaestra.PrestamosEstados);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            inicial: false,
            final: false,
        });
    }

    return (
        <PrestamosEstadosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </PrestamosEstadosContext.Provider>
    )
}
