import "primereact/resources/primereact.css";
import "../../assets/css/local/components/faq.css";
import faqs from "../../constants/faq";

import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

const FAQ = () => {
  const mapToParagraphsWithNewLines = (text) =>
    text.split("\n").map((str, index) => <p key={index}>{str}</p>);

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
            {mapToParagraphsWithNewLines(faq.body)}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
