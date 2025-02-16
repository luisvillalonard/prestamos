import { useConstants } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { Cliente } from "@interfaces/clientes"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const ClientesContext = createContext<GlobalContextState<Cliente>>({} as GlobalContextState<Cliente>)

export default function ClientesProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { Urls } = useConstants()
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<Cliente>(Urls.Clientes.Base);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            codigo: '',
            empleadoId: '',
            nombres: '',
            apellidos: '',
            documentoTipo: undefined,
            documento: '',
            sexo: undefined,
            fechaCreacion: new Date().toISOString().substring(0, 10),
            activo: true,
        });
    }

    return (
        <ClientesContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </ClientesContext.Provider>
    )
}
