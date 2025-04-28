import { ControlProps } from "@interfaces/globales"
import { Typography } from "antd"

export default function LabelInfo(props: Pick<ControlProps, "children" | "style">) {

    const { children, style } = props

    return (
        <Typography.Text
            style={{ fontWeight: 500, ...style }}>
            {children}
        </Typography.Text>
    )
}