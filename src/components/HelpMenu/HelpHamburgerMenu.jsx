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
      <div className="card help-speeddial">
        <SpeedDial
          model={hamburgerItems}
          direction="left"
          transitionDelay={80}
          showIcon="pi pi-bars"
          hideIcon="pi pi-times"
          buttonClassName="p-button-outlined"
        />
        <Dialog
          closeOnEscape
          header="צור קשר"
          visible={displayContactInfo}
          onHide={onContactInfoHide}
          breakpoints={{ "960px": "50vw" }}
          style={{ width: "35vw", minHeight: "250px", height: "250px" }}
          className="contact-info-dialog"
        >
          <ContactInfo />
        </Dialog>
        <Dialog
          closeOnEscape
          header="שאלות ותשובות"
          visible={displayFAQ}
          onHide={onFAQHide}
          breakpoints={{ "960px": "75vw" }}
          style={{ width: "60vw" }}
          className="faq-dialog"
        >
          <FAQ />
        </Dialog>
      </div>
    </div>
  );
};

export default HelpHamburgerMenu;
