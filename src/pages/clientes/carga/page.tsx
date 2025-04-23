import AlertStatic from "@components/alerts/alert";
import UploadButton from "@components/buttons/upload";
import Container from "@components/containers/container";
import TitlePage from "@components/titles/titlePage";
import { FileData } from "@hooks/useFile";
import { Col, Divider } from "antd";
import { useState } from "react";

export default function PageClienteCargaMasiva() {

    const [errores, setErrores] = useState<string[]>([])

    const generaClientes = (file: FileData) => {

        setErrores([]);

        if (!file.data) {
            setErrores(['No existen datos que procesar en el archivo.']);
            return;
        }

        const rows = file.data.slice(3);
        if (!rows || rows.length === 0) {
            setErrores(['El archivo no tiene datos que procesar.']);
            return;
        }

        let item: Record<string, any> = {};
        for (var row in file.data) {
            for (let index = 0; index < file.headers.length; index++) {
                const headerName = file.headers[index];
                item[headerName] = row[index];
            }
            console.log('item', item)
        }

    }

    return (
        <>
            <Col xl={{ span: 20, offset: 2 }} lg={{ span: 24 }} md={{ span: 24 }} xs={{ span: 24 }}>

                <TitlePage title="M&oacute;lculo de Cobros Autom&aacute;ticos" />
                <Divider className='my-3' />

                <AlertStatic errors={errores} />

                <Container
                    size="small"
                    className="mb-3"
                    title="Carga de Archivo Excel">
                    <UploadButton
                        title="Buscar"
                        accept={['.xlsx', '.xls']}
                        onChange={generaClientes}
                        onError={setErrores} />
                </Container>

            </Col>
        </>
    )
}