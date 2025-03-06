/** CSS */
import './App.css'

/* IMPORTS */
import HeaderApp from '@components/layout/header'
import MenuApp from '@components/layout/menu'
import RutasApp from '@components/layout/rutas'
import UserInfoNotification from '@components/layout/userInfo'
import { useData } from '@hooks/useData'
import PageLogin from '@pages/seguridad/login/page'
import { Layout, theme } from 'antd'
import { useEffect } from 'react'

export default function App() {

  const { contextAuth: { state: { user, viewInfoUser }, getUserApp } } = useData()
  const { Content } = Layout
  const { token } = theme.useToken()

  useEffect(() => {
    getUserApp();
  }, [])

  if (!user) {
    return <PageLogin />
  }

  return (
    <Layout className='h-100'>
      <HeaderApp />
      <Layout style={{ backgroundColor: token.colorBgContainer }}>
        <UserInfoNotification isOpen={viewInfoUser} />
        <MenuApp />
        <Content className='p-4 position-relative overflow-auto'>
          <RutasApp />
        </Content>
      </Layout>
    </Layout>
  )
}


/*
import { useState } from "react"
import { TabsProps } from "antd"
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { RcFile } from "antd/es/upload"
import { getArrayBuffer, getNumber, IsNullOrUndefined } from "./useUtils"
import { Core } from "../interfaces/cores"
import { Country, Material, Scenerio, ScenerioCountry } from "../interfaces/masterdata"
import { Zbb } from "../interfaces/zbb"
import { useData } from "./useData"
import { MonthEnums } from "../enums/global"
import { LoaderExcelProps, Month, ResponseResult } from "../interfaces/global"
import { Colors } from "./useConstants"

export function useFile() {

    const {
        contextAuth: { state: { user } },
        contextSceneriosCountries: { state: { data: allSceneriosCountries }, getAllEntity: getAllSceneriosCountries },
        contextCurrencies: { state: { data: currencies }, getAllEntity: getAllCurrencies },
        contextCoreMasterData: { state: { data: coreMasterData }, getAllEntity: getAllMasterDataCore },
        contextZbbMasterDataCeco: { state: { data: zbbMasterDataCeco }, getAllEntity: getAllMasterDataCecos },
        contextZbbMasterDataGcoa: { state: { data: zbbMasterDataGcoa }, getAllEntity: getAllMasterDataGcoas },
    } = useData()

    const [isProjection, setIsProjection] = useState<boolean>(false)
    const [scenerioCountries, setScenerioCountries] = useState<ScenerioCountry[]>([])
    const [scenerio, setScenerio] = useState<Scenerio | null>(null)
    const [countries, setCountries] = useState<Country[]>([])
    const [months, setMonths] = useState<Month[]>([])
    const allMonth = Object.entries(MonthEnums).map(([value], index) => ({ key: index + 1, value: value }))

    const [file, setFile] = useState<RcFile | null>(null)
    const [processing, setProcessing] = useState<boolean>(false)
    const fileType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';
    type ColDataType = number | string

    const loadAuxiliars = async ({ isCore, isProjection }: LoaderExcelProps) => {

        const promises = [getAllCurrencies(), getAllSceneriosCountries()];

        setProcessing(true);
        if (isCore) {
            promises.push(getAllMasterDataCore());
        } else {
            promises.push(getAllMasterDataCecos());
            promises.push(getAllMasterDataGcoas());
        }

        await Promise.all(promises).then(() => {

            // Establezco si los datos son de projección
            setIsProjection(isProjection);

            // Establezco los paises de negocio que tiene el usuario asignado
            if (user && user.countryBusiness) {
                changeCountries(user.countryBusiness.map(item => item.country!) ?? []);
            }

            // Termino la carga
            setProcessing(false);
        });
    }

    const changeCountries = (items: Country[]) => setCountries(items); // Establezco los paises asignados al usuario

    const changeScenerio = (scenerio: Scenerio) => {

        if (!allSceneriosCountries || allSceneriosCountries.length === 0) return;

        // Establezco el escenario a trabajar
        setScenerio(scenerio);

        // Establezco las configuraciones de los escenario para estos paises y el escenario seleccionado
        const arrSceneriosCountries = allSceneriosCountries.filter(item => countries.map(item => item.countryId).some(value => value === item.countryId) && item.scenerioId >= scenerio.scenerioId);
        setScenerioCountries(arrSceneriosCountries);

        // Obtengo todos los meses a partir del mes del escenario
        const scenerioMonths = arrSceneriosCountries.reduce((acc: number[], item: ScenerioCountry) => {
            if (!acc.filter(month => month === Number(item.month))[0]) {
                acc.push(Number(item.month))
            }
            return acc
        }, [])

        // Establezco los meses a considerar para la subida del archivo
        isProjection
            ? setMonths(allMonth.filter(month => scenerioMonths.some(sm => sm === month.key))) // Todos los meses a partir del escenario
            : setMonths(allMonth.filter(month => month.key === scenerioMonths[0])) // El mes del escenario

        // Inicializo el archivo
        setFile(null);

    }

    const onBeforeUpload = async (file: RcFile) => {

        setProcessing(true);
        setFile(file);
        setProcessing(false);
        return false;
    }

    const onRemoveFile = () => {
        setFile(null);
    }

    const getData = async (): Promise<ResponseResult<ColDataType[]>> => {

        let result: ResponseResult<ColDataType[]> = { success: false } as ResponseResult<ColDataType[]>;

        if (!file) {
            result.message = "Debe cargar un archivo de excel para realizar esta operación.";
            return result;
        }

        let buffer = await getArrayBuffer(file);
        if (!buffer) {
            result.message = 'El archivo de excel es inválido o no tiene registros que procesar.';
            return result;
        }

        const workbook = XLSX.read(buffer, { type: 'binary' });
        if (!workbook) {
            result.message = "El archivo de excel no tiene hojas de datos disponibles.";
            return result;
        }

        const sheets: TabsProps["items"] = workbook.SheetNames.map((sheet, index) => ({ key: index.toString(), label: sheet }));
        if (!sheets || sheets.length === 0) {
            result.message = "El archivo de excel no tiene hojas de datos disponibles.";
            return result;
        } else if (sheets.length > 1) {
            result.message = "El archivo de excel tiene mas de una hoja de datos. Debe tener una sola con el formato y cantidad de columnas establecidos (consultar la plantilla)";
            return result;
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonResult = XLSX.utils.sheet_to_json<ColDataType>(sheet, { header: 1 });
        jsonResult = jsonResult.slice(1, jsonResult.length);

        result.data = jsonResult;
        result.success = true;
        return result;

    }

    const getWeight = (blob: Blob): string => {

        let size = blob.size / 1024;
        if (size < 1024) {
            return `${(blob.size / 1024).toFixed(2)} KB`;
        } else if (size >= 1024)
            return `${(blob.size / 1024 / 1024).toFixed(2)} KB`;
        return '0 MB';
    }

    const getCols = (item: unknown) => item as unknown as ColDataType[];

    const getZbbs = async (): Promise<ResponseResult<Zbb[]>> => {

        let result: ResponseResult<Zbb[]> = { success: false } as ResponseResult<Zbb[]>;
        let data: ColDataType[] = [];

        setProcessing(true);

        const resp = await getData();
        if (!resp) {
            setProcessing(false);
            return { ...result, message: "No fue posible obtener los datos del archivo de excel." };

        } else if (!resp.success) {
            setProcessing(false);
            return { ...result, message: resp.message };

        } else if (resp.success && resp.data) {
            data = getCols(resp.data);
        }

        if (data.length === 0) {
            setProcessing(false);
            return { ...result, message: 'El archivo no tiene filas que procesar.' };
        }

        const currenciesCountries = currencies.filter(item => countries.some(country => item.country?.isOperational && country.countryId));
        const notCurrencies = countries.filter(item => !currenciesCountries.map(country => country.countryId === item.countryId));
        if (notCurrencies.length) {
            result.success = false;
            result.message = `No existe configurada una moneda para estos paises (${notCurrencies.map(item => item?.name).join(', ')}).`;
            setProcessing(false);
            return result;
        }

        let zbbs = data
            .map((item) => getZbbRow(item))
            .filter(item => item) as Zbb[];

        // Filtro la data de los paises de negocio asignados al usuario y los mes según el escenario
        result.data = zbbs.filter(item => item.isValid);

        // Retorno la data valida
        result.success = true;
        setProcessing(false);
        return result;

    }

    const getZbbRow = (row: unknown): Zbb | null => {

        const cols = getCols(row);
        if (cols.length === 0) return null;

        // Establezco el CECO
        const cecoId = (cols[0] ?? '').toString();
        const ceco = zbbMasterDataCeco.filter((item => item.costCenterCode.toLowerCase() === cecoId.toLowerCase()))[0];

        // Establezco el GCOA
        const gcoaId = typeof cols[1] === 'number' ? cols[1].toString() : cols[1];
        const gcoa = zbbMasterDataGcoa.filter((item => item.gcoa?.toLowerCase() === gcoaId.toLowerCase()))[0];
        
        // Establezco la configuracion de Escenario y Pais, según el escenario, mes y pais del archivo
        const scenerioCountry = scenerioCountries?.filter(item => item.country?.countryId === ceco?.countryId)[0];
        const currency = currencies.filter(item => item.country && item.country.countryId === ceco?.countryId)[0];

        return {
            scenerioCountryId: scenerioCountry?.scenerioCountryId,
            scenerio: scenerio,
            countryId: ceco?.countryId,
            country: scenerioCountry?.country,
            masterCecossId: ceco?.masterCecossId,
            masterCecos: ceco,
            masterGcoaid: gcoa?.masterGcoaId,
            masterGcoa: gcoa,
            jan: getNumber(cols[2]),
            feb: getNumber(cols[3]),
            mar: getNumber(cols[4]),
            apr: getNumber(cols[5]),
            may: getNumber(cols[6]),
            jun: getNumber(cols[7]),
            jul: getNumber(cols[8]),
            aug: getNumber(cols[9]),
            sep: getNumber(cols[10]),
            oct: getNumber(cols[11]),
            nov: getNumber(cols[12]),
            dec: getNumber(cols[13]),
            currencyRate: currency ? currency.rate : 0,
            exists: ceco?.masterCecossId > 0 && gcoa?.masterGcoaId > 0 ? true : false,
            isValid: !IsNullOrUndefined(scenerioCountry) && !IsNullOrUndefined(ceco) && !IsNullOrUndefined(gcoa)
        } as Zbb;
    }

    const getCores = async (): Promise<ResponseResult<Core[]>> => {

        let result: ResponseResult<Core[]> = { success: false } as ResponseResult<Core[]>;
        let data: ColDataType[] = [];

        setProcessing(true);

        const resp = await getData();
        if (!resp) {
            setProcessing(false);
            return { ...result, message: "No fue posible obtener los datos del archivo de excel." };

        } else if (!resp.success) {
            setProcessing(false);
            return { ...result, message: resp.message };

        } else if (resp.success && resp.data) {
            data = getCols(resp.data);
        }

        if (data.length === 0) {
            setProcessing(false);
            return { ...result, message: 'El archivo no tiene filas que procesar.' };
        }

        const currenciesCountries = currencies.filter(item => countries.some(country => item.country?.isOperational && country.countryId));
        const notCurrencies = countries.filter(item => !currenciesCountries.map(country => country.countryId === item.countryId));
        if (notCurrencies.length) {
            result.success = false;
            result.message = `No existe configurada una moneda para estos paises (${notCurrencies.map(item => item?.name).join(', ')}).`;
            setProcessing(false);
            return result;
        }

        const cores = data
            .map((item) => {
                let row = getCoreRow(item);
                if (row) {

                    // Establezco si existe el SKU del material
                    row.exists = row.material?.materialId && row.material.materialId > 0 ? true : false;

                    // Establezco si los datos del volumen son validos
                    if (row.volHi === 0) {
                        row.isValid = true;
                    } else if (row.volHi >= 0 && row.gsilc >= 0 && (row.discLc <= 0 && row.excLc <= 0 && row.viclc <= 0 && row.vlclc <= 0 && row.saleslc <= 0 && row.marketinglc <= 0)) {
                        row.isValid = true;
                    } else if (row.volHi <= 0 && row.gsilc <= 0 && (row.discLc >= 0 && row.excLc >= 0 && row.viclc >= 0 && row.vlclc >= 0 && row.saleslc >= 0 && row.marketinglc >= 0)) {
                        row.isValid = true;
                    } else {
                        row.isValid = false;
                    }
                }

                // Retorno el registro
                return row;
            })
            .filter(item => item) as Core[];

        // Filtro la data de los paises de negocio asignados al usuario y los mes según el escenario
        result.data = cores.filter(item => item.month);

        // Retorno la data valida
        result.success = true;
        setProcessing(false);
        return result;

    }

    const getCoreRow = (row: unknown): Core | null => {

        const cols = getCols(row);
        if (cols.length === 0) return null;

        // Establezco el SKUID del material de la fila actual
        const skuid = typeof cols[5] === 'number' ? cols[5].toString() : cols[5];

        // Establezco el mes de la fila actual
        const month = months.filter(item => item.value.toLowerCase() === (cols[1] ? cols[1].toString() : '').toLowerCase())[0];

        // Establezco la configuracion de Escenario y Pais, según el escenario, mes y pais del archivo
        const scenerioCountry = scenerioCountries.filter(item => {

            const isScenerio = item.scenerio?.structure?.toLowerCase() === cols[0]?.toString().trim().toLowerCase();
            const isMonth = !month ? false : Number(item.month) === month.key;
            const isCountry = item.country?.name?.toLowerCase() === cols[2]?.toString().trim().toLowerCase();
            if (isProjection) {
                return isMonth && isCountry;
            }
            return isScenerio && isMonth && isCountry;

        })[0];
        /* if (scenerioCountry && month) {
            scenerioCountry.month = month.key.toString();
        } */

        // Busco el material configurado para el pais de negocio y SKU
        const masterData = coreMasterData.filter(mat => mat.material?.skuid.toLowerCase() === skuid.toString().toLowerCase() && mat.businessCountryId === scenerioCountry?.country?.countryId)[0];

        // Establezco el material
        const material = masterData?.material ?? { skuid: skuid } as Material;

        // Establezco la moneda según el pais de negocio
        const currency = !scenerioCountry?.country ? null : currencies.filter(item => item.country && item.country.countryId === scenerioCountry.country?.countryId)[0];

        // Retorno los datos
        return {
            scenerioCountryId: scenerioCountry?.scenerioCountryId,
            scenerio: scenerio,
            month: month?.value,
            country: scenerioCountry?.country,
            countryId: scenerioCountry?.country?.countryId,
            material: material,
            newCanal: cols[3],
            newSellsRegion: cols[4],
            skuid: skuid,
            volHi: getNumber(cols[6]),
            gsilc: getNumber(cols[7]),
            discLc: getNumber(cols[8]),
            excLc: getNumber(cols[9]),
            viclc: getNumber(cols[10]),
            vlclc: getNumber(cols[11]),
            saleslc: getNumber(cols[12]),
            baddebtlc: getNumber(cols[13]),
            marketinglc: getNumber(cols[14]),
            currencyRate: currency ? currency.rate : 0,
        } as Core;
    }

    const exportCoreToExcel = (rows: Core[]) => {

        const data = rows.map(item => ({
            col1: item.volumeId === 0 ? "Proyección" : item.volumeId > 0 ? "Real" : "",
            col2: item.scenerio?.structure,
            col3: Object.entries(MonthEnums)
                .map(([value], index) => ({ key: index + 1, value: value }))
                .filter(opt => opt.key === Number(item.month))[0]?.value ?? '',
            col4: item.country?.name,
            col5: item.newCanal,
            col6: item.newSellsRegion,
            col7: item.material?.skuid ?? '',
            col8: getNumber(item.volHi),
            col9: getNumber(item.gsilc),
            col10: getNumber(item.discLc),
            col11: getNumber(item.excLc),
            col12: getNumber(item.viclc),
            col13: getNumber(item.vlclc),
            col14: getNumber(item.saleslc),
            col15: getNumber(item.baddebtlc),
            col16: getNumber(item.marketinglc),
        }));

        const headers = [
            "Proyección/Real",
            "Escenario",
            "Mes", "País",
            "Canal New",
            "Region Ventas New",
            "SKU ID",
            "Vol (Hl)",
            "GSI (LC)",
            "Disc (LC)",
            "Exc (LC)",
            "VIC (LC)",
            "VLC (LC)",
            "SALES (LC)",
            "BAD DEBT (LC)",
            "MARKETING (LC)",
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("CORES");
        sheet.properties = { ...sheet.properties, defaultRowHeight: 18, defaultColWidth: 18 };

        sheet.columns = headers.map((headerKey, headerPos) => {
            return {
                header: headerKey,
                key: `col${headerPos + 1}`
            }
        });

        sheet.addRows(data);
        sheet.eachRow((row, rowPos) => {
            row.eachCell((cell, cellPos) => {
                if (rowPos === 1) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D0D0D0' } };
                    cell.font = { bold: true };
                }
                if (rowPos > 1) {
                    if (cellPos === 1) {
                        cell.font = { bold: true, color: { argb: cell.text === 'Proyección' ? Colors.Orange.replace('#', '') : Colors.Green.replace('#', '') } }
                    } else if (cellPos >= 8) {
                        cell.font = { color: { argb: Number(cell.text) < 0 ? Colors.Danger.replace('#', '') : '' } }
                    }
                }
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            })
        })

        workbook.xlsx.writeBuffer()
            .then(data => {
                const blob = new Blob([data], {
                    type: fileType
                })
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'CORES.xlsx';
                anchor.click();
                window.URL.revokeObjectURL(url);
            });

    }

    const exportZbbToExcel = (rows: Zbb[]) => {

        const data = rows.map(item => ({
            col1: item.masterCecos?.costCenterCode,
            col2: item.masterGcoa?.gcoa,
            col3: item.country?.name,
            col4: item.jan,
            col5: item.feb,
            col6: item.mar,
            col7: item.apr,
            col8: item.may,
            col9: item.jun,
            col10: item.jul,
            col11: item.aug,
            col12: item.sep,
            col13: item.oct,
            col14: item.nov,
            col15: item.dec,
        }));

        const headers = [
            "CECO",
            "GECA",
            "País",
            MonthEnums.January,
            MonthEnums.February,
            MonthEnums.March,
            MonthEnums.April,
            MonthEnums.May,
            MonthEnums.June,
            MonthEnums.July,
            MonthEnums.August,
            MonthEnums.September,
            MonthEnums.October,
            MonthEnums.November,
            MonthEnums.December,
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("ZBBS");
        sheet.properties = { ...sheet.properties, defaultRowHeight: 18, defaultColWidth: 18 };

        sheet.columns = headers.map((headerKey, headerPos) => {
            return {
                header: headerKey,
                key: `col${headerPos + 1}`
            }
        });

        sheet.addRows(data);
        sheet.eachRow((row, rowPos) => {
            row.eachCell((cell, cellPos) => {
                if (rowPos === 1) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D0D0D0' } };
                    cell.font = { bold: true };
                }
                if (rowPos > 1) {
                    if (cellPos >= 8) {
                        cell.font = { color: { argb: Number(cell.text) < 0 ? Colors.Danger.replace('#', '') : '' } }
                    }
                }
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            })
        })

        workbook.xlsx.writeBuffer()
            .then(data => {
                const blob = new Blob([data], {
                    type: fileType
                })
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'ZBBS.xlsx';
                anchor.click();
                window.URL.revokeObjectURL(url);
            });

    }

    return {
        scenerioCountries,
        scenerio,
        countries,
        processing,
        file,

        changeCountries,
        changeScenerio,
        onBeforeUpload,
        onRemoveFile,
        getWeight,

        getCores,
        getZbbs,

        loadAuxiliars,
        exportCoreToExcel,
        exportZbbToExcel,
    }

}
*/
