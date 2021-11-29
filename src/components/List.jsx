import { STATUSES, TYPES } from "../constants";
import datesUtil from "../utils/dates";
import { useState } from "react";
import PreviewRequestsDialog from "./Modals/Request/PreviewRequestsDialog1";
import { StatusFieldTemplate } from './Fields/StatusFieldTemplate';

const List = ({ list }) => {
  const [dialogRequest, setDialogRequest] = useState({});
  const [dialogRequestIndex, setDialogRequestIndex] = useState({});
  const [isDialogVisible, setDialogVisiblity] = useState(false);

  const onClick = (request, index) => {
    setDialogRequest(request);
    setDialogRequestIndex(index);
    setDialogVisiblity(true);
  };

  return (
    <table className="tableStyle">
      <tbody>
        {list.map((request, index) => (
          <tr key={request.id} onClick={() => onClick(request, index)} style={{ cursor: "pointer" }}>
            <td>
              <div className="td-inner">{datesUtil.formattedDate(Number(request.createdAt))}</div>
            </td>
            <td>
              <div className="td-inner">
                {TYPES[request.type]}
                {"  "}
                {"(" + request.serialNumber + ")"}
              </div>
            </td>
            <td>
              <div className="td-inner td-inner-btn">
                <StatusFieldTemplate status={STATUSES[request.status]} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <PreviewRequestsDialog
        isDialogVisible={isDialogVisible}
        setDialogVisiblity={setDialogVisiblity}
        requests={list}
        index={dialogRequestIndex}
        request={dialogRequest}
      />
    </table>
  );
};

export default List;
