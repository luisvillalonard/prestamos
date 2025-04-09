import { Urls } from '@hooks/useConstants'
import { useData } from '@hooks/useData'
import { IconClient, IconConfig, IconForm, IconListNumbered, IconListPoint, IconLoans, IconReceiveMoney, IconUser, IconUserPermission, IconUserShield } from '@hooks/useIconos'
import { MenuItem } from '@interfaces/seguridad'
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

export const menuItems: MenuItem[] = [
    {
        menuid: 10,
        key: Urls.Clientes.Base,
        label: <span style={headerStyle}>Clientes</span>,
        icon: <IconClient />,
        children: [
            { menuid: 11, key: `${Urls.Clientes.Base}/${Urls.Clientes.Formulario}`, label: 'Formulario', icon: <IconForm /> },
            { menuid: 12, key: `${Urls.Clientes.Base}/${Urls.Clientes.Historico}`, label: 'Clientes Registrados', icon: <IconListNumbered /> },
        ],
    },
    {
        menuid: 20,
        key: Urls.Prestamos.Base,
        label: <span style={headerStyle}>Prestamos</span>,
        icon: <IconLoans />,
        children: [
            { menuid: 21, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Formulario}`, label: 'Formulario de Prestamos', icon: <IconForm /> },
            { menuid: 22, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Registrados}`, label: 'Prestamos Registrados', icon: <IconListNumbered /> },
            { menuid: 23, key: `${Urls.Prestamos.Base}/${Urls.Prestamos.Cobro.replace(':id?', '')}`, label: 'Cobro de Prestamo', icon: <IconReceiveMoney /> },
        ],
    },
    {
        menuid: 30,
        key: Urls.DataMaestra.Base,
        label: <span style={headerStyle}>Data Maestra</span>,
        icon: <IconListPoint />,
        children: [
            { menuid: 31, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ciudades}`, label: 'Ciudades', icon: <IconListPoint /> },
            { menuid: 32, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.DocumentosTipos}`, label: 'Tipos de Documentos', icon: <IconListPoint /> },
            { menuid: 33, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.FormasPago}`, label: 'Formas de Pago', icon: <IconListPoint /> },
            { menuid: 34, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.MetodosPago}`, label: 'Métodos de Pago', icon: <IconListPoint /> },
            { menuid: 35, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Monedas}`, label: 'Tipo de Monedas', icon: <IconListPoint /> },
            { menuid: 36, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Ocupaciones}`, label: 'Ocupaciones', icon: <IconListPoint /> },
            { menuid: 37, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.PrestamosEstados}`, label: 'Estados de Prestamos', icon: <IconListPoint /> },
            { menuid: 38, key: `${Urls.DataMaestra.Base}/${Urls.DataMaestra.Acesores}`, label: 'Acesores', icon: <IconListPoint /> },
        ],
    },
    {
        menuid: 40,
        key: Urls.Seguridad.Base,
        label: <span style={headerStyle}>Seguridad</span>,
        icon: <IconUserPermission />,
        children: [
            { menuid: 41, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Permisos}`, label: 'Roles y Permisos', icon: <IconUserShield /> },
            { menuid: 42, key: `${Urls.Seguridad.Base}/${Urls.Seguridad.Usuarios}`, label: 'Usuarios', icon: <IconUser /> },
        ],
    },
    {
        menuid: 50,
        key: Urls.Configuraciones.Base,
        label: <span style={headerStyle}>Configuraciones</span>,
        icon: <IconConfig />,
        children: [
            { menuid: 51, key: `${Urls.Configuraciones.Base}/${Urls.Configuraciones.Generales}`, label: 'Generales', icon: <IconConfig /> },
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
    const {
        contextAuth: { state: { user, viewMenu } },
        contextPermisos: { state: { procesando } },
    } = useData()
    const [items, setItems] = useState<MenuItem[] | undefined>(undefined)
    const [stateOpenKeys, setStateOpenKeys] = useState([''])
    const [current, setCurrent] = useState<string>('')
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
        if (user && user.rol) {
            const permissions = menuItems.reduce((acc: MenuItem[], parent: MenuItem) => {

                let children: MenuItem[] = [];
                parent.children?.forEach(child => {
                    if (user.rol?.permisos.filter(perm => perm.menuId === child.menuid).shift()) {
                        children.push(child);
                    }
                })
                acc.push({ ...parent, children: children });
                return acc;
            }, []);
            setItems(permissions.filter(opt => opt.children && opt.children.length > 0));
        }
    }, [user])

    useEffect(() => {
        const path = url.pathname.startsWith('/') ? url.pathname.slice(1, url.pathname.length) : url.pathname;
        const openKey = path.split('/')[0];
        setStateOpenKeys([openKey]);
        setCurrent(path);
    }, [url.pathname])

    if (!user || !user.rol || user.rol.permisos.length === 0) {
        return <></>
    }

    return (
        <Sider
            width={250}
            trigger={null}
            collapsible
            collapsed={!viewMenu}
            style={siderStyle}>
            {
                procesando
                    ? <span>Cargando...</span>
                    :
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
            }
        </Sider>
    )

}