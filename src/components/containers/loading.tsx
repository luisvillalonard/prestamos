import { Card, Flex, Space, Spin, SpinProps } from 'antd';
import { ControlProps } from '../../interfaces/globales';
import { useIconos } from '../../hooks/useIconos';

const Loading = (props: Pick<ControlProps, "active" | "message"> & Pick<SpinProps, "fullscreen">) => {

    const { active, message, fullscreen } = props
    const { IconLoading } = useIconos()
    const position = fullscreen ? 'fixed' : 'absolute'

    if (!active) {
        return <></>
    }

    return (
        <Flex align='center' justify='center'
            className={`position-${position} top-0 bottom-0 start-0 end-0 d-flex overflow-hidden`}
            style={{ zIndex: 1000, background: 'rgba(0,0,0,0.60)' }}>
            <Flex gap="middle" style={{ zIndex: 1001 }}>
                <Card>
                    <Flex vertical>
                        <Spin indicator={<IconLoading style={{ fontSize: 48 }} spin />} />
                        <Space style={{
                            fontSize: 18,
                            fontWeight: 'bolder'
                        }}>
                            {message || 'procesando, espere...'}
                        </Space>
                    </Flex>
                </Card>
            </Flex>
        </Flex>
    )
}
export default Loading;
