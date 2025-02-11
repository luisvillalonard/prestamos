import { ConfigProvider } from "antd"
import { ControlProps } from "../../interfaces/globales"

const StyleProvider = (props: Pick<ControlProps, "children">) => {

    const { children } = props
    const customColorPrimary = '#597ef7'

    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: customColorPrimary,
                    colorText: '#515151',
                    colorTextBase: '#515151',
                    colorTextHeading: '#515151',
                    colorTextSecondary: '#515151',
                    colorTextPlaceholder: 'rgb(150,150,150)'

                    // Alias Token
                    //colorBgContainer: '#ffffff',
                },
                components: {
                    Menu: {
                        itemMarginBlock: 0,
                        itemMarginInline: 0,
                        itemBorderRadius: 0,
                        subMenuItemBorderRadius: 0,
                        iconSize: 26,
                        collapsedIconSize: 26,
                    },
                    Table: {
                        headerBg: '#EEE',
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
