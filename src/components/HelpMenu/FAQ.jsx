import 'primereact/resources/primereact.css';
import '../../assets/css/local/components/faq.css';
import faqs from '../../constants/faq';

import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useStores } from '../../context/use-stores';

const FAQ = () => {
  const { configStore } = useStores();

  const mapToParagraphsWithNewLines = (text, id) => {
    const rows = text.split('\n');
    
    return rows.map((str, index) => (
      <p key={index}>
        {str}
        {id === 1 && index === rows.length - 1 && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${configStore.INSTRUCTION_VIDEOS}`}
            title={configStore.INSTRUCTION_VIDEOS}
            style={{ fontWeight: '700', textDecoration: 'underline' }}
          >
            לחץ כאן
          </a>
        )}
      </p>
    ));
  };

  return (
    <div className="card accordion-faq">
      <Accordion className="accordion-custom" activeIndex={0}>
        {faqs.map((faq) => (
          <AccordionTab
            header={
              <React.Fragment>
                <i className={faq.icon}></i>
                <span>{faq.header}</span>
              </React.Fragment>
            }
          >
            {mapToParagraphsWithNewLines(faq.body, faq.id)}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
