import { Urls } from "@hooks/useConstants"
import { useReducerHook } from "@hooks/useReducer"
import { DocumentoTipo } from "@interfaces/dataMaestra"
import { ControlProps } from "@interfaces/globales"
import { GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export const DocumentosTiposContext = createContext<GlobalContextState<DocumentoTipo>>({} as GlobalContextState<DocumentoTipo>)

export default function DocumentosTiposProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, editar, cancelar, agregar, actualizar, todos } = useReducerHook<DocumentoTipo>(Urls.DataMaestra.DocumentosTipos);

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            activo: true,
        });
    }

    return (
        <DocumentosTiposContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
        }}>
            {children}
        </DocumentosTiposContext.Provider>
    )
}
