import { useConstants } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps } from "@interfaces/globales"
import { Prestamo } from "@interfaces/prestamos"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const PrestamosContext = createContext<GlobalContextState<Prestamo>>({} as GlobalContextState<Prestamo>)

export default function PrestamosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { Urls } = useConstants()
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Prestamo>(Urls.Clientes.Base);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            codigo: '',
            empleadoId: '',
            nombres: '',
            apellidos: '',
            documento: undefined,
            sexo: undefined,
            usuario: undefined,
        });
    }

    return (
        <PrestamosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </PrestamosContext.Provider>
    )
}
