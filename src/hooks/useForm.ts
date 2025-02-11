import { ChangeEvent, useState } from "react";

export function useForm<T>(initState: T) {

    const [entidad, setEntidad] = useState<T>(initState);

    const editar = (item: T) => {
        setEntidad(item)
    }

    const handleChangeInput = async ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { type, name, value } = target;

        let elementValue: string | boolean | number | null = value;

        switch (type) {
            case 'checkbox':
            case 'switch':
                elementValue = (target as HTMLInputElement).checked;
                break;

            case 'radio':
                elementValue = value.toLowerCase() === 'true';
                break;

            case 'number':
            case 'select-one':
                elementValue = Number(value);
                break;

            default:
                break;
        }

        setEntidad({
            ...entidad,
            [name]: elementValue
        })
    }

    return {
        entidad,
        editar,
        handleChangeInput,
    }

}