import AlertStatic from "@components/alerts/alert"
import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import UploadButton from "@components/buttons/upload"
import Container from "@components/containers/container"
import { TagDanger, TagSuccess } from "@components/tags/tags"
import TitlePage from "@components/titles/titlePage"
import { Colors } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { DD_MM_YYYY } from "@hooks/useDate"
import { exportToResponse, FileData, getDataValidation, HeaderColumn } from "@hooks/useFile"
import { IconExcel } from "@hooks/useIconos"
import { Cliente } from "@interfaces/clientes"
import { Ciudad, DocumentoTipo, Ocupacion, Sexo } from "@interfaces/dataMaestra"
import { Col, Divider, Flex, Space, Table } from "antd"
import { useEffect, useState } from "react"
import ExcelJS from "exceljs"

export default function PageClienteCargaMasiva() {

    const {
        contextDocumentosTipos: { state: { datos: tiposDocumentos }, todos: cargarTiposDocumentos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
    } = useData()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [errores, setErrores] = useState<string[]>([])
    const [validos, setValidos] = useState<boolean>(false)

    const cargarAuxiliares = () => Promise.all([cargarTiposDocumentos(), cargarSexos(), cargarCiudades(), cargarOcupaciones()])

    const generaClientes = (file: FileData) => {

        if (!file) {
            setClientes([]);
            setErrores([]);
            return;
        }

        setErrores([]);

        if (!file.data) {
            setErrores(['No existen datos que procesar en el archivo.']);
            return;
        }

        const rows = file.data.slice(4);
        if (!rows || rows.length === 0) {
            setErrores(['El archivo no tiene datos que procesar.']);
            return;
        }

        const nuevosClientes: Cliente[] = [];
        for (let index = 0; index < rows.length; index++) {

            const row: any = rows[index];
            let tipoDocumento: DocumentoTipo | undefined = tiposDocumentos.filter(item => item.id === row[4])[0];
            let sexo: Sexo | undefined = sexos.filter(item => item.id === row[6])[0];
            let ciudad: Ciudad | undefined = ciudades.filter(item => item.id === row[8])[0];
            let ocupacion: Ocupacion | undefined = ocupaciones.filter(item => item.id === row[9])[0];

            nuevosClientes.push({
                id: 0,
                codigo: row[0],
                empleadoId: row[1],
                nombres: row[2],
                apellidos: row[3],
                documentoTipo: tipoDocumento,
                documento: row[5],
                sexo: sexo,
                fechaNacimiento: row[7],
                ciudad: ciudad,
                ocupacion: ocupacion,
                direccion: row[10] ? row[10] : undefined,
                telefonoFijo: row[11] ? row[11] : undefined,
                telefonoCelular: row[12] ? row[12] : undefined,
                fechaAntiguedad: row[13] ? row[13] : undefined,
                fechaCreacion: DD_MM_YYYY(new Date()),
                activo: row[14],
            });

        }

        setClientes(nuevosClientes);
        setValidos(true);

    }

    const descargarPlantilla = async () => {

        // Creo el libro de excel
        const workbook = new ExcelJS.Workbook();

        // Creo la hoja de excel
        const worksheet = workbook.addWorksheet("Plantilla Clientes");

        // Configuro algunas propiedades
        worksheet.properties = { ...worksheet.properties, defaultRowHeight: 18, showGridLines: true };

        // Agrego los titulos
        let row = worksheet.addRow(null);
        worksheet.mergeCells("A1:O1");
        let cell = row.getCell(1);
        cell.value = 'LoanManagement';
        cell.font = { size: 20, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 32;

        row = worksheet.addRow(null);
        worksheet.mergeCells("A2:O2");
        cell = row.getCell(1);
        cell.value = 'Carga Masiva de Clientes';
        cell.font = { size: 14, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 22;

        // Agrego una fila intermedia en blanco
        worksheet.addRow(null);

        // Agrego los encabezados de las columnas
        var headerRow = worksheet.addRow(null);
        const headers: HeaderColumn[] =
        [
            { key: '1', text: "Codigo", width: 10 },
            { key: '2', text: "Codigo Empleado" },
            { key: '3', text: "Nombres", width: 16 },
            { key: '4', text: "Apellidos", width: 16 },
            { key: '5', text: "Tipo Documento", width: 19 },
            { key: '6', text: "Documento", width: 16 },
            { key: '7', text: "Sexo" },
            { key: '8', text: "Fecha Nacimiento", width: 20 },
            { key: '9', text: "Ciudad", width: 20 },
            { key: '10', text: "Ocupacion", width: 20 },
            { key: '11', text: "Dirección", width: 24 },
            { key: '12', text: "Telefono Fijo" },
            { key: '13', text: "Telefono Celular" },
            { key: '14', text: "Fecha Antiguedad" },
            { key: '15', text: "Activo", width: 16 },
        ];
        headers.forEach((header, index) => {
            const cell = headerRow.getCell(index + 1)
            cell.value = header.text
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: Colors.Primary.replace('#', '') } }
            cell.font = { bold: true, color: { argb: Colors.White.replace('#', '') } }
            cell.alignment = { vertical: 'middle' }
            const col = worksheet.getColumn(index);
            if (col) { col.width = header.width }
        })
        headerRow.height = 22;

        // Agrego los listados de los campos necesarios
        worksheet.getCell('E5:999999').dataValidation = getDataValidation(tiposDocumentos.map(item => item.nombre), true, "Is Invalid");
        worksheet.getCell('G5:999999').dataValidation = getDataValidation(sexos.map(item => item.nombre), true, "Is Invalid");
        worksheet.getCell('I5:999999').dataValidation = getDataValidation(ciudades.map(item => item.nombre), true, "Is Invalid");
        worksheet.getCell('J5:999999').dataValidation = getDataValidation(ocupaciones.map(item => item.nombre), true, "Is Invalid");

        // Lo subo al navegador
        exportToResponse(workbook, "Plantilla Carga Masiva Clientes.xlsx");

    }

    useEffect(() => { cargarAuxiliares() }, [])

    return (
        <>
            <Col xs={24}>

                <Flex align="center" justify="space-between">
                    <TitlePage title="M&oacute;lculo de Carga masiva de Clientes" />
                    <Space>
                        <ButtonPrimary disabled={!validos}>Cargar Clientes</ButtonPrimary>
                    </Space>
                </Flex>
                <Divider className='my-3' />

                <AlertStatic errors={errores} />

                <Container
                    size="small"
                    className="mb-3"
                    title="Carga de Archivo Excel"
                    extra={<>
                        <ButtonSuccess
                            icon={<IconExcel style={{ display: 'flex', fontSize: 20 }} />}
                            onClick={descargarPlantilla}>
                            Descargar Plantilla
                        </ButtonSuccess>
                    </>}>
                    <UploadButton
                        title="Buscar"
                        accept={['.xlsx', '.xls']}
                        onChange={generaClientes}
                        onError={setErrores} />
                </Container>

                <Container>
                    <Table<Cliente>
                        size='middle'
                        bordered={false}
                        pagination={{ size: 'default', responsive: true }}
                        dataSource={clientes.map((item, index) => { return { ...item, key: index + 1 } })
                        }
                        locale={{ emptyText: <Flex>0 clientes</Flex> }}
                        scroll={{ x: 'max-content' }}>
                        <Table.Column title='#' dataIndex='key' key='key' align='center' fixed='left' width={60} />
                        <Table.Column title='Código' dataIndex='codigo' key='codigo' fixed='left' width={80} />
                        <Table.Column title='Empleado Id' dataIndex='empleadoId' key='empleadoId' fixed='left' width={100} />
                        <Table.Column title='Nombres y Apellidos' render={(record: Cliente) => (
                            `${record.nombres} ${record.apellidos}`
                        )} />
                        <Table.Column title='Tipo Documento' render={(record: Cliente) => (record.documentoTipo?.nombre)} />
                        <Table.Column title='Documento' render={(record: Cliente) => (record.documento)} />
                        <Table.Column title='Sexo' render={(record: Cliente) => (record.sexo?.nombre)} />
                        <Table.Column title='Ciudad' render={(record: Cliente) => (record.ciudad?.nombre)} />
                        <Table.Column title='Ocupaci&oacute;n' render={(record: Cliente) => (record.ocupacion?.nombre)} />
                        <Table.Column title='Celular' render={(record: Cliente) => (
                            <span style={{ textWrap: 'nowrap' }}>{record.telefonoCelular}</span>
                        )} />
                        <Table.Column title='Estado' render={(record: Cliente) => (
                            record.activo ? <TagSuccess text='Activo' /> : <TagDanger text='Inactivo' />
                        )} />
                    </Table>
                </Container>

            </Col>
        </>
    )
}