import { STATUSES, TYPES } from "../constants";
import datesUtil from "../utils/dates";
import { useState } from "react";
import PreviewRequestsDialog from "./PreviewRequestsDialog";

const List = ({ list }) => {

  const [dialogRequest, setDialogRequest] = useState({});

  const onClick = (request) => {
    setDialogRequest(request);
  };

  return (
    <table className="tableStyle">
      <tbody>
        {list.map((request) => (
          <tr key={request.id}>
            <td>
              <div className="td-inner">
                {datesUtil.formattedDate(Number(request.createdAt))}
              </div>
            </td>
            <td>
              <div className="td-inner">{TYPES[request.type]}</div>
            </td>
            <td>
              <div className="td-inner td-inner-btn">
                <button
                  onClick={() => onClick(request)}
                  className={
                    "btn-status " +
                    (request.status === STATUSES.SENT
                      ? "btn-sent"
                      : " btn-rejected")
                  }
                  type="button"
                  title={request.status}
                >
                  {STATUSES[request.status]}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <PreviewRequestsDialog request={dialogRequest} />
    </table>
  );
};

export default List;
