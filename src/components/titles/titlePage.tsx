import { ControlProps } from "@interfaces/globales"
import { Typography, theme } from "antd"

export default function TitlePage(props: Pick<ControlProps, "title">) {
    
    const { title } = props
    const { token } = theme.useToken()
    const { Title } = Typography

    return (
        <Title level={2} style={{ fontWeight: 'bolder', marginBottom: 0, color: token.colorText }}>
            {title}
        </Title>
    )
}