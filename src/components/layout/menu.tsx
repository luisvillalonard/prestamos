import { useConstants } from '@hooks/useConstants'
import { useIconos } from '@hooks/useIconos'
import { MenuItem } from '@interfaces/globales'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

export default function MenuApp() {

    const navUrl = useNavigate()
    const { Urls } = useConstants()
    const {
        IconChecklist, IconStore, IconPackage, IconMeasureUnit,
        IconClient,
        IconUserShield, IconUsers, IconUserProfile, IconUserPermission,
        IconConfig
    } = useIconos()
    const { Sider } = Layout
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100%',
    }
    const headerStyle: React.CSSProperties = {
        fontSize: 16,
        fontWeight: 'bolder',
    }
    const iconHeaderStyle: React.CSSProperties = {
        margin: 0
    }

    const items: MenuItem[] = [
        {
            key: `${uuidv4()}`,
            label: <span style={headerStyle}>Clientes</span>,
            icon: <IconClient style={iconHeaderStyle} />,
            children: [
                { key: `${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, label: 'Formulario de Registro', icon: <IconClient style={{ fontSize: 18 }} /> },
                { key: `${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, label: 'Historico', icon: <IconClient style={{ fontSize: 18 }} /> },
            ],
        },
        {
            key: `${uuidv4()}`,
            label: <span style={headerStyle}>Prestamos</span>,
            icon: <IconChecklist style={iconHeaderStyle} />,
            children: [
                { key: `${Urls.Prestamos.Base}`, label: 'Prestamos', icon: <IconStore style={{ fontSize: 18 }} /> },
                { key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, label: 'Prestamos Registrados', icon: <IconPackage style={{ fontSize: 18 }} /> },
                { key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Pagos}`, label: 'Pagos Realizados', icon: <IconMeasureUnit style={{ fontSize: 18 }} /> },
                { key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Pago}`, label: 'Nuevo Pago', icon: <IconMeasureUnit style={{ fontSize: 18 }} /> },
            ],
        },
        {
            key: `${uuidv4()}`,
            label: <span style={headerStyle}>Configuraciones</span>,
            icon: <IconConfig style={iconHeaderStyle} />,
            children: [
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ciudades}`, label: 'Ciudades', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.DocumentosTipos}`, label: 'Tipos de Documentos', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.FormasPago}`, label: 'Formas de Pago', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.MetodosPago}`, label: 'Métodos de Pago', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Monedas}`, label: 'Tipo de Monedas', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ocupaciones}`, label: 'Ocupaciones', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.PrestamosEstados}`, label: 'Estados de Prestamos', icon: <IconConfig style={{ fontSize: 18 }} /> },
            ],
        },
        {
            key: `${uuidv4()}`,
            label: <span style={headerStyle}>Seguridad</span>,
            icon: <IconUserShield style={iconHeaderStyle} />,
            children: [
                { key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Roles}`, label: 'Perfiles de Usuarios', icon: <IconUserProfile style={{ fontSize: 18 }} /> },
                { key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Permisos}`, label: 'Permisos', icon: <IconUserPermission style={{ fontSize: 18 }} /> },
                { key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Usuarios}`, label: 'Usuarios', icon: <IconUsers style={{ fontSize: 18 }} /> },
            ],
        },
    ]

    /* if (!user) {
        return <></>
    } */

    return (
        <Sider
            width={250}
            trigger={null}
            collapsible
            collapsed={false}
            style={siderStyle}>
            <Menu
                theme='dark'
                mode='inline'
                items={items}
                inlineCollapsed={false}
                style={{ height: '100%', borderRight: 0, overflow: 'auto' }}
                onClick={(e) => navUrl(e.key, { replace: true })}
            />
        </Sider>
    )

}