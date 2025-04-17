export const appUrl = process.env.VITE_APP_URL || '/';
export const secretKey = 'D7B9F2FD64B04F18B4D1EC4869FC52BA';

export const Urls = {
    Home: '/',
    Dashboard: '/dashboard',
    Login: '/login',
    Clientes: {
        Base: 'clientes',
        Formulario: 'formulario',
        Historico: 'historico',
    },
    Prestamos: {
        Base: 'prestamos',
        Formulario: 'formulario/:id?',
        Registrados: 'registrados',
        Cobro: 'cobro/manual/:id?',
        CobroAutomatico: 'cobro/automatico',
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

