export interface DataMaestraBase {
    id: number,
    nombre: string,
}

export interface Ciudad extends DataMaestraBase { }

export interface DocumentoTipo extends DataMaestraBase { }

export interface FormaPago extends DataMaestraBase { }

export interface MetodoPago extends DataMaestraBase { }

export interface Moneda extends DataMaestraBase { }

export interface Ocupacion extends DataMaestraBase { }

export interface PrestamoEstado extends DataMaestraBase {
    inicial: boolean,
    final: boolean,
}

export interface Sexo extends DataMaestraBase { }

export interface Acesor extends DataMaestraBase { }