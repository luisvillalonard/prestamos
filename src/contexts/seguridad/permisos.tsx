import { menuItems } from "@components/layout/menu"
import { Urls } from "@hooks/useConstants"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps, MenuItem, ResponseResult } from "@interfaces/globales"
import { Permiso, Rol } from "@interfaces/seguridad"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface PermisosContextState<T> extends GlobalContextState<T> {
    getByRolId: (rolId: number) => Promise<ResponseResult<Rol>>,
    permitionList: () => Permiso[],
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

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: false });
        return resp;
    }
    
    const permitionList = (): MenuItem[] => {
        
        return menuItems.reduce((acc: MenuItem[], item: MenuItem) => {
            if (item.children && item.children.length > 0) {
                item.children?.forEach((child: MenuItem) => {
                    acc.push({
                        id: 0,
                        rolId: 0,
                        menuId: child.menuid,
                    })
                })
            }
            return acc;
        }, []);

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
            permitionList,
        }}>
            {children}
        </PermisosContext.Provider>
    )
}

