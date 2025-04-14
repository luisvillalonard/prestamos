export interface DataMaestraBase {
    id: number,
    nombre: string,
}

export interface BaseActice {
    activo: boolean
}

export interface Ciudad extends DataMaestraBase, BaseActice { }

export interface DocumentoTipo extends DataMaestraBase, BaseActice { }

export interface FormaPago extends DataMaestraBase, BaseActice {
    dias: FormaPagoFecha[],
}

export interface FormaPagoFecha {
    id: number,
    formaPagoId: number,
    dia: number,
}

export interface MetodoPago extends DataMaestraBase, BaseActice { }

export interface Moneda extends DataMaestraBase, BaseActice { }

export interface Ocupacion extends DataMaestraBase, BaseActice { }

export interface PrestamoEstado extends DataMaestraBase {
    inicial: boolean,
    final: boolean,
}

export interface Sexo extends DataMaestraBase { }

export interface Acesor extends DataMaestraBase, BaseActice { }