import "primereact/resources/primereact.css";

import React, { useEffect, useState } from "react";
import { getSupportGroupLink } from "../../service/ConfigService";

const ContactInfo = () => {
  const [supportGroupLink, setsupportGroupLink] = useState("");
  useEffect(() => {
    getSupportGroupLink().then(setsupportGroupLink);
  }, []);

  return (
    <div style={{ textAlign: "center" }} className="contact-info">
      <p>לשאלות ותמיכה בבקשות LEGO:</p>
      <p>
        צוות מומנטום, ענף יסודות- לכניסה לקבוצת התמיכה{" "}
        <a
          href={supportGroupLink}
          style={{ fontWeight: "700", textDecoration: "underline" }}
        >
          לחץ כאן
        </a>
      </p>
    </div>
  );
};

export default ContactInfo;
