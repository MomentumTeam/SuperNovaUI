import InfoPopup from '../InfoPopup';
import { headersInfo } from '../../constants/actions';

const renderAccordionTabHeader = (title, showInfo) => {
  return (
    <div className="display-flex">
      {title}
      <InfoPopup
        name={title + ' accordion'}
        infoText={headersInfo[title]}
        visible={showInfo}
      ></InfoPopup>
    </div>
  );
};

export default renderAccordionTabHeader;
