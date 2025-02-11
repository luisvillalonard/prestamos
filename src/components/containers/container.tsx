import { Card, Flex, theme } from "antd"
import { ControlProps } from "../../interfaces/globales"

const Container = (props: Pick<ControlProps, Required<"children" | "title"> | "style">) => {

    const { children, title, style } = props
    const { token: { boxShadow }} = theme.useToken()
    const titleIsText = typeof title === "string"
    const headerStyle: React.CSSProperties = {
        paddingLeft:  10,
        paddingRight: 10,
        paddingTop: 14,
        paddingBottom: 24
    }

    return (
        <Card
            title={
                <Flex align="center" justify={titleIsText ? "start" : "space-between"} style={{ width: '100%' }}>
                    {titleIsText ? <div className="fs-4">{title}</div> : title}
                </Flex>
            }
            style={{
                margin: 18,
                position: 'relative',
                boxShadow: boxShadow,
                ...style
            }}
            styles={{
                header: headerStyle,
                body: {
                    padding: 0  
                }
            }}>
            {children}
        </Card>
    )
}
export default Container
