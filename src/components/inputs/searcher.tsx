import type { InputProps, InputRef } from 'antd'
import { Input, Space, Tooltip } from "antd"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useIconos } from "@hooks/useIconos"
import { ControlProps } from '@interfaces/globales'

const Searcher = (props: Omit<InputProps, "onChange"> & Pick<ControlProps, "onChange">) => {

    const { onChange } = props
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
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
                    style={{
                        ...props.style,
                        /* borderRadius: 0, 
                        borderBottomWidth: 1, 
                        borderBottomStyle: 'solid', */
                    }}
                    onKeyUp={(evt) => {
                        if (evt.code.toLowerCase() === 'escape') setFilter('')
                    }}
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => {

                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                        }

                        timeoutRef.current = setTimeout(() => {
                            setFilter(evt.target.value)
                        }, evt.target.value.length === 0 ? 100 : 600)

                    }} />
            </Tooltip>
        </Space>
    )
}
export default Searcher;
