import { Urls } from '@hooks/useConstants'
import { useData } from '@hooks/useData'
import { useIconos } from '@hooks/useIconos'
import { MenuItem } from '@interfaces/globales'
import { Layout, Menu, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

export default function MenuApp() {

    const navUrl = useNavigate()
    const url = useLocation()
    const { contextAuth: { state: { viewMenu } } } = useData()
    const [items, setItems] = useState<MenuItem[] | undefined>(undefined)
    const [stateOpenKeys, setStateOpenKeys] = useState([''])
    const [current, setCurrent] = useState<string>(url.pathname.startsWith('/') ? url.pathname.slice(1, url.pathname.length) : url.pathname)
    const {
        IconClient, IconForm, IconListNumbered, IconReceiveMoney,
        IconUserShield, IconUsers, IconUserProfile, IconUserPermission,
        IconConfig, IconChecklist
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
        margin: 0,
    }

    const menuItems: MenuItem[] = [
        {
            menuid: 10,
            key: Urls.Clientes.Base,
            label: <span style={headerStyle}>Clientes</span>,
            icon: <IconClient style={iconHeaderStyle} />,
            children: [
                { menuid: 30, key: `${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, label: 'Formulario', icon: <IconForm style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, label: 'Clientes Registrados', icon: <IconListNumbered style={{ fontSize: 18 }} /> },
            ],
        },
        {
            menuid: 20,
            key: Urls.Prestamos.Base,
            label: <span style={headerStyle}>Prestamos</span>,
            icon: <IconChecklist style={iconHeaderStyle} />,
            children: [
                { menuid: 30, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario}`, label: 'Formulario de Prestamos', icon: <IconForm style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, label: 'Prestamos Registrados', icon: <IconListNumbered style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Cobro}`, label: 'Cobro de Prestamo', icon: <IconReceiveMoney style={{ fontSize: 18 }} /> },
            ],
        },
        {
            menuid: 30,
            key: Urls.DataMaestra.Base,
            label: <span style={headerStyle}>Data Maestra</span>,
            icon: <IconConfig style={iconHeaderStyle} />,
            children: [
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ciudades}`, label: 'Ciudades', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.DocumentosTipos}`, label: 'Tipos de Documentos', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.FormasPago}`, label: 'Formas de Pago', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.MetodosPago}`, label: 'Métodos de Pago', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Monedas}`, label: 'Tipo de Monedas', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ocupaciones}`, label: 'Ocupaciones', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.PrestamosEstados}`, label: 'Estados de Prestamos', icon: <IconConfig style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Acesores}`, label: 'Acesores', icon: <IconConfig style={{ fontSize: 18 }} /> },
            ],
        },
        {
            menuid: 40,
            key: Urls.Seguridad.Base,
            label: <span style={headerStyle}>Seguridad</span>,
            icon: <IconUserShield style={iconHeaderStyle} />,
            children: [
                { menuid: 30, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Roles}`, label: 'Perfiles de Usuarios', icon: <IconUserProfile style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Permisos}`, label: 'Permisos', icon: <IconUserPermission style={{ fontSize: 18 }} /> },
                { menuid: 30, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Usuarios}`, label: 'Usuarios', icon: <IconUsers style={{ fontSize: 18 }} /> },
            ],
        },
    ]

    const getLevelKeys = (items1: LevelKeysProps[]) => {
        const key: Record<string, number> = {};
        const func = (items2: LevelKeysProps[], level = 1) => {
            items2.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    }

    const levelKeys = getLevelKeys(menuItems as LevelKeysProps[]);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navUrl(e.key);
    }

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    }

    useEffect(() => {
        setItems(menuItems);
        const path = url.pathname.startsWith('/') ? url.pathname.slice(1, url.pathname.length) : url.pathname;
        const openKey = path.split('/')[0];
        setStateOpenKeys([openKey]);
    }, [url.pathname])

    /* if (!user) {
        return <></>
    } */

    return (
        <Sider
            width={250}
            trigger={null}
            collapsible
            collapsed={!viewMenu}
            style={siderStyle}>
            <Menu
                theme='dark'
                mode='inline'
                defaultSelectedKeys={[current]}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                onClick={onClick}
                items={items}
                style={{ height: '100%', borderRight: 0, overflow: 'auto' }}
            />
        </Sider>
    )

}