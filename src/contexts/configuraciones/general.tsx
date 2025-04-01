import { Urls } from "@hooks/useConstants"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { Configuracion } from "@interfaces/configuraciones"
import { ControlProps, ResponseResult } from "@interfaces/globales"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface ConfiguracionesGeneralesContextState<T> extends GlobalContextState<T> {
    ultima: () => Promise<ResponseResult<T>>,
}

export const ConfiguracionesGeneralesContext = createContext<ConfiguracionesGeneralesContextState<Configuracion>>(
    {} as ConfiguracionesGeneralesContextState<Configuracion>
)

export default function ConfiguracionesGeneralesProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const urlBase = `${Urls.Configuraciones.Base}/${Urls.Configuraciones.Generales}`
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<Configuracion>(urlBase);
    const api = useFetch();
    const nuevaConfiguracion: Configuracion = {
        id: 0,
        permiteFechaAnteriorHoy: false,
    }

    const nuevo = async (): Promise<void> => {
        editar(nuevaConfiguracion);
    }

    const ultima = async (): Promise<ResponseResult<Configuracion>> => {

        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Configuracion>;

        try {
            resp = await api.Get<Configuracion>(`${urlBase}/ultima`);
        } catch (error: any) {
            resp = errorResult<Configuracion>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: false });
        return resp;

    }

    return (
        <ConfiguracionesGeneralesContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
            ultima,
        }}>
            {children}
        </ConfiguracionesGeneralesContext.Provider>
    )
}
