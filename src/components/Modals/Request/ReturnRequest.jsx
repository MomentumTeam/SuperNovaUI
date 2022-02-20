import { toJS } from 'mobx';
import { useEffect } from 'react';
import { useStores } from '../../../context/use-stores';

const ReturnRequest = ({ request, actionPopup }) => {  //return apply back to applies basket
  const { userStore, appliesApproveStore } = useStores();
  const user = toJS(userStore.user);

  const onSubmit = async () => {
    const req = {
      user,
      approverId: user.id,
      approversType: user.types,
      reqId: request.id,
    };

    try {
      await appliesApproveStore.removeApproverFromApprovers(req);
      actionPopup("החזרה לסל");
    } catch (e) {
      actionPopup("החזרה לסל", e);
    }
  };

  useEffect(() => {
    onSubmit();
  }, [request]);
};

export { ReturnRequest };
