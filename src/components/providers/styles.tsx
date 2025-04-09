import { Colors } from "@hooks/useConstants"
import { ConfigProvider } from "antd"
import { ControlProps } from "../../interfaces/globales"

const StyleProvider = (props: Pick<ControlProps, "children">) => {

    const { children } = props
    //const customColorPrimary = '#597ef7'
    //const gris51: string = '#515151'

    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorText: Colors.Gris51,
                    colorTextBase: Colors.Gris51,
                    colorTextHeading: Colors.Gris51,
                    colorTextSecondary: Colors.Gris51,
                    colorTextDisabled: Colors.Gris51,
                    colorTextPlaceholder: 'rgb(150,150,150)'

                    // Alias Token
                    //colorBgContainer: '#ffffff',
                },
                components: {
                    Input: {
                        colorBorder: Colors.Gris51,
                    },
                    InputNumber: {
                        colorBorder: Colors.Gris51,
                    },
                    DatePicker: {
                        colorBorder: Colors.Gris51,
                    },
                    Button: {
                        defaultBorderColor: Colors.Gris51,
                        colorBorderSecondary: Colors.Gris51,
                        colorSuccessBorderHover: Colors.Gris51,

                        defaultHoverBorderColor: Colors.Gris51,
                        defaultHoverColor: Colors.Gris51,
                    },
                    Select: {
                        colorBorder: Colors.Gris51,
                    },
                    Menu: {
                        itemMarginBlock: 0,
                        itemMarginInline: 0,
                        itemBorderRadius: 0,
                        iconSize: 26,
                        darkItemSelectedColor: '#fafafa',
                        collapsedIconSize: 26,
                        subMenuItemBorderRadius: 0,
                        subMenuItemSelectedColor: 'yellow',
                    },
                    Form: {
                        itemMarginBottom: 2,
                        verticalLabelMargin: 3,
                        verticalLabelPadding: 0,
                    },
                    Table: {
                        headerBg: '#EEEEEE',
                        headerColor: Colors.Gris51,
                    }
                }
            }}
        >
            {children}
        </ConfigProvider>
    )
}
export default StyleProvider
