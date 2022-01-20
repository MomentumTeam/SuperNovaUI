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
          צוות מומנטום, ענף יסודות- לכניסה לקבוצת התמיכה{' '}
          <a
            href={supportGroupLink}
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
            href={`mailto:${configStore.SECUIRTY_MAIL}`}
            title={configStore.SECUIRTY_MAIL}
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
            href={`mailto:${configStore.SUPER_SECUIRTY_MAIL}`}
            title={configStore.SUPER_SECUIRTY_MAIL}
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
