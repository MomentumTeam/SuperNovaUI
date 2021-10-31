import React from 'react';
import { InputText } from 'primereact/inputtext';
import '../assets/css/local/components/modal-item.min.css';
import ApproverSection from './ApproverSection';
import RequestFlowChart from './RequestFlowChart';


// TODO: add progress bar

const PreviewRequestWrapper = ({
  ModalComponent,
  request,
  setDialogVisiblity,
}) => {
  return (
    <>
      <RequestFlowChart request={request} />
      <h2>פרטי מגיש הבקשה</h2>
      <div className='p-fluid'>
        <div className='p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2020'>
              <span className='required-field'>*</span>שם משתמש
            </label>
            <InputText
              id='2022'
              disabled={true}
              value={request?.submittedBy?.displayName}
              field='displayName'
            />
          </div>
        </div>
        <div className='p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2013'>
              <span className='required-field'>*</span>מ"א/ת"ז
            </label>
            <InputText
              value={
                request?.submittedBy?.personalNumber ||
                request?.submittedBy?.identityCard
              }
              disabled={true}
              id='2013'
              type='text'
              required
              keyfilter='pint'
              maxlength='9'
              placeholder="מ''א/ת''ז"
            />
          </div>
        </div>
      </div>
      <hr style={{ borderWidth: '1px' }} />
      <h2>פרטי הבקשה</h2>
      <ModalComponent onlyForView={true} requestObject={request} />
      {
        // TODO: show only to approvers and check if the component is not place in "My Requests" (maybe add prop var)
        true && (
          <ApproverSection
            requestId={request.id}
            setDialogVisiblity={setDialogVisiblity}
          />
        )
      }
    </>
  );
};

export default PreviewRequestWrapper;
