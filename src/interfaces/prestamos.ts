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
    deudaNueva: number,
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
    reenganche: boolean,
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
    vencido: boolean,
    pagado: boolean,
    pagos: PrestamoPago[]
}

export interface PrestamoPago {
    id: number,
    prestamoId: number,
    prestamoCuotaId: number,
    metodoPago: MetodoPago | undefined,
    monto: number,
    multaMora: number,
    usuario: Usuario | undefined,
    anulado: boolean,
    usuarioIdAnulado?: Usuario,
    anuladoFecha?: string
}