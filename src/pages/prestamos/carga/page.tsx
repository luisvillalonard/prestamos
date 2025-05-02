import AlertStatic from "@components/alerts/alert"
import { ButtonPrimary } from "@components/buttons/primary"
import { ButtonSuccess } from "@components/buttons/success"
import UploadButton from "@components/buttons/upload"
import Container from "@components/containers/container"
import { TagDanger, TagDefault, TagSuccess } from "@components/tags/tags"
import TitlePage from "@components/titles/titlePage"
import { Colors } from "@hooks/useConstants"
import { useData } from "@hooks/useData"
import { exportToResponse, FileData, HeaderColumn } from "@hooks/useFile"
import { IconExcel } from "@hooks/useIconos"
import { PrestamoEstado } from "@interfaces/dataMaestra"
import { Col, Divider, Flex, Space, Table } from "antd"
import { useEffect, useState } from "react"
import ExcelJS from "exceljs"
import { Prestamo } from "@interfaces/prestamos"
import { FormatNumber } from "@hooks/useUtils"


export default function PagePrestamosCargaMasiva() {

    const {
        contextPrestamosEstados: { state: { datos: estados }, todos: cargarEstados },
        contextFormasPago: { state: { datos: formasPago }, todos: cargarFormasPago },
        contextMetodosPago: { state: { datos: metodosPago }, todos: cargarMetodosPago },
        contextMonedas: { state: { datos: monedas }, todos: cargarMonedas },
        contextAcesores: { state: { datos: acesores }, todos: cargarAcesores },
    } = useData()
    const [prestamos, setPrestamos] = useState<Prestamo[]>([])
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

        if (!file.data) {
            setErrores(['No existen datos que procesar en el archivo.']);
            return;
        }

        const rows = file.data.slice(4);
        if (!rows || rows.length === 0) {
            setErrores(['El archivo no tiene datos que procesar.']);
            return;
        }

        const nuevosPrestamos: Prestamo[] = [];
        for (let index = 0; index < rows.length; index++) {

            const row: any = rows[index];
            let estado: PrestamoEstado | undefined = estados.filter(item => item.id === row[4])[0];

            nuevosPrestamos.push({
                id: 0,
                codigo: '',
                cliente: undefined,
                fechaRegistro: '',
                fechaCredito: '',
                formaPago: undefined,
                metodoPago: undefined,
                moneda: undefined,
                monto: 0,
                interes: 0,
                cuotas: 0,
                estado: estado,
                destino: '',
                acesor: undefined,
                usuario: undefined,
                cancelado: false,
                prestamoCuotas: [],
                aplicaDescuento: false,
                capitalCuota: 0,
                totalInteres: 0,
                amortizacion: 0,
                reenganche: false,
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
                worksheetPrestamos.getCell(`I${pos}`).dataValidation = {
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
        sheet.mergeCells(`A1:${colText.filter((_, index) => index === countCols-1)[0] ?? 'A'}1`);
        let cell = row.getCell(1);
        cell.value = 'LoanManagement';
        cell.font = { size: 20, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 32;

        row = sheet.addRow(null);
        sheet.mergeCells(`A2:${colText.filter((_, index) => index === countCols-1)[0] ?? 'A'}2`);
        cell = row.getCell(1);
        cell.value = 'Carga Masiva de Prestamos';
        cell.font = { size: 14, bold: false };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        row.height = 22;

    }


    useEffect(() => { cargarAuxiliares() }, [])

    return (
        <>
            <Col xs={24}>

                <Flex align="center" justify="space-between">
                    <TitlePage title="M&oacute;lculo de Carga Masiva de Prestamos" />
                    <Space>
                        <ButtonPrimary disabled={!validos}>Cargar Prestamos</ButtonPrimary>
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
                    <Table<Prestamo>
                        size="middle"
                        bordered={false}
                        pagination={{ size: 'default' }}
                        locale={{ emptyText: <Flex>0 prestamos</Flex> }}
                        scroll={{ x: 1300 }}
                        dataSource={prestamos.map((item, index) => { return { ...item, key: index + 1 } })}>
                        <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={60} />
                        <Table.Column title="Código" dataIndex="codigo" key="codigo" />
                        <Table.Column title="Fecha Cr&eacute;dito" render={(record: Prestamo) => (record.fechaCredito)} />
                        <Table.Column title="Cliente Codigo" render={(record: Prestamo) => (record.cliente?.codigo)} />
                        <Table.Column title="Monto" render={(record: Prestamo) => (FormatNumber(record.monto, 2))} />
                        <Table.Column title="Inter&eacute;s" render={(record: Prestamo) => (FormatNumber(record.interes, 2))} />
                        <Table.Column title="Estado" render={(record: Prestamo) => (
                            record.cancelado
                                ? <TagDanger text={record.estado?.nombre || 'Desconocido'} />
                                : record.estado?.final
                                    ? <TagSuccess text={record.estado?.nombre || 'Desconocido'} />
                                    : <TagDefault text="Desconocido" />
                        )} />
                    </Table>
                </Container>

            </Col>
        </>
    )
}