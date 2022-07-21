import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '../../assets/css/local/components/helpHamburgerMenu.css';

import { React, useState } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import ContactInfo from './ContactInfo';
import FAQ from './FAQ';
import { Dialog } from 'primereact/dialog';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { action } from 'mobx';
import { Button } from 'primereact/button';

const HelpHamburgerMenu = () => {
  const [displayFAQ, setDisplayFAQ] = useState(false);
  const [displayContactInfo, setDisplayContactInfo] = useState(false);
  const { trackEvent, trackPageView } = useMatomo();

  const clickTracking = (action) => {
    trackPageView({
      documentTitle: 'דף הבית',
    });
    trackEvent({
      category: 'עזרה',
      action,
    });
  };

  const onFAQHide = () => {
    setDisplayFAQ(false);
    clickTracking('שאלות ותשובות');
  };

  const onContactInfoHide = () => {
    setDisplayContactInfo(false);
    clickTracking('צור קשר');
  };

  // const hamburgerItems = [
  //   {
  //     label: 'ContactInfo',
  //     icon: 'pi pi-phone',
  //     command: () => {
  //       setDisplayContactInfo(true);
  //     },
  //   },
  //   {
  //     label: 'FAQ',
  //     icon: 'pi pi-question',
  //     command: () => {
  //       setDisplayFAQ(true);
  //     },
  //   },
  // ];

  return (
    <div>
      <div className="card help-speeddial">
        {/* <SpeedDial
          model={hamburgerItems}
          direction="left"
          transitionDelay={80}
          showIcon="pi pi-bars"
          hideIcon="pi pi-times"
          buttonClassName="p-button-outlined"
        /> */}

        <div
          className="p-button-outlined"
          style={{ display: 'flex', marginLeft: '15px' }}
        >
          <Button
            icon="pi pi-question"
            onClick={() => setDisplayFAQ(true)}
            className="p-speeddial-action "
            style={{ marginLeft: '15px' }}
          />
          <Button
            icon="pi pi-phone"
            onClick={() => setDisplayContactInfo(true)}
            className="p-speeddial-action "
          />
        </div>
        <Dialog
          closeOnEscape
          header="צור קשר"
          visible={displayContactInfo}
          onHide={onContactInfoHide}
          breakpoints={{ '960px': '50vw' }}
          style={{ width: '35vw', minHeight: '250px', height: '350px' }}
          className="contact-info-dialog"
          dismissableMask={true}
        >
          <ContactInfo />
        </Dialog>
        <Dialog
          closeOnEscape
          header="שאלות ותשובות"
          visible={displayFAQ}
          onHide={onFAQHide}
          breakpoints={{ '960px': '75vw' }}
          style={{ width: '60vw' }}
          className="faq-dialog"
          dismissableMask={true}
        >
          <FAQ />
        </Dialog>
      </div>
    </div>
  );
};

export default HelpHamburgerMenu;
