export const secretKey = 'D7B9F2FD64B04F18B4D1EC4869FC52BA';

export function useConstants() {

    const API_URL = {
        Base: import.meta.env.PROD ? 'http://www.prestamosapi.somee.com/api' : 'https://localhost/prestamos.api', //'https://localhost/factuv.api',
        //Base: 'https://localhost:44340',

        ApiDefaultProps: {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                mode: 'cors', // no-cors, *cors, same-origin,
                Authorization: '',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: undefined // body data type must match "Content-Type" header
        }
    }

    const Urls = {
        Home: '/',
        Login: '/login',
        Clientes: {
            Base: 'clientes',
            Formulario: 'formulario',
            Historico: 'historico',
        },
        Prestamos: {
            Base: 'prestamos',
            Estados: 'estados',
            Registrados: 'registrados',
            Pagos: 'pagos',
            Pago: 'pago',
        },
        Seguridad: {
            Base: 'seguridad',
            Roles: 'roles',
            Permisos: 'permisos',
            Usuarios: 'usuarios',
            Validar: 'validar',
            CambiarClave: 'cambioClave/:codigo',
        },
        Configuraciones: {
            Base: 'config',
            Ciudades: 'ciudades',
            DocumentosTipos: 'documentos/tipos',
            FormasPago: 'formasPago',
            MetodosPago: 'metodoPago',
            Monedas: 'monedas',
            Ocupaciones: 'ocupaciones',
            PrestamosEstados: 'prestamos/estados',
            Sexos: 'sexos',
        },
    }

    const Colors = {
        Font: {
            Primary: '#85a5ff',
            Success: '#95de64',
            Warning: '#ffd666',
            Danger: '#ff4d4f',
        },
        Bg: {
            Primary: '#85a5ff',
            Success: '#95de64',
            Warning: '#ffd666',
            Danger: '#ff4d4f',
        },
        Border: {
            Secondary: "#969696e0"
        },
        White: "#FFFFFF",
    }

    return {
        API_URL,
        Urls,
        Colors,
    }

}
