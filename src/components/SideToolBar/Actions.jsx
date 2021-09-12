import React, { useEffect, useState, useRef, useMemo, createRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import CreateRoleForm from '../Modals/CreateRoleForm';
import CreateOGForm from '../Modals/CreateOGForm';
import RenameOGForm from '../Modals/RenameOGForm';
import AssignRoleToEntityForm from '../Modals/AssignRoleToEntityForm';
import CreateEntityForm from '../Modals/CreateEntityForm';
// import ModalForm5 from './modal-form5';
// import ModalForm6 from './modal-form6';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import '../../assets/css/local/components/modal-item.min.css';
import ApproverForm from '../Modals/ApproverForm';

const actions = [
    {
        id: 1,
        className: 'btn-actions btn-actions1',
        actionName: 'תפקיד חדש',
        displayResponsive: false,
        dialogClass: 'dialogClass1',
        modalName: CreateRoleForm,
    },
    {
        id: 2,
        className: 'btn-actions btn-actions2',
        actionName: 'שינוי היררכיה',
        displayResponsive: false,
        dialogClass: 'dialogClass2',
        modalName: RenameOGForm,
    },
    {
        id: 3,
        className: 'btn-actions btn-actions3',
        actionName: 'מעבר תפקיד',
        displayResponsive: false,
        dialogClass: 'dialogClass3',
        modalName: AssignRoleToEntityForm,
    }, //disconnect true
    {
        id: 4,
        className: 'btn-actions btn-actions4',
        actionName: 'הוספת משתמש',
        displayResponsive: false,
        dialogClass: 'dialogClass3',
        modalName: CreateEntityForm,
    }, //disconnect false
    {
        id: 5,
        className: 'btn-actions btn-actions5',
        actionName: 'היררכיה חדשה',
        displayResponsive: false,
        dialogClass: 'dialogClass5',
        modalName: CreateOGForm,
    },
    {
        id: 6,
        className: 'btn-actions btn-actions6',
        actionName: 'גורם מאשר',
        displayResponsive: false,
        dialogClass: 'dialogClass6',
        modalName: ApproverForm,
    },
];

const Action = () => {
    const [actionList, setActionList] = useState(actions);
    const modalRefs = useMemo(
        () =>
            actions.map((i) => {
                return { id: i.id, ref: createRef() };
            }),
        []
    );
    const toast = useRef(null);

    const getRef = (id) => modalRefs.find((ref) => ref.id === id).ref;

    const onClick = (id) => {
        setActionList(
            actionList.map((action) => (action.id == id ? { ...action, displayResponsive: true } : { ...action }))
        );
    };

    const onHide = (id) => {
        setActionList(
            actionList.map((action) => (action.id == id ? { ...action, displayResponsive: false } : { ...action }))
        );
    };

    const handleRequest = async (id) => {
        const ref = getRef(id);
        try {
            const res = await ref.current.handleSubmit();
            console.log({ res });
            toast.current.show({
                severity: 'success',
                summary: 'Success Message',
                detail: 'Message Content',
                life: 3000,
            });
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
        }
        setActionList(
            actionList.map((action) => (action.id == id ? { ...action, displayResponsive: false } : { ...action }))
        );
    };

    const renderFooter = (name) => {
        return (
            <div className='display-flex '>
                <div className='display-flex'>
                    {name == 3 || name == 4 ? (
                        <Button label='הוספה מקובץ' onClick={() => onHide(name)} className='btn-before' />
                    ) : (
                        ''
                    )}
                </div>
                <div className='display-flex '>
                    <Button label='ביטול' onClick={() => onHide(name)} className='btn-underline' />

                    {name == 5 ? (
                        <Button
                            label=' שליחת בקשה'
                            onClick={() => handleRequest(name)}
                            className='btn-gradient orange'
                        />
                    ) : name == 6 ? (
                        <Button
                            label=' שליחת בקשה'
                            onClick={() => handleRequest(name)}
                            className='btn-gradient orange'
                        />
                    ) : (
                        <Button label='שמירה' onClick={() => handleRequest(name)} className='btn-gradient orange' />
                    )}
                </div>
            </div>
        );
    };

    const renderModalForm = (name, id) => {
        const ref = getRef(id);
        const FormName = name;
        return <FormName ref={ref} />;
    };

    return (
        <ul className='display-flex units-wrap'>
            <Toast ref={toast} />
            {actionList.map(({ id, className, actionName, displayResponsive, dialogClass, modalName }) => (
                <li key={id}>
                    <Button className={className} title={actionName} label={actionName} onClick={() => onClick(id)} />
                    <Dialog
                        className={dialogClass}
                        header={actionName}
                        visible={displayResponsive}
                        onHide={() => onHide(id)}
                        footer={renderFooter(id)}
                    >
                        {renderModalForm(modalName, id)}
                    </Dialog>
                </li>
            ))}
        </ul>
    );
};

export default Action;
