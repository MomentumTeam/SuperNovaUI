import {
    InputTypes
} from '../components/Fields/InputForm';

export const getUniqueFieldsByUserType = (configStore, userType) => {
    const anonUserFormFields = [{
            fieldName: 'unitId',
            displayName: 'מזהה יחידה',
            inputType: InputTypes.DROPDOWN,
            type: 'num',
            keyFilter: 'num',
            canEdit: true,
            force: true,
        },
        {
            fieldName: 'employeeId',
            displayName: 'מספר עובד',
            inputType: InputTypes.TEXT,
            type: 'num',
            keyFilter: 'num',
            canEdit: true,
            force: true,
        },
    ];

    const civilianUserFormFields = [{
        fieldName: 'identityNumber',
        displayName: 'ת"ז',
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
        canEdit: true,
        force: true,
    }, ];

    const soldierUserFormFields = [{
            fieldName: 'identityNumber',
            displayName: 'ת"ז',
            inputType: InputTypes.TEXT,
            type: 'num',
            keyFilter: 'num',
            canEdit: true,
            force: true,
        },
        {
            fieldName: 'personalNumber',
            displayName: 'מספר אישי',
            inputType: InputTypes.TEXT,
            type: 'num',
            keyFilter: 'num',
            canEdit: true,
            force: true,
        },
        {
            fieldName: 'serviceType',
            inputType: InputTypes.DROPDOWN,
            canEdit: true,
            options: configStore.KARTOFFEL_SERVICE_TYPES,
            displayName: 'סוג שירות ',
            force: true,
            additionalClass: 'dropDownInput',
        },
        {
            fieldName: 'rank',
            displayName: 'דרגה ',
            inputType: InputTypes.DROPDOWN,
            canEdit: true,
            options: configStore.KARTOFFEL_RANKS,
            force: true,
            additionalClass: 'dropDownInput',
        },
    ];

    let fields;
    switch (userType) {
        case configStore.KARTOFFEL_CIVILIAN:
            fields = civilianUserFormFields;
            break;
        case configStore.KARTOFFEL_WORKER:
            fields = anonUserFormFields;
            break;
        case configStore.KARTOFFEL_SOLDIER:
            fields = soldierUserFormFields;
            break;
    }
    return fields;
}
