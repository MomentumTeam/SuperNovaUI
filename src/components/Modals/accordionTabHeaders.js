import InfoPopup from '../InfoPopup';
import { headersInfo } from '../../constants/actions';

const renderAccordionTabHeader = (title, showInfo, bulk = false) => { 
  
  return (
    <div className="display-flex">
      {bulk ? 'הגשת בקשה מרובה': title}
      <InfoPopup
        name={title + ' accordion'}
        infoText={headersInfo[title]}
        visible={showInfo}
      ></InfoPopup>
    </div>
  );
};

export default renderAccordionTabHeader;
