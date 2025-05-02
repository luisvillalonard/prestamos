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
import { exportToResponse, FileData, HeaderColumn } from "@hooks/useFile"
import { IconExcel } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { Cliente } from "@interfaces/clientes"
import { Ciudad, DocumentoTipo, Ocupacion, Sexo } from "@interfaces/dataMaestra"
import { Col, Divider, Flex, Space, Table } from "antd"
import ExcelJS from "exceljs"
import { useEffect, useState } from "react"

export default function PageClienteCargaMasiva() {

    const {
        contextClientes: { cargar: cargarClientes },
        contextDocumentosTipos: { state: { datos: tiposDocumentos }, todos: cargarTiposDocumentos },
        contextSexos: { state: { datos: sexos }, todos: cargarSexos },
        contextCiudades: { state: { datos: ciudades }, todos: cargarCiudades },
        contextOcupaciones: { state: { datos: ocupaciones }, todos: cargarOcupaciones },
    } = useData()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [errores, setErrores] = useState<string[]>([])
    const [validos, setValidos] = useState<boolean>(false)

    const cargarAuxiliares = () => Promise.all([cargarTiposDocumentos(), cargarSexos(), cargarCiudades(), cargarOcupaciones()])

    const generaClientes = (file?: FileData) => {

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
            const tipoDocumento: DocumentoTipo | undefined = row[4] ? tiposDocumentos.filter(item => item.nombre.toLowerCase() === row[4]?.toLowerCase())[0] : undefined;
            const sexo: Sexo | undefined = row[6] ? sexos.filter(item => item.nombre.toLowerCase() === row[6]?.toLowerCase())[0] : undefined;
            const ciudad: Ciudad | undefined = row[8] ? ciudades.filter(item => item.nombre.toLowerCase() === row[8]?.toLowerCase())[0] : undefined;
            const ocupacion: Ocupacion | undefined = row[9] ? ocupaciones.filter(item => item.nombre.toLowerCase() === row[9]?.toLowerCase())[0] : undefined;
            const activo: boolean = row[14] && String(row[14]) === 'SI' ? true : false;

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
                activo: activo,
            });

        }

        setClientes(nuevosClientes);
        setValidos(true);

    }

    const descargarPlantilla = async () => {

        // Creo el libro de excel
        const workbook = new ExcelJS.Workbook();

        // Creo la hoja de excel
        const worksheetClientes = workbook.addWorksheet("Plantilla Clientes");
        const worksheetCiudades = workbook.addWorksheet("Ciudades");
        const worksheetOcupaciones = workbook.addWorksheet("Ocupaciones");

        // Configuro algunas propiedades
        worksheetClientes.properties = { ...worksheetClientes.properties, defaultRowHeight: 18 };
        worksheetCiudades.properties = { ...worksheetClientes.properties };
        worksheetOcupaciones.properties = { ...worksheetClientes.properties };

        // Agrego la data maestra
        ciudades.forEach(tipo => {
            const row = worksheetCiudades.addRow([tipo.nombre]);
            if (row) {
                row.height = 16;
            }
        })
        ocupaciones.forEach(tipo => {
            const row = worksheetOcupaciones.addRow([tipo.nombre]);
            if (row) {
                row.height = 16;
            }
        })

        // Agrego los titulos
        let row = worksheetClientes.addRow(null);
        worksheetClientes.mergeCells("A1:O1");
        let cell = row.getCell(1);
        cell.value = 'LoanManagement';
        cell.font = { size: 20, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 32;

        row = worksheetClientes.addRow(null);
        worksheetClientes.mergeCells("A2:O2");
        cell = row.getCell(1);
        cell.value = 'Carga Masiva de Clientes';
        cell.font = { size: 14, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 22;

        // Agrego una fila intermedia en blanco
        worksheetClientes.addRow(null);

        // Agrego los encabezados de las columnas
        var headerRow = worksheetClientes.addRow(null);
        const headers: HeaderColumn[] =
            [
                { key: '1', text: "Codigo", width: 14 },
                { key: '2', text: "Codigo Empleado", width: 20 },
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
            cell.name = header.key
            cell.value = header.text
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: Colors.Primary.replace('#', '') } }
            cell.font = { bold: true, color: { argb: Colors.White.replace('#', '') } }
            cell.alignment = { vertical: 'middle' }
            const col = worksheetClientes.getColumn(index + 1);
            if (col) { col.width = header.width }
        })
        headerRow.height = 22;

        // Agrego los listados de las columnas necesarias
        Array.from(Array(10000).keys()).forEach((pos) => {
            if (pos > 4) {
                worksheetClientes.getCell(`E${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${tiposDocumentos.map(item => item.nombre).join(',')}"`],
                };
                worksheetClientes.getCell(`G${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${sexos.map(item => item.nombre).join(',')}"`],
                };
                worksheetClientes.getCell(`I${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`Ciudades!$A$1:$A${ocupaciones.length + 1}`],
                };
                worksheetClientes.getCell(`J${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`Ocupaciones!$A$1:$A${ocupaciones.length + 1}`],
                };
                worksheetClientes.getCell(`O${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"SI,NO"`],
                };
            }
        })

        // Lo subo al navegador
        exportToResponse(workbook, "Plantilla Carga Masiva Clientes");

    }

    const guardar = async () => {

        const result = await cargarClientes(clientes);
        if (!result.ok) {
            Alerta(result.mensaje || 'Situación ineesperada tratando de cargar los clientes establecidos.');
        } else if (result.ok) {
            Exito('Todos los clientes han sido cargados exitosamente!.');
        }
    }

    useEffect(() => { cargarAuxiliares() }, [])

    return (
        <>
            <Col xs={24}>

                <Flex align="center" justify="space-between">
                    <TitlePage title="M&oacute;lculo de Carga masiva de Clientes" />
                    <Space>
                        <ButtonPrimary disabled={!validos} onClick={guardar}>Cargar Clientes</ButtonPrimary>
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