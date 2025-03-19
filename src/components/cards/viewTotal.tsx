import { Colors } from "@hooks/useConstants";
import { Card, Flex } from "antd";

const cardStyle: React.CSSProperties = {
    height: '100%',
    maxHeight: '250px',
    borderBottomColor: Colors.Primary,
    borderBottomWidth: 4,
    borderRadius: 4,
}

type CardViewTotalProps = {
    title: string,
    value: string,
    color: string,
}

export default function CardViewTotal(props: CardViewTotalProps) {

    const { title, value, color } = props

    return (
        <Card
            size="small"
            title={null}
            style={{ ...cardStyle, borderBottomColor: color ?? Colors.Secondary }}
            styles={{
                body: { paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6, }
            }}>
            <Flex vertical>
                <span style={{ fontWeight: 'bolder', color: 'rgba(100,100,100,0.7)' }}>{title ?? 'Titulo'}</span>
                <span style={{ fontWeight: 'bold', fontSize: 24, color: Colors.Gris51 }}>{value ?? ''}</span>
            </Flex>
        </Card>
    )
}