import 'primereact/resources/primereact.css';

import React, { useEffect, useState } from 'react';
import { getSupportGroupLink } from '../../service/ConfigService';
import { useStores } from '../../context/use-stores';

const ContactInfo = () => {
  const { configStore } = useStores();
  const [supportGroupLink, setsupportGroupLink] = useState('');
  useEffect(() => {
    getSupportGroupLink().then(setsupportGroupLink);
  }, []);

  return (
    <div className="contact-info">
      <p>לשאלות ותמיכה בבקשות LEGO:</p>
      <ul>
        <li>
          {' '}
          {'לפתיחת תקלה/בקשת עזרה יש להגיש פנייה במערכת טומי '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={configStore.TOMY_LINK}
            style={{ fontWeight: '700', textDecoration: 'underline' }}
          >
            לחץ כאן
          </a>
        </li>
        <li style={{ marginTop: '1em' }}>
          {' '}
          {`לשאלות ובירורים נוספים ניתן לפנות לצוות התמיכה TechOps בטלפון ${configStore.TECH_OPS_PHONE_NUMBER} ובכתובת המייל "TechOps" או `}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:${configStore.TECH_OPS_MAIL}`}
            title={configStore.TECH_OPS_MAIL}
            style={{ fontWeight: '700', textDecoration: 'underline' }}
          >
            לחץ כאן
          </a>
        </li>
        <li style={{ marginTop: '1em' }}>
          {' '}
          ליצירת קשר בנושא בקשות שממתינות לאישור יחב"ם ניתן לשלוח מייל לכתובת
          "דסק שובם" או{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:${configStore.SECURITY_MAIL}`}
            title={configStore.SECURITY_MAIL}
            style={{ fontWeight: '700', textDecoration: 'underline' }}
          >
            לחץ כאן
          </a>
        </li>
        <li style={{ marginTop: '1em' }}>
          {' '}
          ליצירת קשר בנושא בקשות שממתינות לאישור בטח"ם ניתן לשלוח מייל לכתובת
          "בטחם שוטף" או{' '}
          <a
            href={`mailto:${configStore.SUPER_SECURITY_MAIL}`}
            title={configStore.SUPER_SECURITY_MAIL}
            style={{ fontWeight: '700', textDecoration: 'underline' }}
          >
            לחץ כאן
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
