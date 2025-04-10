import { Urls } from "@hooks/useConstants"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps, ResponseResult } from "@interfaces/globales"
import { Rol } from "@interfaces/seguridad"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface PermisosContextState<T> extends GlobalContextState<T> {
    getByRolId: (rolId: number) => Promise<ResponseResult<Rol>>,
    //permitionList: () => Permiso[],
}

export const PermisosContext = createContext<PermisosContextState<Rol>>({} as PermisosContextState<Rol>)

export default function PermisosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<Rol>(Urls.Seguridad.Permisos);
    const api = useFetch();

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            nombre: '',
            esAdmin: false,
            activo: true,
            permisos: [],
        });
    }

    const getByRolId = async (rolId: number): Promise<ResponseResult<Rol>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Rol>;

        try {
            resp = await api.Get<Rol>(`${Urls.Seguridad.Permisos}/rolId?rolId=${rolId}`);
        } catch (error: any) {
            resp = errorResult<Rol>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE });
        return resp;
    }

    return (
        <PermisosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
            getByRolId,
        }}>
            {children}
        </PermisosContext.Provider>
    )
}

