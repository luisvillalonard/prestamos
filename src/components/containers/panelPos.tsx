import { Card, CardProps } from "antd"

const PanelPos = (props: CardProps) => {

    const { title, children, style, styles } = props

    return (
        <Card
            size="small"
            title={title ? <div className="fs-6 h-auto">{title}</div> : null}
            style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#DDD', ...style }}
            styles={{
                title: {
                    height: 'auto',
                    padding: 0
                },
                body: {
                    position: 'relative',
                    overflowY: 'auto',
                    height: '100%',
                    padding: 6,
                },
                ...styles
            }}>
            {children}
        </Card>
    )
}
export default PanelPos
