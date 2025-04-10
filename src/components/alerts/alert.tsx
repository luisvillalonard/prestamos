import { Colors } from "@hooks/useConstants"
import { Alert } from "antd"

type AlertStaticProps = {
    errors: string[]
}
export default function AlertStatic(props: AlertStaticProps) {

    const { errors } = props

    return (
        <>
            {
                errors.length === 0
                    ? <></>
                    :
                    <Alert
                        type="warning"
                        closable={false}
                        showIcon
                        description={errors.length === 0 ? <></> : <ul className="m-0 ps-3">{errors.map((err, indexKey) => <li key={indexKey}>{err}</li>)}</ul>}
                        message={<h1 className="fs-5" style={{ color: Colors.Danger }}>Alerta</h1>}
                        className="mb-3"
                        style={{ borderLeftWidth: 6, borderLeftColor: Colors.Danger }}
                    />
            }
        </>
    )
}