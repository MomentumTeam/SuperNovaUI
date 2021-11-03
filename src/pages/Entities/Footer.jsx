import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

const Footer = () => {
  const [selectedState, setSelectedState] = useState(null);

  const states = [
    { name: "מספר1", code: "מספר1" },
    { name: "מספר2", value: "מספר2" },
    { name: "מספר3", code: "מספר3" },
    { name: "מספר4", code: "מספר4" },
    { name: "מספר5", code: "מספר5" },
  ];

  const onStateChange = (e) => {
    setSelectedState(e.value);
  };

  return (
    <div className="display-flex btns-wrap">
      <div className="display-flex inner-flex">
        {/* <button className='btn btn-print' title='Print' type='button'>
          <span className='for-screnReader'>Print</span>
        </button>
        <button className='btn btn-export' title='Export' type='button'>
          <span className='for-screnReader'>Export</span>
        </button> */}
        <div className="p-fluid">
          <div className="p-fluid-item">
            <div className="display-flex pad0 p-field">
              {/* <label htmlFor='6000'>
                נבחרו:
                <span>0</span>
              </label> */}
              <Dropdown
                inputId="6000"
                value={selectedState}
                options={states}
                onChange={onStateChange}
                placeholder="שינוי תפקיד"
                optionLabel="name"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="display-flex inner-flex">
        <button className="btn-underline" type="button" title="ביטול">
          ביטול
        </button>
        <button className="btn-orange-gradient" type="button" title="שמירה">
          שמירה
        </button>
      </div>
    </div>
  );
};

export default Footer;
