import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  createRef,
} from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import '../../assets/css/local/components/modal-item.min.css';

import InfoPopup from '../InfoPopup';
import '../../assets/css/local/components/dialog.css';
import { useToast } from '../../context/use-toast';
import { actions, headersInfo } from '../../constants/actions';
import { USER_TYPE } from '../../constants';
import { isUserHoldType } from '../../utils/user';
import { useStores } from '../../context/use-stores';

const Action = () => {
  const { actionPopup } = useToast();
  const [actionList, setActionList] = useState(actions);
  const [isActionDone, setIsActionDone] = useState(false);
  const [currentActionId, setCurrentActionId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { userStore } = useStores();
  const isBulkPermitted = isUserHoldType(userStore.user, USER_TYPE.BULK);

  const modalRefs = useMemo(
    () =>
      actions.map((i) => {
        return { id: i.id, ref: createRef() };
      }),
    []
  );

  const getRef = useCallback(
    (id) => modalRefs.find((ref) => ref.id === id).ref,
    [modalRefs]
  );

  const onClick = (id) => {
    setActionList(
      actionList.map((action) =>
        action.id === id
          ? { ...action, displayResponsive: true }
          : { ...action }
      )
    );
  };

  const onHide = (id) => {
    setActionList(
      actionList.map((action) =>
        action.id === id
          ? { ...action, displayResponsive: false }
          : { ...action }
      )
    );
  };

  useEffect(() => {
    if (currentActionId) {
      const actionName = actionList.find(
        (action) => action.id === currentActionId
      ).actionName;
      isActionDone && actionName && actionPopup(actionName);
    }

    isActionDone &&
      setActionList(
        actionList.map((action) =>
          action.id === currentActionId
            ? { ...action, displayResponsive: false }
            : { ...action }
        )
      );

    setIsActionDone(false);
  }, [actionList, currentActionId, isActionDone]);

  const handleRequest = useCallback(
    async (id) => {
      setCurrentActionId(id);
      const ref = getRef(id);
      try {
        setSubmitted(true);
        await ref.current.handleSubmit();
        setSubmitted(false);
      } catch (e) {
        setSubmitted(false);
        const actionName = actionList.find(
          (action) => action.id === currentActionId
        );
        actionPopup(actionName?.actionName, e.message || 'Message Content');
      }
    },
    [getRef]
  );

  const renderHeader = (
    actionName,
    showInfo,
    infoText,
    infoWithTitle,
    isBulkPermitted
  ) => {
    if (!isBulkPermitted) {
      if (actionName === '?????????? ??????') {
        infoText = headersInfo['?????????? ??????'];
      } else if (actionName === '???????? ??????????????') {
        infoText = headersInfo['???????? ?????????????? ????????????'];
      }
    }

    return (
      <div className="display-flex dialog-header">
        <div className="dialog-header-title">{actionName}</div>
        <InfoPopup
          name={actionName + ' dialog'}
          infoText={infoText}
          visible={showInfo}
          withTitle={infoWithTitle}
        ></InfoPopup>
      </div>
    );
  };

  const renderFooter = (name) => {
    return (
      <div className="display-flex ">
        <div className="display-flex"></div>
        <div className="display-flex ">
          <Button
            label="??????????"
            onClick={() => onHide(name)}
            className="btn-underline"
          />

          {name === 5 ? (
            <Button
              label=" ?????????? ????????"
              onClick={() => handleRequest(name)}
              disabled={submitted}
              className="btn-gradient orange"
            />
          ) : name === 6 ? (
            <Button
              label=" ?????????? ????????"
              onClick={() => handleRequest(name)}
              disabled={submitted}
              className="btn-gradient orange"
            />
          ) : (
            <Button
              label="?????????? ????????"
              onClick={() => handleRequest(name)}
              disabled={submitted}
              className="btn-gradient orange"
            />
          )}
        </div>
      </div>
    );
  };

  const renderModalForm = (name, id) => {
    const ref = getRef(id);
    const FormName = name;
    return <FormName ref={ref} setIsActionDone={setIsActionDone} />;
  };

  return (
    <ul className="display-flex units-wrap">
      {actionList.map(
        ({
          id,
          className,
          actionName,
          infoText,
          infoWithTitle,
          displayResponsive,
          dialogClass,
          modalName,
        }) => (
          <li key={id}>
            <Button
              className={className}
              title={actionName}
              label={actionName}
              onClick={() => onClick(id)}
            />
            <Dialog
              className={dialogClass}
              header={renderHeader(
                actionName,
                true,
                infoText,
                infoWithTitle,
                isBulkPermitted
              )}
              visible={displayResponsive}
              onHide={() => onHide(id)}
              footer={renderFooter(id)}
              dismissableMask={true}
            >
              {renderModalForm(modalName, id)}
            </Dialog>
          </li>
        )
      )}
    </ul>
  );
};

export default Action;
