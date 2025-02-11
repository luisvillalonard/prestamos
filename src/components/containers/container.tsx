import { Card, CardProps, theme } from "antd"

const Container = (props: CardProps) => {

    const { token } = theme.useToken()

    return (
        <Card
            {...props}
            style={{
                position: 'relative',
                boxShadow: token.boxShadow,
                ...props.style
            }}
            styles={{
                header: {
                    padding: 10
                },
                body: {
                    padding: 10  
                }
            }}>
            {props.children}
        </Card>
    )
}
export default Container
