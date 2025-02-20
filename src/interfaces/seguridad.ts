
export interface Login {
    acceso: string,
    clave: string,
    recuerdame: boolean
}

export interface UserApp extends Usuario {
    token?: string,
}

export interface Usuario {
    id: number,
    acceso: string,
    empleadoId?: string,
    correo?: string;
    cambio: boolean,
    activo: boolean
}

export interface CambioClave {
    id: number,
    passwordNew: string,
    passwordConfirm: string,
}

export interface Permiso {
    id: number,
    rolId: number,
    menuId: number
}