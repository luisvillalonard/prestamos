import { Sexo } from "./dataMaestra";
import { Usuario } from "./seguridad";

export interface Cliente {
    id: number,
    codigo: string,
    empleadoId: string,
    nombres: string,
    apellidos: string,
    documento: string,
    sexo: Sexo,
    fechaNacimiento?: string,
    ciudad?: string,
    ocupacion?: string,
    direccion?: string,
    telefonoFijo?: string,
    telefonoCelular?: string,
    fechaAntiguedad?: string,
    fechaCreacion?: string,
    usuario: Usuario,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario,
}