import { Ciudad, DocumentoTipo, Ocupacion, Sexo } from "./dataMaestra";
import { Usuario } from "./seguridad";

export interface Cliente {
    id: number,
    codigo: string,
    empleadoId: string,
    nombres: string,
    apellidos: string,
    documentoTipo: DocumentoTipo | undefined,
    documento: string,
    sexo: Sexo | undefined,
    fechaNacimiento?: string,
    ciudad?: Ciudad | undefined,
    ocupacion?: Ocupacion | undefined,
    direccion?: string,
    telefonoFijo?: string,
    telefonoCelular?: string,
    fechaAntiguedad?: string,
    fechaCreacion: string,
    usuario?: Usuario,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario,
    activo: boolean,
}