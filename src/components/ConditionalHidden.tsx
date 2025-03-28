import type { FC, PropsWithChildren } from "react";

export const ConditionHidden: FC<PropsWithChildren<{ id?: string, className?: string }>> = ({ id, children, className }) => {
    console.log(children);

    return <>
        {children}
    </>
}