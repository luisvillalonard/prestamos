import { Cliente } from '@interfaces/clientes';
import * as XLSX from 'xlsx';

export const exportClientToExcel = async (data: Cliente[]) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add rows to the worksheet
    const rows = data.map((row, index) => {
        return {
            id: index + 1,
            codigo: row.codigo,
            empleadoId: row.empleadoId,
            nombres: row.nombres,
            apellidos: row.apellidos,
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

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Add column headers
    worksheet.columns = [
        { header: "#", key: "id" },
        { header: "Código", key: "codigo" },
        { header: "Código Empleado", key: "empleadoId" },
        { header: "Nombres", key: "nombres" },
        { header: "Apellidos", key: "apellidos" },
        { header: "Documento", key: "documento" },
        { header: "Sexo", key: "sexo" },
        { header: "Fecha Nacimiento", key: "fechaNacimiento" },
        { header: "Ciudad", key: "ciudad" },
        { header: "Ocupación", key: "ocupacion" },
        { header: "Dirección", key: "direccion" },
        { header: "Teléfono Fijo", key: "telefonoFijo" },
        { header: "Teléfono Celular", key: "telefonoCelular" },
        { header: "fechaCreacion", key: "fechaCreacion" },
        { header: "Fecha Actualizado", key: "fechaActualizado" },
        { header: "activo", key: "activo" }
    ];

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "data.xlsx");
};