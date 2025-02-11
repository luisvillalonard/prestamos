import { ContextsProviders } from "@components/providers/contexts";
import UsuariosProvider, { UsuariosContext, UsuariosContextState } from "@contexts/seguridad/usuarios";
import { Usuario } from "@interfaces/seguridad";
import { useContext } from "react";

export const ContextsProvidersTree = ContextsProviders([

    /* Seguridad */
    [UsuariosProvider, {}],

]);

export const useData = () => {

    /* Seguridad */
    const contextUsuarios = useContext(UsuariosContext) as UsuariosContextState<Usuario>;

    return {

        /* Seguridad */
        contextUsuarios,

    }

}