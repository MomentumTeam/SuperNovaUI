const disabledInputStyle = {
  opacity: 0.6,
  backgroundColor: "#f7f5fd",
  border: "1px solid #8390a9",
};

const getLabel = ({ labelName, isEdit, canEdit= false }) => {
  return (
    <label>
      {isEdit && canEdit && <span className="required-field">*</span>}
      {labelName}
    </label>
  );
};


export {getLabel, disabledInputStyle}