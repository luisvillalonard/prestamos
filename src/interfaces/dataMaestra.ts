export interface DataMaestraBase {
    id: number,
    nombre: string,
}
export interface Sexo extends DataMaestraBase { }

export interface FormaPago extends DataMaestraBase { }

export interface PrestamoEstado extends DataMaestraBase { }