import { Cliente } from "./clientes"
import { Acesor, FormaPago, MetodoPago, Moneda, PrestamoEstado } from "./dataMaestra"
import { Usuario } from "./seguridad"

export interface Prestamo {
    id: number,
    codigo: string,
    cliente: Cliente | undefined,
    fechaCredito: string,
    formaPago: FormaPago | undefined,
    metodoPago: MetodoPago | undefined,
    moneda: Moneda | undefined,
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
    acesor: Acesor | undefined,
    usuario: Usuario | undefined,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario
}

export interface PrestamoPago {
    id: number,
    prestamoId: number,
    formaPago: FormaPago | undefined,
    monto: number,
    deuda: number,
    multaMora: number,
    usuario: Usuario | undefined,
}