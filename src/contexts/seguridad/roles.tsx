import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps } from "@interfaces/globales"
import { Rol } from "@interfaces/seguridad"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const RolesContext = createContext<GlobalContextState<Rol>>({} as GlobalContextState<Rol>)

export default function RolesProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Rol>(Urls.Seguridad.Roles);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            esAdmin: false,
            activo: false,
            permisos: [],
        });
    }

    return (
        <RolesContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </RolesContext.Provider>
    )
}
