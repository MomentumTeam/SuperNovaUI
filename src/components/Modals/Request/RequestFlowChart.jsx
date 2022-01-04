import React from 'react';
import {
  DECISIONS,
  DECISIONS_TRANSLATE,
} from '../../../constants/decisions.js';
import { ModalContent } from '../../RequestFlowChart.styles.js';

class RequestFlowChart extends React.Component {
  constructor(props) {
    super(props);
    this.request = props?.request || {};
    this.state = {};
  }

  isStageApprover(stageDecision, mustHaveDecision) {
    return (
      !this?.request[stageDecision] ||
      this?.request[mustHaveDecision]?.decision === DECISIONS.APPROVED
    );
  }

  isApproved() {
    // console.log(this.request);
    // console.log(
    //   '1',
    //   this.isStageApprover('needSuperSecurityDecision', 'superSecurityDecision')
    // );
    // console.log(
    //   '2',
    //   this.isStageApprover('needSecurityDecision', 'securityApprovers')
    // );
    // console.log(
    //   '3',
    //   this.request?.commanderDecision?.decision === DECISIONS.APPROVED
    // );
    return (
      this.isStageApprover(
        'needSuperSecurityDecision',
        'superSecurityDecision'
      ) &&
      this.isStageApprover('needSecurityDecision', 'securityApprovers') &&
      this.request?.commanderDecision?.decision === DECISIONS.APPROVED
    );
  }

  tooltipContent(decisionObj = {}, sectionName = '') {
    let tooltip = null;
    const date = decisionObj.date
      ? new Date(parseInt(decisionObj.date))
      : undefined;
    const creationDate = this.request.createdAt
      ? new Date(parseInt(this.request.createdAt))
      : undefined;

    if (true || decisionObj.decision !== DECISIONS.DECISION_UNKNOWN) {
      tooltip = (
        <div className="tooltip">
          <ul className="inner-list">
            {sectionName === '' ? (
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
                  {this.tooltipContent()}
                </li>
                <li
                  className={`${
                    DECISIONS[this.request?.commanderDecision?.decision]
                  }`}
                >
                  גורם מאשר
                  {this.tooltipContent(
                    this.request?.commanderDecision,
                    'גורם מאשר'
                  )}
                </li>
                {this.request?.needSecurityDecision ? (
                  <li
                    className={`${
                      DECISIONS[this.request?.securityDecision?.decision]
                    }`}
                  >
                    גורם מאשר יחב"ם
                    {this.tooltipContent(
                      this.request?.securityDecision,
                      'גורם מאשר יחב"ם'
                    )}
                  </li>
                ) : null}
                {this.request?.needSuperSecurityDecision ? (
                  <li
                    className={`${
                      DECISIONS[this.request?.superSecurityDecision?.decision]
                    }`}
                  >
                    גורם מאשר בטח"ם
                    {this.tooltipContent(
                      this.request?.superSecurityDecision,
                      'גורם מאשר בטח"ם'
                    )}
                  </li>
                ) : null}
                {this.isApproved() ? <li>בוצע</li> : null}
              </ul>
              <p>
                תאריך בקשה
                <br />
                <strong>
                  {new Date(
                    parseInt(this.request?.createdAt)
                  )?.toLocaleDateString()}
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
