import React from "react";
import { InputText } from "primereact/inputtext";
import cookies from "js-cookie";
import { tokenName } from "../../constants/api";
import Downloader from "js-file-downloader";

const BulkFileArea = ({ register, errors, downloadUrl, fileName }) => {
  return (
    <div style={{ display: "contents" }}>
      <div className="p-fluid-item-flex p-fluid-item">
        <div className="p-field">
          <label htmlFor="1903">
            <span className="required-field">*</span>העלאת קובץ
          </label>
          <span className="p-input-icon-left">
            <i className="pi pi-file-excel" />
            <InputText
              {...register("bulkFile")}
              id="1903"
              type="file"
              required
              placeholder="קובץ"
              style={{ paddingTop: "10px" }}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <label>
              {errors.bulkFile && (
                <small style={{ color: "red" }}>יש להעלות קובץ</small>
              )}
            </label>
          </span>
        </div>
      </div>
      <div
        className="p-fluid-item-flex p-fluid-item"
        style={{ alignItems: "center" }}
      >
        <button
          style={{
            textDecoration: "underline",
            background: "none",
            border: "none",
            color: "#069",
          }}
          onClick={() => {
            new Downloader({
              url: downloadUrl,
              filename: fileName,
              headers: [
                {
                  name: "Authorization",
                  value: `Bearer ${cookies.get(tokenName)}`,
                },
              ],
            });
          }}
        >
          להורדת הפורמט לחץ כאן
        </button>
      </div>
    </div>
  );
};

export default BulkFileArea;
