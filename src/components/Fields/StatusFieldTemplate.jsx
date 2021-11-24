import { STATUSES_CLASS } from "../../constants/status";

const StatusFieldTemplate = (status) => {
  return (
    <button className={"btn-status " + STATUSES_CLASS[status]} type="button" title={status}>
      {status}
    </button>
  );
};

export { StatusFieldTemplate };
