import { AuthState } from "../contexts/seguridad/auth"
import { UserApp } from "../interfaces/seguridad"

type AuthAction =
    | { type: 'FETCHING' }
    | { type: 'FETCH_COMPLETE' }
    | { type: 'SIGN_IN', payload: UserApp }
    | { type: 'SIGN_OUT' }
    | { type: 'SHOW_MENU' }
    | { type: 'SHOW_USER_INFO' }

export const initState: AuthState = {
    user: null,
    isLogged: false,
    viewMenu: true,
    viewInfoUser: false,
    procesando: false
}

export default function authReducer(state: AuthState, action: AuthAction): AuthState {

    switch (action.type) {
        case 'FETCHING':
            return {
                ...state,
                procesando: true
            }

        case 'FETCH_COMPLETE':
            return {
                ...state,
                procesando: false
            }

        case 'SIGN_IN':
            return {
                ...state,
                user: action.payload,
                isLogged: true
            }

        case 'SIGN_OUT':
            return {
                ...state,
                user: null,
                isLogged: false
            }

        case 'SHOW_MENU':
            return {
                ...state,
                viewMenu: !state.viewMenu
            }

        case 'SHOW_USER_INFO':
            return {
                ...state,
                viewInfoUser: !state.viewInfoUser
            }

        default:
            return state;
    }

}
