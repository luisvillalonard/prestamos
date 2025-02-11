import { ConfigProvider } from "antd"
import { ControlProps } from "../../interfaces/globales"

const StyleProvider = (props: Pick<ControlProps, "children">) => {

    const { children } = props
    //const customColorPrimary = '#597ef7'
    const gris51: string = '#515151'

    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorText: gris51,
                    colorTextBase: gris51,
                    colorTextHeading: gris51,
                    colorTextSecondary: gris51,
                    colorTextPlaceholder: 'rgb(150,150,150)'

                    // Alias Token
                    //colorBgContainer: '#ffffff',
                },
                components: {
                    Input: {
                        colorBorder: gris51
                    },
                    Button: {
                        defaultBorderColor: gris51,
                        colorBorderSecondary: gris51,
                        colorSuccessBorderHover: gris51,

                        defaultHoverBorderColor: gris51,
                        defaultHoverColor: gris51,
                    },
                    Menu: {
                        itemMarginBlock: 0,
                        itemMarginInline: 0,
                        itemBorderRadius: 0,
                        subMenuItemBorderRadius: 0,
                        iconSize: 26,
                        collapsedIconSize: 26,
                    },
                    Table: {
                        headerBg: '#ffffff',
                        headerBorderRadius: 0,
                    }
                }
            }}
        >
            {children}
        </ConfigProvider>
    )
}
export default StyleProvider
