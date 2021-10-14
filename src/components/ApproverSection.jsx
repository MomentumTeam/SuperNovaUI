import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import "../assets/css/local/components/modal-item.min.css";
import { updateDecisionReq } from "../service/ApproverService";

const ApproverSection = ({ requestId, setDialogVisiblity }) => {
  const [approverComment, setApproverComment] = useState("");

  const approveRequest = async () => {
    try {
      await updateDecisionReq(requestId, {
        decision: { decision: "APPROVED", reason: approverComment },
        type: "SUPER_SECURITY_APPROVER", // TODO: get approver type from user
      });
    } catch (e) {
      console.log(e);
    }
    setDialogVisiblity(false);
  };

  const denyRequest = async () => {
    try {
      await updateDecisionReq(requestId, {
        decision: { decision: "DENIED", reason: approverComment },
        type: "SUPER_SECURITY_APPROVER", // TODO: get approver type from user
      });
    } catch (e) {
      console.log(e);
    }
    setDialogVisiblity(false);
  };

  return (
    <>
      <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
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
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            label="אישור"
            onClick={() => approveRequest()}
            className="btn-gradient green"
            style={{ marginRight: "20px" }}
          />
          <Button
            label="דחייה"
            onClick={() => denyRequest()}
            className="btn-gradient orange"
          />
        </div>
        <div>
          <Button label="סגירה" className="btn-gradient" />
        </div>
      </div>
    </>
  );
};

export default ApproverSection;
