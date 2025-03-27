import { Cliente } from "./clientes"
import { Acesor, FormaPago, MetodoPago, Moneda, PrestamoEstado } from "./dataMaestra"
import { Usuario } from "./seguridad"

export interface Prestamo {
    id: number,
    codigo: string,
    cliente: Cliente | undefined,
    fechaRegistro: string,
    fechaCredito: string,
    formaPago: FormaPago | undefined,
    metodoPago: MetodoPago | undefined,
    moneda: Moneda | undefined,
    cantidadCuotas: number,
    deudaInicial: number,
    interes: number,
    capital: number,
    amortizacion: number,
    saldoFinal: number,
    estado: PrestamoEstado | undefined,
    destino: string,
    acesor: Acesor | undefined,
    usuario: Usuario | undefined,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario,
    cancelado: boolean,
    fechaCancelado?: string,
    cuotas: PrestamoCuota[],
}

export interface PrestamoCuota {
    id: number,
    prestamoId: number,
    fechaPago: string,
    deudaInicial: number,
    capital: number,
    interes: number,
    amortizacion: number,
    saldoFinal: number,
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