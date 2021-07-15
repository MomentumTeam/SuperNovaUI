import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import MoreItem from "./TableActions";
import { getUsers } from "../../service/UserService";

import "../../assets/css/local/general/table.min.css";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCustomers: null,
      entities: [],
    };

    console.log(props.data.entities);

    //body cells
    this.firstNameBodyTemplate = this.firstNameBodyTemplate.bind(this);
    this.lastNameBodyTemplate = this.lastNameBodyTemplate.bind(this);
    this.idNumBodyTemplate = this.idNumBodyTemplate.bind(this);
    this.classificationBodyTemplate =
      this.classificationBodyTemplate.bind(this);
    this.roleBodyTemplate = this.roleBodyTemplate.bind(this);
    this.userBodyTemplate = this.userBodyTemplate.bind(this);
    this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
    this.roleBodyTemplate = this.roleBodyTemplate.bind(this);
    this.unityBodyTemplate = this.unityBodyTemplate.bind(this);
    this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
  }

  actionBodyTemplate() {
    return <MoreItem></MoreItem>;
  }

  firstNameBodyTemplate(rowData) {
      console.log('row data', rowData)
    return (
      <React.Fragment>
        <span className="p-column-title">שם פרטי:</span>
        <span
          className={classNames(
            "customer-badge",
            "status-" + rowData.firstName
          )}
        >
          {rowData.firstName}
        </span>
      </React.Fragment>
    );
  }

  lastNameBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">שם משפחה:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.lastName)}
        >
          {rowData.lastName}
        </span>
      </React.Fragment>
    );
  }

  idNumBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">מ"א / ת"ז:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.personalNumber)}
        >
          {rowData.personalNumber}
        </span>
      </React.Fragment>
    );
  }

  classificationBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">סיווג:</span>
        <span
          className={classNames(
            "customer-badge",
            "status-" + rowData.clearance
          )}
        >
          {rowData.clearance}
        </span>
      </React.Fragment>
    );
  }

  roleBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">תפקיד:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.jobTitle)}
        >
          {rowData.jobTitle}
        </span>
      </React.Fragment>
    );
  }

  userBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">יוזר:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.displayName)}
        >
          {rowData.displayName}
        </span>
      </React.Fragment>
    );
  }

  statusBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">סטטוס:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.status)}
        >
          {rowData.status}
        </span>
      </React.Fragment>
    );
  }

  unityBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">יחידה:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.hierarchy)}
        >
          {rowData.hierarchy}
        </span>
      </React.Fragment>
    );
  }

  userTypeBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">סוג משתמש:</span>
        <span
          className={classNames("customer-badge", "status-" + rowData.rank)}
        >
          {rowData.rank}
        </span>
      </React.Fragment>
    );
  }

  componentDidMount() {
    console.log(this.props.data.entities, "this is the props");
    // this.setState({ entities: [...entitiesArray] });
    // this.setState({ 
    //     entities: 
    //   })
    this.state.entities = this.props.data.entities
      
    // this.setState({ entities: entitiesArray})
    console.log("this is the entities", this.state.entities);
  }

  render() {
    return (
      <div className="table-wrapper">
        <div className="tableStyle">
          <div className="card">
            <DataTable
              value={this.props.data.entities}
              scrollable
              selection={this.state.selectedCustomers}
              onSelectionChange={(e) =>
                this.setState({ selectedCustomers: e.value })
              }
            >
              <Column selectionMode="multiple" style={{ width: "3em" }} />

              <Column
                field="firstName"
                header="שם פרטי"
                body={this.firstNameBodyTemplate}
                sortable
              ></Column>
              <Column
                field="lastName"
                header="שם משפחה"
                body={this.lastNameBodyTemplate}
                sortable
              ></Column>
              <Column
                field="idNum"
                header='מ"א / ת"ז'
                body={this.idNumBodyTemplate}
                sortable
              ></Column>
              <Column
                field="classification"
                header="סיווג"
                body={this.classificationBodyTemplate}
                sortable
              ></Column>
              <Column
                field="role"
                header="תפקיד"
                body={this.roleBodyTemplate}
                sortable
              ></Column>
              <Column
                field="user"
                header="יוזר"
                body={this.userBodyTemplate}
                sortable
              ></Column>
              <Column
                field="status"
                header="סטטוס"
                body={this.statusBodyTemplate}
                sortable
              ></Column>
              <Column
                field="unity"
                header="יחידה"
                body={this.unityBodyTemplate}
                sortable
              ></Column>
              <Column
                field="userType"
                header="סוג משתמש"
                body={this.userTypeBodyTemplate}
                sortable
              ></Column>
              <Column
                body={this.actionBodyTemplate}
                headerStyle={{ width: "4em", textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
              />
            </DataTable>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
