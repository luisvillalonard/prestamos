import { Cliente } from "./clientes"
import { Acesor, FormaPago, MetodoPago, Moneda, PrestamoEstado } from "./dataMaestra"
import { Usuario } from "./seguridad"

export interface Prestamo extends PrestamoHelpers {
    id: number,
    codigo: string,
    cliente: Cliente | undefined,
    fechaRegistro: string,
    fechaCredito: string,
    formaPago: FormaPago | undefined,
    metodoPago: MetodoPago | undefined,
    moneda: Moneda | undefined,
    monto: number,
    interes: number,
    cuotas: number,
    estado: PrestamoEstado | undefined,
    destino: string,
    acesor: Acesor | undefined,
    usuario: Usuario | undefined,
    fechaActualizado?: string,
    usuarioActualizado?: Usuario,
    cancelado: boolean,
    fechaCancelado?: string,
    prestamoCuotas: PrestamoCuota[],
    aplicaDescuento: boolean,
}

interface PrestamoHelpers {
    fechaInicioPago?: string
    formaPagoId?: number,
    metodoPagoId?: number,
    monedaId?: number,
    acesorId?: number,
    capitalCuota: number,
    totalInteres: number,
    amortizacion: number,
    reenganche: boolean,
    reengancheMonto: number,
    reengancheInteres: number,
    reengancheCuotas: number,
    reengancheFechaInicioPago?: string
    reengancheCapitalCuota: number,
    reengancheTotalInteres: number,
    reengancheAmortizacion: number,
    reenganchePrestamoCuotas: PrestamoCuota[],
}

export interface PrestamoCuota {
    id: number,
    prestamoId: number,
    fechaPago: string,
    deudaInicial: number,
    capital: number,
    interes: number,
    amortizacion: number,
    descuento: number,
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
    empleadoId?: string,
    monto: number,
    fecha?: string,
    usuario: Usuario | undefined,
    anulado: boolean,
    usuarioIdAnulado?: Usuario,
    anuladoFecha?: string
}

export interface VwPrestamo {
    id: number,
    codigo: string,
    cliente: string,
    clienteCodigo: string,
    clienteDocumento: string,
    fechaCredito: string,
    monto: number,
    interes: number,
    pendiente: number,
    estado: string,
    activo: boolean,
    cancelado: boolean,
}
