import { STATUSES_CLASS } from "../../constants/status";

const StatusFieldTemplate = (status) => {
  const stat = status?.status? status.status: status;
  return (
    <>
      <button className={"btn-status " + STATUSES_CLASS[stat]} type="button" title={stat}>
        {stat}
      </button>
    </>
  );
};

export { StatusFieldTemplate };
