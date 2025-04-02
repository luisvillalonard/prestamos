import { ControlProps } from "@interfaces/globales"
import { Typography, theme } from "antd"
import { TitleProps } from "antd/es/typography/Title"

export default function TitlePanel(props: Pick<ControlProps, "title"> & Pick<TitleProps, "color">) {
    
    const { title, color } = props
    const { token } = theme.useToken()
    const { Title } = Typography

    return (
        <Title level={5} style={{ fontWeight: 400, marginBottom: 0, color: color ?? token.colorText }}>
            {title}
        </Title>
    )
}