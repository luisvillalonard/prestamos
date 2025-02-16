import { Cliente } from "./clientes"
import { FormaPago, MetodoPago, PrestamoEstado } from "./dataMaestra"
import { Usuario } from "./seguridad"

export interface Prestamo {
    id: number,
    codigo: string,
    cliente: Cliente | undefined,
    fechaCredito: string,
    formaPago: FormaPago | undefined,
    metodoPago: MetodoPago | undefined,
    cuotas: number,
    fechaCuotas: number,
    deudaInicial: number,
    interes: number,
    capital: number,
    amortizacion: number,
    saldoFinal: number,
    abonoCuota: number,
    multaRetrazo: number,
    fechaPago: string,
    estado: PrestamoEstado | undefined,
    diasMora: number,
    destino: string,
    usuario: Usuario | undefined,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario
}