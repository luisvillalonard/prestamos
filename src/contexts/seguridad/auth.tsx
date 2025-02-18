import { createContext, useReducer } from "react"
import { Urls } from "../../hooks/useConstants"
import { useFetch } from "../../hooks/useFetch"
import { ControlProps, ResponseResult, SessionStorageKeys } from "../../interfaces/globales"
import { Login, UserApp } from "../../interfaces/seguridad"
import authReducer, { initState } from "../../reducers/auth"

export interface AuthState {
    user: UserApp | null;
    isLogged: boolean;
    viewMenu: boolean;
    viewInfoUser: boolean,
    procesando: boolean,
}

export interface AuthReducerState {
    state: AuthState,
    validar: (user: Login) => Promise<ResponseResult<UserApp>>,
    LoggedIn: (user: UserApp) => void,
    LoggedOut: () => void,
    showMenu: () => void,
    showUserInfo: () => void,
    getUserApp: () => UserApp | null,
}

export const AuthContext = createContext<AuthReducerState>({} as AuthReducerState);

export const AuthProvider = ({ children }: ControlProps) => {

    const [state, dispatch] = useReducer(authReducer, initState);
    const api = useFetch();

    const validar = async (user: Login): Promise<ResponseResult<UserApp>> => {
        dispatch({ type: 'FETCHING' })
        const resp = await api.Post<UserApp>(`${Urls.Seguridad.Usuarios}/${Urls.Seguridad.Validar}`, user);
        if (resp.ok) {
            LoggedIn(resp.datos as UserApp);
        }
        dispatch({ type: 'FETCH_COMPLETE' })
        return resp;
    }

    const getUserApp = (): UserApp | null => {

        const userStorage = sessionStorage.getItem(SessionStorageKeys.User)
        if (!userStorage) {
            return null;
        }
        const valor: UserApp | null = JSON.parse(userStorage);
        if (valor) {
            dispatch({ type: 'SIGN_IN', payload: valor })
        } else {
            LoggedOut()
        }
        return valor;
    }

    const LoggedIn = (user: UserApp) => {
        sessionStorage.setItem(SessionStorageKeys.User, JSON.stringify(user))
        dispatch({ type: 'SIGN_IN', payload: user })
    }

    const LoggedOut = () => {
        sessionStorage.removeItem(SessionStorageKeys.User)
        sessionStorage.removeItem(SessionStorageKeys.Token)
        dispatch({ type: 'SIGN_OUT' })
    }

    const showMenu = () => {
        dispatch({ type: 'SHOW_MENU' })
    }

    const showUserInfo = () => {
        dispatch({ type: 'SHOW_USER_INFO' })
    }

    return (
        <AuthContext.Provider value={{
            state,
            validar,
            LoggedIn,
            LoggedOut,
            getUserApp,
            showMenu,
            showUserInfo,
        }}>
            {children}
        </AuthContext.Provider>
    )
}