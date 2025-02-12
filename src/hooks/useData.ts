import { ContextsProviders } from "@components/providers/contexts";
import CiudadesProvider, { CiudadesContext } from "@contexts/dataMaestra/ciudades";
import DocumentosTiposProvider, { DocumentosTiposContext } from "@contexts/dataMaestra/documentosTipo";
import FormasPagoProvider, { FormasPagoContext } from "@contexts/dataMaestra/formaPago";
import MetodosPagoProvider, { MetodosPagoContext } from "@contexts/dataMaestra/metodoPago";
import MonedasProvider, { MonedasContext } from "@contexts/dataMaestra/moneda";
import OcupacionesProvider, { OcupacionesContext } from "@contexts/dataMaestra/ocupacion";
import PrestamosEstadosProvider, { PrestamosEstadosContext } from "@contexts/dataMaestra/prestamoEstado";
import SexosProvider, { SexosContext } from "@contexts/dataMaestra/sexo";
import UsuariosProvider, { UsuariosContext, UsuariosContextState } from "@contexts/seguridad/usuarios";
import { Ciudad, DocumentoTipo, FormaPago, MetodoPago, Moneda, Ocupacion, PrestamoEstado, Sexo } from "@interfaces/dataMaestra";
import { Usuario } from "@interfaces/seguridad";
import { GlobalContextState } from "@reducers/global";
import { useContext } from "react";

export const ContextsProvidersTree = ContextsProviders([

    /* Data Maestra */
    [CiudadesProvider, {}],
    [DocumentosTiposProvider, {}],
    [FormasPagoProvider, {}],
    [MetodosPagoProvider, {}],
    [MonedasProvider, {}],
    [OcupacionesProvider, {}],
    [PrestamosEstadosProvider, {}],
    [SexosProvider, {}],

    /* Seguridad */
    [UsuariosProvider, {}],

]);

export const useData = () => {

    /* Data Maestra */
    const contextCiudades = useContext(CiudadesContext) as GlobalContextState<Ciudad>;
    const contextDocumentosTipos = useContext(DocumentosTiposContext) as GlobalContextState<DocumentoTipo>;
    const contextFormasPago = useContext(FormasPagoContext) as GlobalContextState<FormaPago>;
    const contextMetodosPago = useContext(MetodosPagoContext) as GlobalContextState<MetodoPago>;
    const contextMonedas = useContext(MonedasContext) as GlobalContextState<Moneda>;
    const contextOcupaciones = useContext(OcupacionesContext) as GlobalContextState<Ocupacion>;
    const contextPrestamosEstados = useContext(PrestamosEstadosContext) as GlobalContextState<PrestamoEstado>;
    const contextSexos = useContext(SexosContext) as GlobalContextState<Sexo>;

    /* Seguridad */
    const contextUsuarios = useContext(UsuariosContext) as UsuariosContextState<Usuario>;

    return {

        /* Data Maestra */
        contextCiudades,
        contextDocumentosTipos,
        contextFormasPago,
        contextMetodosPago,
        contextMonedas,
        contextOcupaciones,
        contextPrestamosEstados,
        contextSexos,

        /* Seguridad */
        contextUsuarios,

    }

}