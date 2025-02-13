import { Ciudad, Ocupacion, Sexo } from "./dataMaestra";
import { Usuario } from "./seguridad";

export interface Cliente {
    id: number,
    codigo: string,
    empleadoId: string,
    nombres: string,
    apellidos: string,
    documento: string,
    sexo: Sexo | undefined,
    fechaNacimiento?: string,
    ciudad?: Ciudad | undefined,
    ocupacion?: Ocupacion | undefined,
    direccion?: string,
    telefonoFijo?: string,
    telefonoCelular?: string,
    fechaAntiguedad?: string,
    fechaCreacion?: string,
    usuario: Usuario | undefined,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario,
}