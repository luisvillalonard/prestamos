
export interface Login {
    acceso: string,
    clave: string,
    recuerdame: boolean
}

export interface CambioClave {
    id: number,
    passwordNew: string,
    passwordConfirm: string,
}

export interface Menu {
    id: number,
    titulo: string,
    link: string | null,
    padre: number,
    orden: number,
    icono?: JSX.Element,
}

export interface MenuItem {
    menuid: number,
    key: string,
    label: string | React.ReactNode,
    icon?: React.ReactNode,
    children?: MenuItem[],
    element?: JSX.Element
}

export interface Rol {
    id: number,
    nombre: string,
    descripcion?: string,
    esAdmin: boolean,
    activo: boolean,
    permisos: Permiso[],
}

export interface Permiso {
    id: number,
    rolId: number,
    menuId: number,
}

export interface Usuario {
    id: number,
    acceso: string,
    empleadoId?: string,
    rol: Rol | undefined,
    correo?: string;
    cambio: boolean,
    activo: boolean
}

export interface UserApp extends Usuario {
    token?: string,
}