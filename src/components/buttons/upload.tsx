import { FileData, loadExcel } from "@hooks/useFile"
import { IconSearch, IconTrash } from "@hooks/useIconos"
import { FileType } from "@hooks/useUtils"
import { Button, Input, Space, Upload } from "antd"
import { useState } from "react"
import { UploadFileExtension } from "src/tipos/globales"

type UploadButtonProps = {
    title: string;
    accept?: UploadFileExtension[];
    onChange?: (data: any) => void;
    onError?: (errors: string[]) => void;
};

export default function UploadButton(props: UploadButtonProps) {

    const { title, accept, onChange, onError } = props;
    const [file, setFile] = useState<FileData | undefined>(undefined);

    const beforeUpload = (file: FileType) => {

        if (file) {
            const valido = validateFile(file);
            if (valido) {
                loadFile(file);
            }
        }
        return false;

    };

    const onRemoveFile = () => {
        setFile(undefined);
        onChange?.(undefined);
        return true;
    }

    const validateFile = (file: FileType) => {

        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
        const isValid = !accept ? false : accept.filter(item => item === `.${extension}`).length > 0;
        if (!isValid) {
            onError?.([`Formato de archivo incorrecto. Solo se permiten archivos con estos formatos: ${accept?.join(',')}`]);
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            console.log('El archivo sobrepasa el tamaño límite permitido de 2MB.');
            return false;
        }

        return true;

    }

    const loadFile = async (file: FileType) => {

        /* if (!file) {
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
        } */

        if (!file) {
            onError?.(['No existe un archivo cargado para esta operación.']);
            return;
        }

        const result = await loadExcel(file);
        if (!result) {
            onError?.(['No fue posible leer los datos del archivo.']);
            return;
        }

        if (!result.ok) {
            onError?.(result.errors);
            return;
        }

        setFile(result);
        onChange?.(result);
    }

    return (
        <Space.Compact size="large" style={{ width: '100%' }} block>
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
                <IconTrash color="red" onClick={onRemoveFile} />
            </Button>
        </Space.Compact>
    );
}