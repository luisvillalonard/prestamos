import Swal from "sweetalert2";

export function Exito(mensaje: string) {
    Swal.fire({
        title: 'Exito!',
        html: `${mensaje}`,
        icon: 'success',
    })
}

export function Alerta(mensaje: string | string[]) {
    Swal.fire({
        title: 'Alerta!',
        html: getMessage(mensaje),
        icon: 'warning',
    })
}

export function Error(mensaje: string) {
    Swal.fire({
        title: 'Error!',
        html: `${mensaje}`,
        icon: 'error'
    })
}

export function Confirmacion(mensaje: string): Promise<boolean> {
    return Swal.fire({
        title: 'Confirmación!',
        html: `${mensaje}`,
        icon: 'question',
        showDenyButton: false,

        /* Aceptar */
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',

        /* Cancelar */
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        return  result.isConfirmed;
    })
}

const getMessage = (mensaje: string | string[]): string => {

    if (typeof mensaje === "string") {
        return `${mensaje}`
    } else if (typeof mensaje === "object" && mensaje instanceof Array) {
        return `<ul>${mensaje.map(msg => `<li>${msg}</li>`)}</ul>`
    }

    return ''

}