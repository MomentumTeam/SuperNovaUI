import { toJS } from 'mobx';
import { useEffect } from 'react';
import { useStores } from "../../../context/use-stores";

const TakeRequest = ({ request, actionPopup }) => {
  const { userStore, appliesStore } = useStores();
  const user = toJS(userStore.user);

  const onSubmit = async () => {
    const approvers = [user];

    const req = {
      user,
      approvers,
      approversType: user.types,
      reqId: request.id,
    };

    try {
      await appliesStore.transferApprovers(req);
      actionPopup();
    } catch (e) {
      actionPopup(e);
    }
  };

  useEffect(() => {

      onSubmit();
  }, [request])
};

export { TakeRequest };
