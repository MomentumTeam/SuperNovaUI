import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "../../assets/css/local/components/helpHamburgerMenu.css";

import { React, useState } from "react";
import { SpeedDial } from "primereact/speeddial";
import ContactInfo from "./ContactInfo";
import FAQ from "./FAQ";
import { Dialog } from "primereact/dialog";

const HelpHamburgerMenu = () => {
  const [displayFAQ, setDisplayFAQ] = useState(false);
  const [displayContactInfo, setDisplayContactInfo] = useState(false);

  const onFAQHide = () => {
    setDisplayFAQ(false);
  };

  const onContactInfoHide = () => {
    setDisplayContactInfo(false);
  };

  const hamburgerItems = [
    {
      label: "ContactInfo",
      icon: "pi pi-phone",
      command: () => {
        setDisplayContactInfo(true);
      },
    },
    {
      label: "FAQ",
      icon: "pi pi-question",
      command: () => {
        setDisplayFAQ(true);
      },
    },
  ];

  return (
    <div>
      <div className="card">
        <SpeedDial
          model={hamburgerItems}
          direction="left"
          transitionDelay={80}
          showIcon="pi pi-bars"
          hideIcon="pi pi-times"
          buttonClassName="p-button-outlined"
        />
        <Dialog
          header="צור קשר"
          visible={displayContactInfo}
          onHide={onContactInfoHide}
          breakpoints={{ "960px": "75vw" }}
          style={{ width: "60vw" }}
          className="contact-info-dialog"
        >
          <ContactInfo
            displayContactInfo={displayContactInfo}
            onContactInfoHide={onContactInfoHide}
          />
        </Dialog>
        <Dialog
          header="שאלות ותשובות"
          visible={displayFAQ}
          onHide={onFAQHide}
          breakpoints={{ "960px": "75vw" }}
          style={{ width: "60vw" }}
          className="faq-dialog"
        >
          <FAQ displayFAQ={displayFAQ} onFAQHide={onFAQHide} />
        </Dialog>
      </div>
    </div>
  );
};

export default HelpHamburgerMenu;
