import { ContextsProviders } from "@components/providers/contexts";
import ClientesProvider, { ClienteContextState, ClientesContext } from "@contexts/clientes/cliente";
import ConfiguracionesGeneralesProvider, { ConfiguracionesGeneralesContext, ConfiguracionesGeneralesContextState } from "@contexts/configuraciones/general";
import AcesoresProvider, { AcesoresContext } from "@contexts/dataMaestra/acesores";
import CiudadesProvider, { CiudadesContext } from "@contexts/dataMaestra/ciudades";
import DocumentosTiposProvider, { DocumentosTiposContext } from "@contexts/dataMaestra/documentosTipo";
import FormasPagoProvider, { FormasPagoContext } from "@contexts/dataMaestra/formaPago";
import MetodosPagoProvider, { MetodosPagoContext } from "@contexts/dataMaestra/metodoPago";
import MonedasProvider, { MonedasContext } from "@contexts/dataMaestra/moneda";
import OcupacionesProvider, { OcupacionesContext } from "@contexts/dataMaestra/ocupacion";
import PrestamosEstadosProvider, { PrestamosEstadosContext } from "@contexts/dataMaestra/prestamoEstado";
import SexosProvider, { SexosContext } from "@contexts/dataMaestra/sexo";
import PrestamosProvider, { PrestamoContextState, PrestamosContext } from "@contexts/prestamos/prestamo";
import PrestamosPagosProvider, { PrestamoPagoContextState, PrestamosPagosContext } from "@contexts/prestamos/prestamoPago";
import { AuthContext, AuthProvider, AuthReducerState } from "@contexts/seguridad/auth";
import PermisosProvider, { PermisosContext, PermisosContextState } from "@contexts/seguridad/permisos";
import RolesProvider, { RolesContext } from "@contexts/seguridad/roles";
import UsuariosProvider, { UsuariosContext, UsuariosContextState } from "@contexts/seguridad/usuarios";
import { Cliente } from "@interfaces/clientes";
import { Configuracion } from "@interfaces/configuraciones";
import { Acesor, Ciudad, DocumentoTipo, FormaPago, MetodoPago, Moneda, Ocupacion, PrestamoEstado, Sexo } from "@interfaces/dataMaestra";
import { Prestamo, PrestamoPago } from "@interfaces/prestamos";
import { Rol, Usuario } from "@interfaces/seguridad";
import { GlobalContextState } from "@reducers/global";
import { useContext } from "react";

export const ContextsProvidersTree = ContextsProviders([

    /* Clientes */
    [ClientesProvider, {}],

    /* Data Maestra */
    [CiudadesProvider, {}],
    [DocumentosTiposProvider, {}],
    [FormasPagoProvider, {}],
    [MetodosPagoProvider, {}],
    [MonedasProvider, {}],
    [OcupacionesProvider, {}],
    [PrestamosEstadosProvider, {}],
    [SexosProvider, {}],
    [AcesoresProvider, {}],

    /* Prestamos */
    [PrestamosProvider, {}],
    [PrestamosPagosProvider, {}],

    /* Seguridad */
    [AuthProvider, {}],
    [RolesProvider, {}],
    [UsuariosProvider, {}],
    [PermisosProvider, {}],

    /* Configuraciones */
    [ConfiguracionesGeneralesProvider, {}],

]);

export const useData = () => {

    /* Clientes */
    const contextClientes = useContext(ClientesContext) as ClienteContextState<Cliente>;

    /* Data Maestra */
    const contextCiudades = useContext(CiudadesContext) as GlobalContextState<Ciudad>;
    const contextDocumentosTipos = useContext(DocumentosTiposContext) as GlobalContextState<DocumentoTipo>;
    const contextFormasPago = useContext(FormasPagoContext) as GlobalContextState<FormaPago>;
    const contextMetodosPago = useContext(MetodosPagoContext) as GlobalContextState<MetodoPago>;
    const contextMonedas = useContext(MonedasContext) as GlobalContextState<Moneda>;
    const contextOcupaciones = useContext(OcupacionesContext) as GlobalContextState<Ocupacion>;
    const contextPrestamosEstados = useContext(PrestamosEstadosContext) as GlobalContextState<PrestamoEstado>;
    const contextSexos = useContext(SexosContext) as GlobalContextState<Sexo>;
    const contextAcesores = useContext(AcesoresContext) as GlobalContextState<Acesor>;

    /* Prestamos */
    const contextPrestamos = useContext(PrestamosContext) as PrestamoContextState<Prestamo>;
    const contextPrestamosPagos = useContext(PrestamosPagosContext) as PrestamoPagoContextState<PrestamoPago>;

    /* Seguridad */
    const contextAuth = useContext(AuthContext) as AuthReducerState;
    const contextRoles = useContext(RolesContext) as GlobalContextState<Rol>;
    const contextUsuarios = useContext(UsuariosContext) as UsuariosContextState<Usuario>;
    const contextPermisos = useContext(PermisosContext) as PermisosContextState<Rol>;

    /* Configuraciones */
    const contextConfiguracionesGenerales = useContext(ConfiguracionesGeneralesContext) as ConfiguracionesGeneralesContextState<Configuracion>;

    return {

        /* Clientes */
        contextClientes,

        /* Data Maestra */
        contextCiudades,
        contextDocumentosTipos,
        contextFormasPago,
        contextMetodosPago,
        contextMonedas,
        contextOcupaciones,
        contextPrestamosEstados,
        contextSexos,
        contextAcesores,

        /* Prestamos */
        contextPrestamos,
        contextPrestamosPagos,

        /* Seguridad */
        contextAuth,
        contextRoles,
        contextUsuarios,
        contextPermisos,

        /* Configuraciones */
        contextConfiguracionesGenerales,

    }

}