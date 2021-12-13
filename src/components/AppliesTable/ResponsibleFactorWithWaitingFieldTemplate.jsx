import { Badge } from "primereact/badge";
import { getResponsibleFactors } from '../../utils/applies';
import { Chip } from "primereact/chip";

import {getUserNameFromDisplayName} from '../../utils/user';

import '../../assets/css/local/components/responsibleapprover.css';

const ResponsibleFactorWithWaitingFieldTemplate = (apply, user) => {
  const responsibles = getResponsibleFactors(apply, user);
  let names = [];
  let waiting = null;

  Object.keys(responsibles).reverse().forEach(index => {
     if (typeof responsibles[index] === "string") {
       waiting = responsibles[index];
     } else {
       names = [...names, getUserNameFromDisplayName(responsibles[index].displayName)];
     }
  })
 
  const getFormatted = () => {
    if (waiting != null) {
      return <span className="waiting">{waiting}</span>;
    } else {
      if (names.length === 0) return "---";
      if (names.length === 1) return <Chip label={names[0]} icon="pi pi-user" className="person" />;
      if (names)
        return (
          <div>
            <span style={{ padding: "2px", display: "inline-block" }} className="p-overlay-badge">
              <Chip label={`${names[0]}`} icon="pi pi-users" className="person"/>
            <Badge value={`${names.length - 1}+`} className="more-person"/>
            </span>
          </div>
        );
    }
  };
  return <div>{getFormatted()}</div>;
};

export { ResponsibleFactorWithWaitingFieldTemplate };
