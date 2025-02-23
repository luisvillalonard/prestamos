import { useIconos } from "@hooks/useIconos"
import { ControlProps } from '@interfaces/globales'
import type { InputProps, InputRef } from 'antd'
import { Input, Space, Tooltip } from "antd"
import { ChangeEvent, useEffect, useRef, useState } from "react"

const Searcher = (props: Omit<InputProps, "onChange"> & Pick<ControlProps, "onChange">) => {

    const { onChange } = props
    const inputRef = useRef<InputRef>(null)
    const [filter, setFilter] = useState<string>('')
    const { IconSearch } = useIconos()

    useEffect(() => { onChange && onChange(filter) }, [filter])

    return (
        <Space>
            <Tooltip title="Escriba para buscar, presione escape para limpiar la busqueda">
                <Input
                    {...props}
                    allowClear
                    placeholder="escriba aqui para buscar"
                    suffix={<IconSearch />}
                    ref={inputRef}
                    value={filter}
                    onKeyUp={(evt) => {
                        if (evt.code.toLowerCase() === 'escape') setFilter('')
                    }}
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => setFilter(evt.target.value)} />
            </Tooltip>
        </Space>
    )
}
export default Searcher;
