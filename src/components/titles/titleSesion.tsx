import { ControlProps } from "@interfaces/globales"
import { Typography, theme } from "antd"
import { TitleProps } from "antd/es/typography/Title"

export default function TitleSesion(props: Pick<ControlProps, "title"> & Pick<TitleProps, "color">) {
    
    const { title, color } = props
    const { token } = theme.useToken()
    const { Title } = Typography

    return (
        <Title level={3} style={{ fontWeight: 'bolder', marginBottom: 0, color: color ?? token.colorText }}>
            {title}
        </Title>
    )
}