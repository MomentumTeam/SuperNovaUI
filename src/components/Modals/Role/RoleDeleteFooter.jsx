import React from 'react';
import { Button } from 'primereact/button';
const RoleDeleteFooter = ({ closeModal, deleteHierarchy, disabled }) => {
  return (
    <div className="display-flex ">
      <Button
        label={'כן, מחק את התפקיד ואת ההיסטוריה שלו'}
        onClick={() => {
          deleteHierarchy();
        }}
        className="btn-gradient cyon"
        disabled={disabled}
      />
      <Button
        label="לא, אל תמחקו את התפקיד!"
        onClick={closeModal}
        className="btn-gradient red"
      />
    </div>
  );
};

export { RoleDeleteFooter };
