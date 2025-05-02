import { Cliente } from '@interfaces/clientes'
import { Prestamo } from '@interfaces/prestamos'
import { GetProp, UploadProps } from "antd"
import ExcelJS, { Workbook, Worksheet } from 'exceljs'
import * as XLSX from 'xlsx'
import { Colors } from './useConstants'
import { getArrayBuffer } from './useUtils'

export const fileType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export interface FileData {
    ok: boolean,
    name?: string,
    data: unknown[],
    errors: string[],
}

type TitleLevel = 1 | 2
interface Title {
    text: string,
    level: TitleLevel,
}
export interface HeaderColumn {
    key: string,
    text: string,
    width?: number
}

export async function loadExcel(file: FileType): Promise<FileData> {

    const fileData: FileData = {
        ok: false,
        data: [],
        errors: [],
    }

    if (!file) {
        return { ...fileData, errors: ['No existe un archivo cargado para esta operación.'] }
    }

    const buffer = await getArrayBuffer(file) as unknown as ArrayBuffer;
    if (!buffer) {
        return { ...fileData, errors: ['No fue posible cargar el archivo.'] }
    }

    const workbook: XLSX.WorkBook = XLSX.read(buffer, { type: buffer ? "binary" : "array" });
    if (!workbook) {
        return { ...fileData, errors: ['No fue posible leer el archivo.'] }
    }
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return { ...fileData, errors: ['No fue posible leer la hoja del archivo.'] }
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
    if (!worksheet) {
        return { ...fileData, errors: ['No fue posible leer la hoja del archivo.'] }
    }

    let jsonResult = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (!jsonResult) {
        return { ...fileData, errors: ['No fue posible leer los datos del archivo.'] }
    }

    return {
        ...fileData,
        ok: true,
        name: file.name,
        data: jsonResult,
        errors: []
    };

}

export const exportarClientesExcel = async (data: Cliente[]) => {

    // Add rows to the worksheet
    const rows = data.map((row, index) => {
        return {
            id: index + 1,
            codigo: row.codigo,
            empleadoId: row.empleadoId,
            nombres: row.nombres,
            apellidos: row.apellidos,
            documento: `${(row.documentoTipo ? '(' + row.documentoTipo.nombre + ')' : '').trim()} ${row.documento}`,
            sexo: row.sexo?.nombre,
            fechaNacimiento: row.fechaNacimiento,
            ciudad: row.ciudad?.nombre,
            ocupacion: row.ocupacion?.nombre,
            direccion: row.direccion,
            telefonoFijo: row.telefonoFijo,
            telefonoCelular: row.telefonoCelular,
            fechaCreacion: row.fechaCreacion,
            fechaActualizado: row.fechaActualizado,
            activo: row.activo ? 'Si' : 'No',
        }
    });

    // Add column headers
    const headersColumns: HeaderColumn[] = [
        { text: "#", key: "id", width: 8 },
        { text: "Código", key: "codigo" },
        { text: "Código Empleado", key: "empleadoId" },
        { text: "Nombres", key: "nombres" },
        { text: "Apellidos", key: "apellidos" },
        { text: "Documento", key: "documento" },
        { text: "Sexo", key: "sexo" },
        { text: "Fecha Nacimiento", key: "fechaNacimiento" },
        { text: "Ciudad", key: "ciudad" },
        { text: "Ocupación", key: "ocupacion" },
        { text: "Dirección", key: "direccion" },
        { text: "Teléfono Fijo", key: "telefonoFijo" },
        { text: "Teléfono Celular", key: "telefonoCelular" },
        { text: "fechaCreacion", key: "fechaCreacion" },
        { text: "Fecha Actualizado", key: "fechaActualizado" },
        { text: "activo", key: "activo" }
    ];

    // Creo el libro de excel
    const workbook = new ExcelJS.Workbook();

    // Creo la hoja de excel
    const sheet = workbook.addWorksheet("Clientes");

    // Configuro algunas propiedades
    sheet.properties = { ...sheet.properties, defaultRowHeight: 20, defaultColWidth: 18 };

    // Agrego los titulos del archivo
    addTitles([
        { text: 'Sistema de Pruebas', level: 1 },
        { text: 'Registro de Clientes', level: 2 },
    ], sheet, headersColumns.length);

    // Agrego una linea en blanco para separar los titulos de los encabezados
    sheet.addRow(null);

    // Agrego los encabezados de los datos
    addHeaders(headersColumns, sheet);

    // Agrego los datos al archivo
    rows.forEach(item => {
        const row = sheet.addRow(null);
        headersColumns.forEach((header, index) => {
            let cell = row.getCell(index + 1);
            cell.value = Object(item)[header.key];
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        })
    });

    // Envio los datos al navegador
    exportToResponse(workbook, 'Registro de Clientes');
};

