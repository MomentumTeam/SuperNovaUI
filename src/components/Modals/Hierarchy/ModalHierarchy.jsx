import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import ChartForTree from '../../ChartForTree';

class ModalHierarchy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayBasic: false,
      displayBasic2: false,
      displayModal: false,
      displayMaximizable: false,
      displayPosition: false,
      displayResponsive: false,
      position: 'center',

      selectedHierarchy: null,
      visible: false,
    };
  }

  toggleModalVisibility = (visible) => {
    this.setState({
      visible,
    });
  };

  closeModalWithData = (sendDataBack) => {
    if (sendDataBack && this.state.selectedHierarchy) {
      if (
        this.props.onSelectHierarchy &&
        typeof this.props.onSelectHierarchy === 'function'
      ) {
        this.props.onSelectHierarchy(this.state.selectedHierarchy);
      }
    }

    this.toggleModalVisibility(false);
  };

  renderFooter = () => {
    return (
      <div className="display-flex display-flex-end">
        <Button
          label="ביטול"
          onClick={() => this.closeModalWithData(false)}
          className="btn-underline"
        />
        <Button
          label="בחירה"
          onClick={() => this.closeModalWithData(true)}
          className="btn-gradient orange"
        />
      </div>
    );
  };

  setHierarchySelected = (hierarchy) => {
    this.setState({
      selectedHierarchy: hierarchy,
    });
  };

  render() {
    return (
      <div>
        <Button
          className={
            this.props.isDisplay
              ? 'btn-border hierarchyBtn'
              : 'OpeningHierarchy'
          }
          title="פתיחת עץ היררכיה"
          type="button"
          onClick={() => this.toggleModalVisibility(true)}
          style={this.props.disabled && { display: 'none' }}
        />

        <Dialog
          className="dialogClass9"
          header="היררכיה"
          dismissableMask={true}
          visible={this.state.visible}
          footer={this.renderFooter()}
          onHide={() => this.toggleModalVisibility(false)}
        >
          <div>
            <div>
              <ChartForTree
                onSelectNode={this.setHierarchySelected}
                userHierarchy={this.props.userHierarchy}
                isDisplay={this.props.isDisplay}
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
export default ModalHierarchy;
