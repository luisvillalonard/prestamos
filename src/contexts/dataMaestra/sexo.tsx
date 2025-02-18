import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps } from "@interfaces/globales"
import { Sexo } from "@interfaces/dataMaestra"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const SexosContext = createContext<GlobalContextState<Sexo>>({} as GlobalContextState<Sexo>)

export default function SexosProvider({ children }: ControlProps) {

    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Sexo>(Urls.DataMaestra.Sexos);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
        });
    }

    return (
        <SexosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </SexosContext.Provider>
    )
}
