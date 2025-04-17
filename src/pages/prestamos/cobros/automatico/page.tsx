import AlertStatic from "@components/alerts/alert";
import { ButtonPrimary } from "@components/buttons/primary";
import { ButtonSuccess } from "@components/buttons/success";
import UploadButton from "@components/buttons/upload";
import Container from "@components/containers/container";
import TitlePage from "@components/titles/titlePage";
import { appUrl, Colors } from "@hooks/useConstants";
import { useData } from "@hooks/useData";
import { IconExcel } from "@hooks/useIconos";
import { Exito } from "@hooks/useMensaje";
import { FormatNumber } from "@hooks/useUtils";
import { PrestamoPago } from "@interfaces/prestamos";
import { Col, Divider, Flex, Table } from "antd";
import { useEffect, useState } from "react";

export default function PageCobroAutomatico() {

    const { contextPrestamosPagos: { automaticos } } = useData();
    const [datos, setDatos] = useState<PrestamoPago[]>([]);
    const [errores, setErrores] = useState<string[]>([]);

    const validaPagos = async () => {

        setErrores([]);
        const invalidos: number[] = [];
        let tieneErrores = false;
        datos.forEach((item, index) => {
            const { empleadoId, monto, fecha } = item;
            if (!empleadoId || monto <= 0 || !fecha) {
                invalidos.push(index + 1);
                tieneErrores = true;
            }
        })
        if (tieneErrores) {
            setErrores([`Los siguientes pagos tienen uno o más valores inválidos: ${invalidos.join(', ')}`]);
            return;
        }

    }

    const enviarPagos = async () => {

        setErrores([]);
        const result = await automaticos(datos);
        if (!result) {
            setDatos(datos);
            setErrores([`No fue posible realizar los pagos automáticos.`]);
            return;
        } else if (!result.ok) {
            setDatos(datos);
            setErrores([result.mensaje || 'No fue posible realizar los pagos automáticos.']);
            return;
        }

        if (result.ok && result.datos) {
            const invalidos = result.datos.filter((item) => item.anulado);
            if (invalidos.length > 0) {
                setDatos(datos);
                setErrores([
                    `Los siguientes pagos no fueron procesados:`,
                    ...invalidos.map((item, index) => `${index + 1}. Código Empleado: ${item.empleadoId} - Monto: ${FormatNumber(item.monto, 2)} - Fecha:${item.fecha}`)
                ]);
                return;
            }

            Exito(`Se han realizado ${result.datos.length} pagos automáticos exitosamente!.`);
            setErrores([]);
            setDatos([]);
        }
    }

    useEffect(() => { if (datos.length > 0) validaPagos() }, [datos]);

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <Flex justify="space-between" align="center">
                    <TitlePage title="M&oacute;lculo de Cobros Autom&aacute;ticos" />
                    <ButtonPrimary
                        htmlType="button"
                        disabled={errores.length > 0 || datos.length === 0}
                        onClick={enviarPagos}>
                        Realizar Pagos
                    </ButtonPrimary>
                </Flex>
                <Divider className='my-3' />

                <AlertStatic errors={errores} />

                <Container
                    size="small"
                    className="mb-3"
                    title="Carga de Archivo Excel"
                    extra={
                        <ButtonSuccess
                            href={`${appUrl}Plantilla Cobros Automaticos.xlsx`}
                            icon={<IconExcel style={{ display: 'flex', fontSize: 20 }} />}>
                            Descargar Plantilla de Cobros
                        </ButtonSuccess>
                    }>
                    <UploadButton
                        title="Buscar"
                        accept={['.xlsx', '.xls']}
                        onChange={(data) => {
                            setDatos(data);
                            setErrores([]);
                        }}
                        onError={setErrores} />
                </Container>

                <Container size="small" className="mb-3" title="Resultado de la Carga">
                    <Table
                        size="middle"
                        bordered={false}
                        locale={{ emptyText: <Flex>0 pagos cargados</Flex> }}
                        scroll={{ x: 'max-content' }}
                        dataSource={datos.map((item, index) => { return { ...item, key: index + 1 } })}>
                        <Table.Column title="#" dataIndex="key" key="key" align="center" fixed='left' width={50} />
                        <Table.Column title="C&oacute;digo Empleado"
                            onCell={(record: PrestamoPago) => ({
                                style: {
                                    color: !record.empleadoId ? Colors.Danger : '', fontWeight: !record.empleadoId ? 'bold' : ''
                                }
                            })}
                            render={(record: PrestamoPago) => (!record.empleadoId ? 'N/A' : record.empleadoId)} />
                        <Table.Column title="Monto"
                            onCell={(record: PrestamoPago) => ({
                                style: { color: record.monto <= 0 ? Colors.Danger : '', fontWeight: record.monto <= 0 ? 'bold' : '' }
                            })}
                            render={(record: PrestamoPago) => (FormatNumber(record.monto, 2))} />
                        <Table.Column title="Fecha Pago"
                            onCell={(record: PrestamoPago) => ({
                                style: { color: !record.fecha ? Colors.Danger : '', fontWeight: !record.fecha ? 'bold' : '' }
                            })}
                            render={(record: PrestamoPago) => (!record.fecha ? 'N/A' : record.fecha)} />
                    </Table>
                </Container>
            </Col>
        </>
    )
}