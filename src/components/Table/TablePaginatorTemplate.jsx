import React from "react";
import { Button } from "primereact/button";

const PaginatorTemplate = {
    layout: "FirstPageLink PrevPageLink PageLinks NextPageLink",
    FirstPageLink: (options) => {
        return (
            <>
                <Button
                    type="button"
                    icon="pi pi-angle-double-right"
                    className={options.className}
                    onClick={options.onClick}
                />
            </>
        );
    },
    PrevPageLink: (options) => {
        return (
            <>
                <Button
                    type="button"
                    icon="pi pi-angle-right"
                    className={options.className}
                    onClick={options.onClick}
                />
            </>
        );
    },
    NextPageLink: (options) => {
        return (
            <>
                <Button type="button" icon="pi pi-angle-left" className={options.className} onClick={options.onClick} />
            </>
        );
    },
};

export default PaginatorTemplate;
