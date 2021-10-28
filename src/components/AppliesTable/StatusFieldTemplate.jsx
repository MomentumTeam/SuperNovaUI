
const StatusFieldTemplate = (status) => {
  return (
      <button
        className={
          "btn-status " +
          (status === "אושר" ? "btn-sent" : " btn-rejected" && status === "ממתין" ? "btn-waiting" : " btn-rejected")
        }
        type="button"
        title={status}
      >
        {status}
      </button>
  );
};

export { StatusFieldTemplate };