export const exportarPrestamosExcel = async (data: Prestamo[]) => {

    // Add rows to the worksheet
    const rows = data.map((row, index) => {
        return {
            id: index + 1,
            codigo: row.codigo,
            fechaCredito: row.fechaCredito,
            cliente: `${row.cliente?.nombres} ${row.cliente?.apellidos}`.trim(),
            monto: row.monto,
            interes: row.interes,
            metodoPago: row.metodoPago?.nombre,
            estado: row.estado?.nombre
        }
    });

    // Add column headers
    const headersColumns: HeaderColumn[] = [
        { text: "#", key: "id", width: 8 },
        { text: "Código", key: "codigo" },
        { text: "Fecha Crédito", key: "fechaCredito" },
        { text: "Cliente", key: "cliente" },
        { text: "Monto", key: "monto" },
        { text: "Interés", key: "interes" },
        { text: "Método de Pago", key: "metodoPago" },
        { text: "Estado", key: "estado" },
    ];

    // Creo el libro de excel
    const workbook = new ExcelJS.Workbook();

    // Creo la hoja de excel
    const sheet = workbook.addWorksheet("Clientes");

    // Configuro algunas propiedades
    sheet.properties = { ...sheet.properties, defaultRowHeight: 20, defaultColWidth: 18 };

    // Agrego los titulos del archivo
    addTitles([
        { text: 'Sistema de Pruebas', level: 1 },
        { text: 'Prestamos Registrados', level: 2 },
    ], sheet, headersColumns.length);

    // Agrego una linea en blanco para separar los titulos de los encabezados
    sheet.addRow(null);

    // Agrego los encabezados de los datos
    addHeaders(headersColumns, sheet);

    // Agrego los datos al archivo
    rows.forEach(item => {
        const row = sheet.addRow(null);
        headersColumns.forEach((header, index) => {
            let cell = row.getCell(index + 1);
            cell.value = Object(item)[header.key];
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        })
    });

    // Envio los datos al navegador
    exportToResponse(workbook, 'Prestamos Registrados');
};

export const addTitles = (titles: Title[], sheet: Worksheet, columns?: number) => {

    if (!sheet && (!titles || titles.length === 0)) return;

    titles.forEach((title, index) => {
        const row = sheet.addRow(null);
        const currentRowIdx = index + 1;
        const endColumnIdx = columns ?? currentRowIdx;
        sheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
        const cell = row.getCell(1);
        cell.value = title.text
        cell.font = { size: title.level === 1 ? 26 : 18, bold: title.level === 2 }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = title.level === 1 ? 32 : 26
    });
}

export const addHeaders = (headers: HeaderColumn[], sheet: Worksheet) => {

    if (!sheet && (!headers || headers.length === 0)) return;

    var headerRow = sheet.addRow(null);
    headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = header.text;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: Colors.Gris51.replace('#', '') } };
        cell.font = { bold: true, color: { argb: Colors.White.replace('#', '') } }
        cell.alignment = { vertical: 'middle' }
    })
    headerRow.height = 22
}

export const getDataValidation = (valores: unknown[], showErrorMessage: boolean, errorMessage?: string): ExcelJS.DataValidation => {

    return {
        type: 'list',
        allowBlank: true,
        formulae: [`"${valores.join(',')}"`],
        showErrorMessage: showErrorMessage,
        errorStyle: 'error',
        error: errorMessage,
    }

}

export const exportToResponse = (workbook: Workbook, filename: string) => {

    if (!workbook) return;

    workbook.xlsx.writeBuffer()
        .then(data => {
            const blob = new Blob([data], {
                type: fileType
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${filename}.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        });

}