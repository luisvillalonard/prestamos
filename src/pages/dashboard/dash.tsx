import CardViewTotal from "@components/cards/viewTotal";
import TitlePage from "@components/titles/titlePage";
import TitleSesion from "@components/titles/titleSesion";
import { Colors } from "@hooks/useConstants";
import { Card, Col, Divider, Row } from "antd";
import ChartHorizontalBar from "./chartHorizontalBar";

export default function PageDashboard() {
    return (
        <Col span={18} offset={3}>
            <TitlePage title="Dashboard" />
            <Divider style={{ borderColor: Colors.Gris51 }} className='my-3' />

            <TitleSesion title="Prestamos" color={Colors.Primary} />
            <Row gutter={[20, 30]}>
                <Col md={8} sm={24} xs={24}>
                    <CardViewTotal title="Activos" value="21" color={Colors.Primary} />
                </Col>
                <Col md={8} sm={24} xs={24}>
                    <CardViewTotal title="Monto Totales RD$" value="2,190,600" color={Colors.Success} />
                </Col>
                <Col md={8} sm={24} xs={24}>
                    <CardViewTotal title="Monto Pendiente RD$" value="1,850,400" color={Colors.Danger} />
                </Col>
                <Col xl={12} lg={24} md={24} xs={24}>
                    <Card size="small" title="Mayores Montos Activos" style={{ width: '100%', height: '100%', maxHeight: '250px' }}>
                        <ChartHorizontalBar />
                    </Card>
                </Col>
            </Row>

        </Col>
    )
}