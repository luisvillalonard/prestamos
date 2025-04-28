export const appUrl = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_APP_URL_PROD
    : import.meta.env.VITE_APP_URL_DEV;
export const secretKey = 'D7B9F2FD64B04F18B4D1EC4869FC52BA';

export const Urls = {
    Home: '/',
    Dashboard: '/dashboard',
    Login: '/login',
    Clientes: {
        Base: 'clientes',
        Nuevo: 'nuevo',
        Editar: 'editar/:id?',
        Registrados: 'registrados',
        CargaMasiva: 'carga',
    },
    Prestamos: {
        Base: 'prestamos',
        Nuevo: 'nuevo',
        Editar: 'editar/:id?',
        Reenganche: 'reenganche/:id?',
        Registrados: 'registrados',
        Cobro: 'cobro/manual/:id?',
        CobroAutomatico: 'cobro/automatico',
        CargaMasiva: 'carga',
    },
    Seguridad: {
        Base: 'seguridad',
        Roles: 'roles',
        Permisos: 'permisos',
        PermisosFormulario: 'permisos/formulario',
        Usuarios: 'usuarios',
        Validar: 'validar',
        CambiarClave: 'cambioClave',
    },
    DataMaestra: {
        Base: 'maestra',
        Ciudades: 'ciudades',
        DocumentosTipos: 'documentos/tipos',
        FormasPago: 'formasPago',
        MetodosPago: 'metodosPago',
        Monedas: 'monedas',
        Ocupaciones: 'ocupaciones',
        PrestamosEstados: 'prestamos/estados',
        Sexos: 'sexos',
        Acesores: 'acesores',
    },
    Configuraciones: {
        Base: 'configuraciones',
        Generales: 'generales',
    }
}

export const Colors = {
    Primary: '#108ee9',
    Success: '#87d068',
    Secondary: "#969696e0",
    Warning: '#ffd666',
    Danger: '#ff4d4f',
    White: "#FFFFFF",
    Gris51: '#515151',
    Azul: '#001529',
}

