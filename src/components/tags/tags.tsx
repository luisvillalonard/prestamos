import { Colors } from "@hooks/useConstants"
import { Tag } from "antd";

type CustomTagProps = {
    text: string
}
const tagStyle: React.CSSProperties = {
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 'bolder',
}

export function TagDefault(props: CustomTagProps) {
    return (<Tag style={tagStyle}>{props.text}</Tag>)
}

export function TagPrimary(props: CustomTagProps) {
    return (<Tag color={Colors.Primary} style={tagStyle}>{props.text}</Tag>)
}

export function TagSecondary(props: CustomTagProps) {
    return (<Tag color={Colors.Secondary} style={tagStyle}>{props.text}</Tag>)
}

export function TagSuccess(props: CustomTagProps) {
    return (<Tag color={Colors.Success} style={tagStyle}>{props.text}</Tag>)
}

export function TagDanger(props: CustomTagProps) {
    return (<Tag color={Colors.Danger} style={tagStyle}>{props.text}</Tag>)
}