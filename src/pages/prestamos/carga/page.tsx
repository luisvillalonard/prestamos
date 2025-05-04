import AlertStatic from "@components/alerts/alert"
import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import UploadButton from "@components/buttons/upload"
import Container from "@components/containers/container"
import Loading from "@components/containers/loading"
import { TagDanger, TagDefault, TagSuccess } from "@components/tags/tags"
import TitlePage from "@components/titles/titlePage"
import { Colors } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { DD_MM_YYYY } from "@hooks/useDate"
import { exportToResponse, FileData, HeaderColumn } from "@hooks/useFile"
import { IconExcel } from "@hooks/useIconos"
import { Alerta, Exito } from "@hooks/useMensaje"
import { FormatNumber } from "@hooks/useUtils"
import { FormaPago, MetodoPago, Moneda, PrestamoEstado } from "@interfaces/dataMaestra"
import { PrestamoCuota, PrestamoCuotaImportado, PrestamoImportado } from "@interfaces/prestamos"
import { Col, Divider, Flex, Space, Table } from "antd"
import ExcelJS from "exceljs"
import { useEffect, useState } from "react"


export default function PagePrestamosCargaMasiva() {

    const {
        contextPrestamos: { state: { procesando }, cargar: cargarPrestamos },
        contextPrestamosEstados: { state: { datos: estados }, todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const [prestamos, setPrestamos] = useState<PrestamoImportado[]>([])
    const [errores, setErrores] = useState<string[]>([])
    const [validos, setValidos] = useState<boolean>(false)

    const cargarAuxiliares = () => Promise.all([cargarEstados(), cargarFormasPago(), cargarMetodosPago(), cargarMonedas(), cargarAcesores()])

    const generaPrestamos = (file: FileData) => {

        if (!file) {
            setPrestamos([]);
            setErrores([]);
            return;
        }

        setErrores([]);

        if (!file.data || file.data.length === 0) {
            setErrores(['No existen datos que procesar en el archivo.']);
            return;
        }

        const sheets: any[] = file.data;
        const rowsPrestamos = sheets[0].slice(3);
        const rowsPrestamosCuotas = sheets[1].slice(3);
        if (!rowsPrestamos || rowsPrestamos.length === 0) {
            setErrores(['El archivo no tiene datos que procesar.']);
            return;
        }

        const prestamosCuotas: PrestamoCuotaImportado[] = [];
        for (let index = 0; index < rowsPrestamosCuotas.length; index++) {

            const row: any = rowsPrestamosCuotas[index];
            const pagado: boolean = row[8] && String(row[8]) === 'SI' ? true : false;

            prestamosCuotas.push({
                id: 0,
                prestamoId: 0,
                prestamoCodigo: row[0],
                fechaPago: DD_MM_YYYY(row[1]),
                deudaInicial: row[2] ? parseFloat(row[2]) : 0,
                capital: row[3] ? parseFloat(row[3]) : 0,
                interes: row[4] ? parseInt(row[4]) : 0,
                amortizacion: row[5] ? parseFloat(row[5]) : 0,
                descuento: row[6] ? parseFloat(row[6]) : 0,
                saldoFinal: row[7] ? parseFloat(row[7]) : 0,
                vencido: false,
                pagado: pagado,
                pagos: []
            })
        }

        const nuevosPrestamos: PrestamoImportado[] = [];
        for (let index = 0; index < rowsPrestamos.length; index++) {

            const row: any = rowsPrestamos[index];
            const fechaRegistro: string = DD_MM_YYYY(row[2]);
            const fechaCredito: string = DD_MM_YYYY(row[3]);
            const formaPago: FormaPago | undefined = row[4] ? formasPago.filter(item => item.nombre.toLowerCase() === row[4]?.toLowerCase())[0] : undefined;
            const metodoPago: MetodoPago | undefined = row[5] ? metodosPago.filter(item => item.nombre.toLowerCase() === row[5]?.toLowerCase())[0] : undefined;
            const moneda: Moneda | undefined = row[6] ? monedas.filter(item => item.nombre.toLowerCase() === row[6]?.toLowerCase())[0] : undefined;
            const acesor: Moneda | undefined = row[11] ? acesores.filter(item => item.nombre.toLowerCase() === row[11]?.toLowerCase())[0] : undefined;
            const cancelado: boolean = row[12] && String(row[12]) === 'SI' ? true : false;
            const estado: PrestamoEstado | undefined = row[14] ? estados.filter(item => item.nombre.toLowerCase() === row[14]?.toLowerCase())[0] : undefined;
            const cuotas: PrestamoCuota[] = prestamosCuotas.filter(cuota => cuota.prestamoCodigo === row[0]);
            const valido: boolean = (fechaRegistro && fechaCredito && formaPago && metodoPago && moneda && estado) ? true : false;

            nuevosPrestamos.push({
                id: 0,
                codigo: row[0],
                clienteCodigo: row[1],
                fechaRegistro: row[2],
                fechaCredito: row[3],
                formaPago: formaPago,
                metodoPago: metodoPago,
                moneda: moneda,
                monto: row[7] ? parseFloat(row[7]) : 0,
                interes: row[8] ? parseFloat(row[8]) : 0,
                cuotas: row[9] ? parseInt(row[9]) : 0,
                estado: estado,
                destino: '',
                acesor: acesor,
                cancelado: cancelado,
                prestamoCuotas: cuotas,
                aplicaDescuento: false,
                valido: valido,
                existe: false,
            });

        }

        setPrestamos(nuevosPrestamos);
        setValidos(true);

    }

    const descargarPlantilla = async () => {

        // Creo el libro de excel
        const workbook = new ExcelJS.Workbook();

        // Creo las hojas de excel
        const worksheetPrestamos: ExcelJS.Worksheet = workbook.addWorksheet("Prestamos");
        const worksheetCuotas: ExcelJS.Worksheet = workbook.addWorksheet("Cuotas");

        // Configuro algunas propiedades
        worksheetPrestamos.properties = { ...worksheetPrestamos.properties, defaultRowHeight: 18, showGridLines: true };
        worksheetCuotas.properties = worksheetPrestamos.properties;

        const headersPrestamos: HeaderColumn[] = [
            { key: '1', text: "Codigo", width: 10 },
            { key: '2', text: "Codigo Cliente" },
            { key: '3', text: "Fecha Registro", width: 16 },
            { key: '3', text: "Fecha Crédito", width: 16 },
            { key: '4', text: "Forma Pago", width: 16 },
            { key: '5', text: "Método Pago", width: 16 },
            { key: '6', text: "Moneda", width: 16 },
            { key: '7', text: "Monto", width: 16 },
            { key: '8', text: "Interes", width: 16 },
            { key: '9', text: "Cuotas", width: 16 },
            { key: '10', text: "Aplica Descuento", width: 16 },
            { key: '11', text: "Acesor", width: 24 },
            { key: '12', text: "Cancelado", width: 16 },
            { key: '14', text: "Fecha Cancelado", width: 20 },
            { key: '14', text: "Estado", width: 20 },
        ];
        const headersCuotas: HeaderColumn[] = [
            { key: '1', text: "Codigo Prestamo", width: 16 },
            { key: '2', text: "Fecha Pago", width: 16 },
            { key: '3', text: "Deuda Inicial", width: 16 },
            { key: '3', text: "Capital", width: 16 },
            { key: '4', text: "Interés", width: 16 },
            { key: '5', text: "Amortización", width: 16 },
            { key: '6', text: "Descuento", width: 16 },
            { key: '7', text: "Saldo Final", width: 16 },
            { key: '8', text: "Pagado", width: 16 },
        ];

        // Agrego los titulos
        agregarEncabezados(worksheetPrestamos, headersPrestamos.length);
        agregarEncabezados(worksheetCuotas, headersCuotas.length);

        // Agrego una fila intermedia en blanco
        worksheetPrestamos.addRow(null);

        // Agrego los encabezados de las columnas
        var headerRow = worksheetPrestamos.addRow(null);
        headersPrestamos.forEach((header, index) => {
            const cell = headerRow.getCell(index + 1)
            cell.value = header.text
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: Colors.Primary.replace('#', '') } }
            cell.font = { bold: true, color: { argb: Colors.White.replace('#', '') } }
            cell.alignment = { vertical: 'middle' }
            const col = worksheetPrestamos.getColumn(index);
            if (col) { col.width = header.width }
        })
        headerRow.height = 22;

        // Agrego los listados de las columnas necesarias
        Array.from(Array(10000).keys()).forEach((pos) => {
            if (pos > 4) {
                worksheetPrestamos.getCell(`E${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${formasPago.map(item => item.nombre).join(',')}"`],
                };
                worksheetPrestamos.getCell(`F${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${metodosPago.map(item => item.nombre).join(',')}"`],
                };
                worksheetPrestamos.getCell(`G${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${monedas.map(item => item.nombre).join(',')}"`],
                };
                worksheetPrestamos.getCell(`L${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${acesores.map(item => item.nombre).join(',')}"`],
                };
                worksheetPrestamos.getCell(`O${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${estados.map(item => item.nombre).join(',')}"`],
                };
                worksheetPrestamos.getCell(`K${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"SI,NO"`],
                };
                worksheetPrestamos.getCell(`M${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"SI,NO"`],
                };
            }
        })

        // Agrego una fila intermedia en blanco
        worksheetCuotas.addRow(null);

        // Agrego los encabezados de las columnas
        var headerRow = worksheetCuotas.addRow(null);
        headersCuotas.forEach((header, index) => {
            const cell = headerRow.getCell(index + 1)
            cell.value = header.text
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: Colors.Primary.replace('#', '') } }
            cell.font = { bold: true, color: { argb: Colors.White.replace('#', '') } }
            cell.alignment = { vertical: 'middle' }
            const col = worksheetCuotas.getColumn(index);
            if (col) { col.width = header.width }
        })
        headerRow.height = 22;

        // Agrego los listados de las columnas necesarias
        Array.from(Array(10000).keys()).forEach((pos) => {
            if (pos > 4) {
                worksheetCuotas.getCell(`I${pos}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"SI,NO"`],
                };
            }
        })

        // Lo subo al navegador
        exportToResponse(workbook, "Plantilla Carga Masiva Prestamos");

    }

    const agregarEncabezados = (sheet: ExcelJS.Worksheet, countCols: number) => {

        const colText: string[] = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
        let row = sheet.addRow(null);
        sheet.mergeCells(`A1:${colText.filter((_, index) => index === countCols - 1)[0] ?? 'A'}1`);
        let cell = row.getCell(1);
        cell.value = 'LoanManagement';
        cell.font = { size: 20, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 32;

        row = sheet.addRow(null);
        sheet.mergeCells(`A2:${colText.filter((_, index) => index === countCols - 1)[0] ?? 'A'}2`);
        cell = row.getCell(1);
        cell.value = 'Carga Masiva de Prestamos';
        cell.font = { size: 14, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 22;

    }

    const guardar = async () => {

        const result = await cargarPrestamos(prestamos);
        if (!result.ok) {
            Alerta(result.mensaje || 'Situación ineesperada tratando de cargar los prestamos establecidos.');
        } else if (result.ok) {
            setPrestamos(result.datos ?? []);
            Exito(result.mensaje || 'El proceso de carga de prestamos ha concluido exitosamente!.');
        }
    }

    useEffect(() => { cargarAuxiliares() }, [])

    return (
        <>
            <Col xs={24}>

                <Loading fullscreen active={procesando} message="Procesando, espere..." />
                <Flex align="center" justify="space-between">
                    <TitlePage title="M&oacute;lculo de Carga Masiva de Prestamos" />
                    <Space>
                        <ButtonPrimary disabled={!validos} onClick={guardar}>Cargar Prestamos</ButtonPrimary>
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
                        onChange={generaPrestamos}
                        onError={setErrores} />
                </Container>

                <Container>
                    <Table<PrestamoImportado>
                        size="middle"
                        bordered={false}
                        pagination={{ size: 'default' }}
                        locale={{ emptyText: <Flex>0 prestamos</Flex> }}
                        scroll={{ x: 1300 }}
                        dataSource={prestamos.map((item, index) => { return { ...item, key: index + 1 } })}>
                        <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
                        <Table.Column title='Valido' render={(record: PrestamoImportado) => (
                            record.valido ? <TagSuccess text='Si' /> : <TagDanger text='No' />
                        )} />
                        <Table.Column title='Existe' render={(record: PrestamoImportado) => (
                            record.existe ? <TagDanger text='Si' /> : <TagDefault text='No' />
                        )} />
                        <Table.Column title="Código" dataIndex="codigo" key="codigo" />
                        <Table.Column title="Fecha Registro" render={(record: PrestamoImportado) => (record.fechaRegistro)} />
                        <Table.Column title="Fecha Cr&eacute;dito" render={(record: PrestamoImportado) => (record.fechaCredito)} />
                        <Table.Column title="Codigo Cliente" render={(record: PrestamoImportado) => (record.clienteCodigo)} />
                        <Table.Column title="Forma Pago" render={(record: PrestamoImportado) => (record.formaPago?.nombre)} />
                        <Table.Column title="M&eacute;todo Pago" render={(record: PrestamoImportado) => (record.metodoPago?.nombre)} />
                        <Table.Column title="Moneda" render={(record: PrestamoImportado) => (record.moneda?.nombre)} />
                        <Table.Column title="Monto" render={(record: PrestamoImportado) => (FormatNumber(record.monto, 2))} />
                        <Table.Column title="Inter&eacute;s" render={(record: PrestamoImportado) => (FormatNumber(record.interes, 2))} />
                        <Table.Column title="Cancelado" render={(record: PrestamoImportado) => (
                            record.cancelado ? <TagDanger text="Si" /> : <TagDefault text="No" />
                        )} />
                        <Table.Column title="Estado" render={(record: PrestamoImportado) => (
                            record.estado?.final ? <TagSuccess text={record.estado?.nombre} /> : <TagDefault text={record.estado?.nombre || 'Desconocido'} />
                        )} />
                    </Table>
                </Container>

            </Col>
        </>
    )
}