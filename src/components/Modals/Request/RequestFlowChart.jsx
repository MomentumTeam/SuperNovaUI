import React from 'react';
import {
  DECISIONS,
  DECISIONS_TRANSLATE,
  REQ_STATUSES,
} from '../../../constants/';
import { ModalContent } from '../../RequestFlowChart.styles.js';
import { getFormattedDate } from '../../../utils/applies';

class RequestFlowChart extends React.Component {
  constructor(props) {
    super(props);
    this.request = props?.request || {};
    this.state = {};
  }

  // isStageApprover(stageDecision, mustHaveDecision) {
  //   return (
  //     !this?.request[stageDecision] ||
  //     this?.request[mustHaveDecision]?.decision === DECISIONS.APPROVED
  //   );
  // }

  // isApproved() {
  //   return (
  //     this.isStageApprover(
  //       'needSuperSecurityDecision',
  //       'superSecurityDecision'
  //     ) &&
  //     this.isStageApprover('needSecurityDecision', 'securityApprovers') &&
  //     this.request?.commanderDecision?.decision === DECISIONS.APPROVED
  //   );
  // }

  tooltipContent({ decisionObj = {}, sectionName = '', status = '' }) {
    let tooltip = null;
    const date = decisionObj.date
      ? new Date(parseInt(decisionObj.date))
      : undefined;
    const creationDate = this.request.createdAt
      ? new Date(parseInt(this.request.createdAt))
      : undefined;

    const isFailed = status === REQ_STATUSES.FAILED;

    if (true || decisionObj.decision !== DECISIONS.DECISION_UNKNOWN) {
      tooltip = (
        <div className={isFailed ? 'tooltip-failed' : 'tooltip'}>
          <ul className={isFailed ? 'inner-list-failed' : 'inner-list'}>
            {isFailed ? (
              <li className="display-flex items-wrap">
                <div className="item-failed">
                  <p>
                    <strong>הבקשה נכשלה מסיבה טכנית, נא לפנות לתמיכה!</strong>
                  </p>
                </div>
              </li>
            ) : sectionName === '' ? (
              <li className="display-flex items-wrap">
                <div className="item">
                  <p>
                    <span>
                      {creationDate && creationDate.toLocaleTimeString('en-GB')}
                    </span>
                    {creationDate && creationDate.toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="item">
                  <p>פתיחת בקשה</p>
                </div>
              </li>
            ) : (
              <li className="display-flex items-wrap">
                <div className="item">
                  <p>
                    <span>{date && date.toLocaleTimeString('en-GB')}</span>
                    {date && date.toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="item">
                  <p>
                    בקשה{' '}
                    {DECISIONS_TRANSLATE[decisionObj.decision] ||
                      'עוד לא הוחלטה'}{' '}
                    ע"י <br />
                    {sectionName}:{' '}
                    <strong>
                      {decisionObj?.approver?.displayName.split('/').pop()}
                    </strong>
                    <br />
                    <span>{decisionObj?.reason}</span>
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      );
    }

    return tooltip;
  }

  render() {
    return (
      <ModalContent>
        <div className="inner-wrap">
          <div className="scroll-wrap">
            <div className="display-flex top-row">
              <p>
                מס' בקשה
                <br />
                <strong>{this.request?.serialNumber}</strong>
              </p>
              <ul className="list">
                <li>
                  קבלת בקשה
                  {this.tooltipContent({})}
                </li>
                <li
                  className={`${
                    DECISIONS[this.request?.commanderDecision?.decision]
                  }`}
                >
                  גורם מאשר
                  {this.tooltipContent({
                    decisionObj: this.request?.commanderDecision,
                    sectionName: 'גורם מאשר',
                  })}
                </li>
                { this.request?.needAdminDecision ? (
                  <li
                    className={`${
                      DECISIONS[this.request?.adminDecision?.decision]
                    }`}
                  >
                    גורם מאשר מחשוב יחידתי 
                    {this.tooltipContent({
                      decisionObj: this.request?.adminDecision,
                      sectionName: 'גורם מאשר מחשוב יחידתי',
                    })}
                  </li>
                ) : null}
                {this.request?.needSecurityDecision ? (
                  <li
                    className={`${
                      DECISIONS[this.request?.securityDecision?.decision]
                    }`}
                  >
                    גורם מאשר יחב"ם
                    {this.tooltipContent({
                      decisionObj: this.request?.securityDecision,
                      sectionName: 'גורם מאשר יחב"ם',
                    })}
                  </li>
                ) : null}
                {this.request?.needSuperSecurityDecision ? (
                  <li
                    className={`${
                      DECISIONS[this.request?.superSecurityDecision?.decision]
                    }`}
                  >
                    גורם מאשר בטח"ם
                    {this.tooltipContent({
                      decisionObj: this.request?.superSecurityDecision,
                      sectionName: 'גורם מאשר בטח"ם',
                    })}
                  </li>
                ) : null}

                {this.request?.status === REQ_STATUSES.FAILED ? (
                  <li className={`${REQ_STATUSES[this.request?.status]}`}>
                    נכשל
                    {this.tooltipContent({ status: this.request?.status })}
                  </li>
                ) :  this.request?.status === REQ_STATUSES.DONE ? (
                  <li>בוצע</li>
                ) : null}
              </ul>
              <p>
                תאריך בקשה
                <br />
                <strong>
                  {getFormattedDate(this.request?.createdAt)}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </ModalContent>
    );
  }
}

export default RequestFlowChart;
