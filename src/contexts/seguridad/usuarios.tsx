import { Urls } from "@hooks/useConstants"
import { useFetch } from "@hooks/useFetch"
import { useReducerHook } from "@hooks/useReducer"
import { ControlProps, ResponseResult } from "@interfaces/globales"
import { CambioClave, Login, UserApp, Usuario } from "@interfaces/seguridad"
import { ACTIONS, GlobalContextState } from "@reducers/global"
import { createContext } from "react"

export interface UsuariosContextState<T> extends GlobalContextState<T> {
    nuevo: () => void,
    validar: (item: Login) => Promise<ResponseResult<UserApp>>,
    porCodigo: (codigo: string) => Promise<ResponseResult<T>>,
    cambiarClave: (item: CambioClave) => Promise<ResponseResult<UserApp>>,
}

export const UsuariosContext = createContext<UsuariosContextState<Usuario>>({} as UsuariosContextState<Usuario>)

export default function UsuariosProvider(props: Pick<ControlProps, "children">) {

    const { children } = props
    const { state, dispatch, editar, cancelar, agregar, actualizar, todos, errorResult } = useReducerHook<Usuario>(Urls.Seguridad.Usuarios);
    const api = useFetch();

    const nuevo = async (): Promise<void> => {
        editar({
            id: 0,
            acceso: '',
            cambio: false,
            activo: false
        });
    }

    const porCodigo = async (codigo: string): Promise<ResponseResult<Usuario>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<Usuario>;

        try {
            resp = await api.Get<Usuario>(`${Urls.Seguridad.Usuarios}/${codigo}`);
        } catch (error: any) {
            resp = errorResult<Usuario>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: false });
        return resp;
    }

    const cambiarClave = async (item: CambioClave): Promise<ResponseResult<UserApp>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<UserApp>;

        try {
            resp = await api.Post<UserApp>(`${Urls.Seguridad.Usuarios}/${Urls.Seguridad.CambiarClave}`, item);
        } catch (error: any) {
            resp = errorResult<UserApp>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: true });
        return resp;
    }

    const validar = async (item: Login): Promise<ResponseResult<UserApp>> => {
        dispatch({ type: ACTIONS.FETCHING });
        let resp: ResponseResult<UserApp>;

        try {
            resp = await api.Post<UserApp>(Urls.Seguridad.Validar, item);
        } catch (error: any) {
            resp = errorResult<UserApp>(error);
        }

        dispatch({ type: ACTIONS.FETCH_COMPLETE, recargar: false });
        return resp;
    }

    return (
        <UsuariosContext.Provider value={{
            state,
            nuevo,
            editar,
            cancelar,
            agregar,
            actualizar,
            todos,
            porCodigo,
            cambiarClave,
            validar,
        }}>
            {children}
        </UsuariosContext.Provider>
    )
}

