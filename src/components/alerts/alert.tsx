import { Colors } from "@hooks/useConstants"
import { Alert } from "antd"

type AlertStaticProps = {
    errors: string[],
    isAlert: boolean,
}
export default function AlertStatic(props: AlertStaticProps) {

    const { errors, isAlert } = props

    return (
        <>
            {
                errors.length === 0
                    ? <></>
                    :
                    <Alert
                        type={isAlert ? "warning" : "error"}
                        closable={false}
                        showIcon
                        description={errors.length === 0 ? <></> : <ul className="m-0 ps-3">{errors.map((err, indexKey) => <li key={indexKey}>{err}</li>)}</ul>}
                        message={<h1 className="fs-5" style={{ color: Colors.Danger }}>{isAlert ? "Alerta" : "Error"}</h1>}
                        className="mb-3"
                        style={{ borderLeftWidth: 6, borderLeftColor: Colors.Danger }}
                    />
            }
        </>
    )
}