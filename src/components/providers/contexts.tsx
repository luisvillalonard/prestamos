import { ControlProps } from "../../interfaces/globales";

type ProvidersType = [React.ElementType, Record<string, unknown>];
type ChildrenType = {
    children: Array<React.ElementType>;
};

export const ContextsProviders = (componentsWithProps: Array<ProvidersType>) => {

    const initialComponent = (props: Pick<ControlProps, "children">) => <>{props.children}</>

    return componentsWithProps.reduce(
        (
            AccumulatedComponents: React.ElementType,
            [Provider, props = {}]: ProvidersType
        ) => {
            return ({ children }: ChildrenType) => {
                return (
                    <AccumulatedComponents>
                        <Provider {...props}>{children}</Provider>
                    </AccumulatedComponents>
                )
            }
        },
        initialComponent
    )

}

