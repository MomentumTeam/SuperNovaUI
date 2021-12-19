import React from 'react';
import { InputText } from 'primereact/inputtext';
import '../../../assets/css/local/components/modal-item.min.css';
import ApproverSection from '../../ApproverSection';
import RequestFlowChart from './RequestFlowChart';
import { DeleteSection } from './DeleteSection';
import HorizontalLine from '../../HorizontalLine';


const PreviewRequestWrapper = ({
  ModalComponent,
  request,
  showJob,
  setDialogVisiblity,
}) => {
  return (
    <>
      <RequestFlowChart request={request} />
      <h2>פרטי מגיש הבקשה</h2>
      <div className="p-fluid">
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="2020">
              <span className="required-field">*</span>שם משתמש
            </label>
            <InputText
              id="2022"
              disabled={true}
              value={request?.submittedBy?.displayName}
              field="displayName"
            />
          </div>
        </div>
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="2013">
              <span className="required-field">*</span>מ"א/ת"ז
            </label>
            <InputText
              value={
                request?.submittedBy?.personalNumber ||
                request?.submittedBy?.identityCard
              }
              disabled={true}
              id="2013"
              type="text"
              required
              placeholder="מ''א/ת''ז"
            />
          </div>
        </div>
      </div>
      <hr style={{ borderWidth: '1px' }} />
      <h2>פרטי הבקשה</h2>
      <ModalComponent
        onlyForView={true}
        requestObject={request}
        showJob={showJob}
      />
      <HorizontalLine />

      <ApproverSection
        request={request}
        setDialogVisiblity={setDialogVisiblity}
      />
      <DeleteSection requestId={request.id} setDialogVisiblity={setDialogVisiblity} />
    </>
  );
};

export default PreviewRequestWrapper;
