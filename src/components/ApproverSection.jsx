import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import '../assets/css/local/components/modal-item.min.css';
import { useStores } from '../context/use-stores';
import { toJS } from 'mobx';
import { DECISIONS, REQ_STATUSES } from '../constants';
import {
  getApproverComments,
  isApproverAndCanEdit,
  getDenyReason,
} from '../utils/applies';

const ApproverSection = ({ request, setDialogVisiblity }) => {
  const { appliesStore, userStore } = useStores();
  const user = toJS(userStore.user);

  let requestId = request.id;
  const enabledChange = isApproverAndCanEdit(request, user);

  const [approverMode, setApproveMode] = useState({
    commentMode: false,
    denyMode: false,
    denyReason: '',
  });

  const [approverComments, setApproverComments] = useState(
    getApproverComments(request, user)
  );

  const onChangeComment = (e, index) => {
    approverComments[index].comment = e.target.value;
    setApproverComments([...approverComments]);
  };

  const changeDecisionRequest = async (decision) => {
    try {
      let decisionObject = {
        user,
        requestId,
        decision: { decision },
      };

      if (approverMode.denyMode && approverMode.denyReason.length > 0)
        decisionObject.decision.reason = approverMode.denyReason;

      await appliesStore.updateApplyDecision(decisionObject);
    } catch (err) {
      console.log(err);
    }
    setDialogVisiblity(false);
    setApproveMode({
      commentMode: false,
      denyMode: false,
      denyReason: '',
    });
  };

  const submit = async () => {
    if (approverMode.denyMode) {
      changeDecisionRequest(DECISIONS.DENIED);
    } else if (approverMode.commentMode) {
      for (let comment of approverComments) {
        let newCommentObject = {
          requestId,
          approversType: comment.userType,
          comment: comment.comment,
        };

        await appliesStore.updateApproversComments(newCommentObject);
        setApproveMode({...approverMode, commentMode: false});
      }
    }
  };

  return (
    <>
      <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
          {approverComments.map((comment, index) => {
            return (
              <div className="p-field">
                <label>
                  <span></span>
                  {comment.label}
                </label>
                <InputTextarea
                  disabled={!approverMode.commentMode}
                  value={comment.comment}
                  type="text"
                  autoResize="false"
                  onChange={(e) => {
                    onChangeComment(e, index);
                  }}
                />
              </div>
            );
          })}

          {request.status === REQ_STATUSES.DECLINED && (
            <div className="p-field">
              <label>
                <span></span>
                סיבת דחייה
              </label>
              <InputTextarea
                disabled={true}
                value={getDenyReason(request)}
                type="text"
                autoResize="false"
              />
            </div>
          )}

          {enabledChange && approverMode.denyMode && (
            <div className="p-field">
              <label>
                <span></span>
                סיבת דחייה
              </label>
              <InputTextarea
                value={approverMode.denyReason}
                type="text"
                autoResize="false"
                onChange={(e) =>
                  setApproveMode({
                    ...approverMode,
                    denyReason: e.target.value,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        {enabledChange &&
          (!approverMode.commentMode && !approverMode.denyMode ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button
                  label="אישור"
                  onClick={() => changeDecisionRequest(DECISIONS.APPROVED)}
                  className="btn-gradient green"
                  style={{ marginRight: '20px' }}
                />
                <Button
                  label="דחייה"
                  onClick={() => {
                    setApproveMode({
                      ...approverMode,
                      denyMode: true,
                      commentMode: false,
                    });
                  }}
                  className="btn-gradient orange"
                />
              </div>
            </>
          ) : (
            <div>
              <Button
                label={approverMode.denyMode ? 'דחייה' : 'שמירה'}
                className="btn-gradient orange"
                onClick={submit}
              />
            </div>
          ))}

        {enabledChange &&
          (!approverMode.commentMode && !approverMode.denyMode ? (
            <>
              <div>
                {/* TODO: CHANGE TO COMMENTS */}
                <Button
                  label="הוספת הערה"
                  className="btn-gradient"
                  onClick={(e) => {
                    setApproveMode({
                      ...approverMode,
                      commentMode: true,
                      denyMode: false,
                    });
                  }}
                />
              </div>
            </>
          ) : (
            <div>
              <Button
                label="ביטול"
                className="btn-gradient"
                onClick={() =>
                  setApproveMode({
                    ...approverMode,
                    commentMode: false,
                    denyMode: false,
                  })
                }
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default ApproverSection;
