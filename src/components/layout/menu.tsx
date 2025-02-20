import { Urls } from '@hooks/useConstants'
import { useData } from '@hooks/useData'
import { MenuItem } from '@interfaces/globales'
import { Layout, Menu, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const headerStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 'bolder',
}

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

const menuItems: MenuItem[] = [
    {
        menuid: 10,
        key: Urls.Clientes.Base,
        label: <span style={headerStyle}>Clientes</span>,
        children: [
            { menuid: 11, key: `${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, label: 'Formulario' },
            { menuid: 12, key: `${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, label: 'Clientes Registrados' },
        ],
    },
    {
        menuid: 20,
        key: Urls.Prestamos.Base,
        label: <span style={headerStyle}>Prestamos</span>,
        children: [
            { menuid: 21, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario}`, label: 'Formulario de Prestamos' },
            { menuid: 22, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, label: 'Prestamos Registrados' },
            { menuid: 23, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Cobro}`, label: 'Cobro de Prestamo' },
        ],
    },
    {
        menuid: 30,
        key: Urls.DataMaestra.Base,
        label: <span style={headerStyle}>Data Maestra</span>,
        children: [
            { menuid: 31, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ciudades}`, label: 'Ciudades' },
            { menuid: 32, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.DocumentosTipos}`, label: 'Tipos de Documentos' },
            { menuid: 33, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.FormasPago}`, label: 'Formas de Pago' },
            { menuid: 34, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.MetodosPago}`, label: 'Métodos de Pago' },
            { menuid: 35, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Monedas}`, label: 'Tipo de Monedas' },
            { menuid: 36, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ocupaciones}`, label: 'Ocupaciones' },
            { menuid: 37, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.PrestamosEstados}`, label: 'Estados de Prestamos' },
            { menuid: 38, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Acesores}`, label: 'Acesores' },
        ],
    },
    {
        menuid: 40,
        key: Urls.Seguridad.Base,
        label: <span style={headerStyle}>Seguridad</span>,
        children: [
            { menuid: 41, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Roles}`, label: 'Perfiles de Usuarios' },
            { menuid: 42, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Permisos}`, label: 'Permisos' },
            { menuid: 43, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Usuarios}`, label: 'Usuarios' },
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

export default function MenuApp() {

    const url = useLocation()
    const { contextAuth: { state: { viewMenu } } } = useData()
    const [items, setItems] = useState<MenuItem[] | undefined>(undefined)
    const [stateOpenKeys, setStateOpenKeys] = useState([''])
    const [current, setCurrent] = useState<string>('')
    /*     const {
            IconClient, IconForm, IconListNumbered, IconReceiveMoney,
            IconUserShield, IconUsers, IconUserProfile, IconUserPermission,
            IconConfig, IconChecklist
        } = useIconos() */
    const nav = useNavigate()
    const { Sider } = Layout
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100%',
    }

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        nav(e.key, { replace: true });
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
        setCurrent(path);
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
                selectedKeys={[current]}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                onClick={onClick}
                items={items}
                style={{ height: '100%', borderRight: 0, overflow: 'auto' }}
            />
        </Sider>
    )

}