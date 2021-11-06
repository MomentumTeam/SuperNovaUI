import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import "../assets/css/local/components/modal-item.min.css";
import { useStores } from "../context/use-stores";
import { toJS } from "mobx";
import { canEditApply, getApproverComments } from '../utils/applies';

const ApproverSection = ({ isApprover, request, setDialogVisiblity }) => {
  const { appliesStore, userStore } = useStores();
  const user = toJS(userStore.user);

  let requestId = request.id;
  const enabledChange = canEditApply(request, user) && isApprover;

  const [approverComment, setApproverComment] = useState("");

  const changeDecisionRequest = async (decision) => {
    try {
      let decisionObject = {
        user,
        requestId,
        decision: { decision },
      };

      if (approverComment.length > 0) decisionObject.decision.reason = approverComment;

      await appliesStore.updateApplyDecision(decisionObject);
    } catch (e) {
      console.log(e);
    }
    setDialogVisiblity(false);
  };


  return (
    <>
      <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
          {getApproverComments(request, user).map(comment => {
            return (
              <div className="p-field">
                <label>
                  <span></span>
                  {comment.label}
                </label>
                <InputTextarea
                  disabled={true}
                  value={comment.comment}
                  type="text"
                  autoResize="false"
                  onChange={(e) => setApproverComment(e.target.value)}
                />
              </div>
            );
          })}
          {enabledChange && (
            <div className="p-field">
              <label>
                <span></span>הערות מאשר
              </label>
              <InputTextarea
                value={approverComment}
                type="text"
                autoResize="false"
                onChange={(e) => setApproverComment(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        {enabledChange && (
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              label="אישור"
              onClick={() => changeDecisionRequest("APPROVED")}
              className="btn-gradient green"
              style={{ marginRight: "20px" }}
            />
            <Button label="דחייה" onClick={() => changeDecisionRequest("DENIED")} className="btn-gradient orange" />
          </div>
        )}
        <div>
          <Button label="סגירה" className="btn-gradient" onClick={() => setDialogVisiblity(false)} />
        </div>
      </div>
    </>
  );
};

export default ApproverSection;
