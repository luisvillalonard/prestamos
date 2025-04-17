import { DD_MM_YYYY } from "@hooks/useDate"
import { IconSearch, IconTrash } from "@hooks/useIconos"
import { FileType, getArrayBuffer } from "@hooks/useUtils"
import { PrestamoPago } from "@interfaces/prestamos"
import { Button, Input, Space, Upload } from "antd"
import { useEffect, useState } from "react"
import { UploadFileExtension } from "src/tipos/globales"
import * as XLSX from 'xlsx'

type UploadButtonProps = {
    title: string;
    accept?: UploadFileExtension[];
    onChange?: (data: any) => void;
    onError?: (errors: string[]) => void;
};

export default function UploadButton(props: UploadButtonProps) {

    const { title, accept, onChange, onError } = props;
    const [file, setFile] = useState<FileType | undefined>(undefined);
    const [errors, setErrors] = useState<string[]>([]);

    const beforeUpload = (file: FileType) => {
        setFile(file);
        setErrors([]);
        if (file) {
            return validateFile(file);
        }
        return false;
    };

    const onRemoveFile = () => {
        setFile(undefined);
        setErrors([]);
        return true;
    }

    const validateFile = (file: FileType) => {

        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
        const isValid = !accept ? false : accept.filter(item => item === `.${extension}`).length > 0;
        if (!isValid) {
            onError?.([`Formato de archivo incorrecto. Solo se permiten archivos con estos formatos: ${accept?.join(',')}`]);
            return;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            console.log('El archivo sobrepasa el tamaño límite permitido de 2MB.');
            return true;
        }

    }

    const loadFile = async () => {

        if (!file) {
            setErrors(['No existe un archivo cargado para esta operación.']);
            return;
        }

        const buffer = await getArrayBuffer(file) as unknown as ArrayBuffer;
        if (!buffer) {
            setErrors(['No fue posible cargar el archivo.']);
            return;
        }

        const workbook = XLSX.read(buffer, { type: buffer ? "binary" : "array" });
        if (!workbook) {
            setErrors(['No fue posible leer el archivo.']);
            return;
        }
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            setErrors(['No fue posible leer la hoja del archivo.']);
            return;
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            setErrors(['No fue posible leer la hoja del archivo.']);
            return;
        }

        let jsonResult = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!jsonResult) {
            setErrors(['No fue posible leer los datos del archivo.']);
            return;
        }

        jsonResult = jsonResult.slice(3);
        if (jsonResult.length === 0) {
            setErrors(['No existen datos que procesar en el archivo.']);
            return;
        }

        const pagos: PrestamoPago[] = jsonResult.map((item: any) => {

            let [day, month, year] = item[2].split('-');
            day = day.length <= 1 ? '0'.concat(day) : day;
            month = month.length <= 1 ? '0'.concat(month) : month;

            let fecha = undefined;
            if (Number(month) <= 12) {
                const newDate = new Date(year, Number(month) - 1, Number(day));
                fecha = DD_MM_YYYY(newDate);
            }

            const monto = item[1] ? parseFloat(item[1].toString().replace(/,/g, '')) : 0;

            return {
                id: 0,
                prestamoId: 0,
                prestamoCuotaId: 0,
                metodoPago: undefined,
                empleadoId: item[0],
                monto: monto,
                fecha: fecha,
                anulado: false,
                usuario: undefined,
            } as PrestamoPago
        })
        onChange?.(pagos);
    }

    useEffect(() => { if (file) loadFile() }, [file])
    useEffect(() => { if (errors.length > 0) onError?.(errors) }, [errors])

    return (
        <Space.Compact style={{ width: '100%' }} block>
            <Upload
                accept={!accept ? '' : accept.map((item) => item).join(',')}
                maxCount={1}
                showUploadList={false}
                multiple={false}
                disabled={accept?.length === 0}
                beforeUpload={beforeUpload}
                onRemove={onRemoveFile}>
                <Button
                    icon={<IconSearch />}>
                    {title}
                </Button>
            </Upload >
            <Input readOnly value={file?.name} placeholder={!file ? "en espera..." : file.name} />
            <Button>
                <IconTrash color="red" onClick={() => {
                    setFile(undefined);
                    setErrors([]);
                }} />
            </Button>
        </Space.Compact>
    );
}