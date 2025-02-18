import { ContextsProviders } from "@components/providers/contexts";
import ClientesProvider, { ClientesContext } from "@contexts/clientes/cliente";
import AcesoresProvider, { AcesoresContext } from "@contexts/dataMaestra/acesores";
import CiudadesProvider, { CiudadesContext } from "@contexts/dataMaestra/ciudades";
import DocumentosTiposProvider, { DocumentosTiposContext } from "@contexts/dataMaestra/documentosTipo";
import FormasPagoProvider, { FormasPagoContext } from "@contexts/dataMaestra/formaPago";
import MetodosPagoProvider, { MetodosPagoContext } from "@contexts/dataMaestra/metodoPago";
import MonedasProvider, { MonedasContext } from "@contexts/dataMaestra/moneda";
import OcupacionesProvider, { OcupacionesContext } from "@contexts/dataMaestra/ocupacion";
import PrestamosEstadosProvider, { PrestamosEstadosContext } from "@contexts/dataMaestra/prestamoEstado";
import SexosProvider, { SexosContext } from "@contexts/dataMaestra/sexo";
import PrestamosProvider, { PrestamosContext } from "@contexts/prestamos/prestamo";
import PrestamosPagosProvider, { PrestamosPagosContext } from "@contexts/prestamos/prestamoPago";
import { AuthContext, AuthProvider, AuthReducerState } from "@contexts/seguridad/auth";
import UsuariosProvider, { UsuariosContext, UsuariosContextState } from "@contexts/seguridad/usuarios";
import { Cliente } from "@interfaces/clientes";
import { Acesor, Ciudad, DocumentoTipo, FormaPago, MetodoPago, Moneda, Ocupacion, PrestamoEstado, Sexo } from "@interfaces/dataMaestra";
import { Prestamo, PrestamoPago } from "@interfaces/prestamos";
import { Usuario } from "@interfaces/seguridad";
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
    [UsuariosProvider, {}],

]);

export const useData = () => {

    /* Clientes */
    const contextClientes = useContext(ClientesContext) as GlobalContextState<Cliente>;

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
    const contextPrestamos = useContext(PrestamosContext) as GlobalContextState<Prestamo>;
    const contextPrestamosPagos = useContext(PrestamosPagosContext) as GlobalContextState<PrestamoPago>;

    /* Seguridad */
    const contextAuth = useContext(AuthContext) as AuthReducerState;
    const contextUsuarios = useContext(UsuariosContext) as UsuariosContextState<Usuario>;

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
        contextUsuarios,

    }

}