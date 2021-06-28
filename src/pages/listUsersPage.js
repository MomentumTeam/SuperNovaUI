import React from 'react';
import Serch from '../components/serch';
import Table from '../components/table';
import { Dropdown } from 'primereact/dropdown';
import '../assets/css/local/pages/listUsersPage.min.css';
class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedState: null
        };

        this.states = [
            { name: 'מספר1', code: 'מספר1' },
            { name: 'מספר2', value: 'מספר2' },
            { name: 'מספר3', code: 'מספר3' },
            { name: 'מספר4', code: 'מספר4' },
            { name: 'מספר5', code: 'מספר5' }
        ];

        this.onStateChange = this.onStateChange.bind(this);
    }



    onStateChange(e) {
        this.setState({ selectedState: e.value });
    }

    render() {

        return (
            // 
            <React.Fragment>
                <div className="main-inner-item main-inner-item2 main-inner-item2-table">
                    <div className="main-inner-item2-content">
                        <div className="display-flex title-wrap">
                            <div className="display-flex h-wrap">
                                <h2>רשימת משתמשים</h2>
                                <h3>רשימת קבוצות</h3>
                            </div>
                            <div className="display-flex display-flex-end btns-wrap">
                                <button className="btn btn-notification" title="Notification" type="button">
                                    <span className="for-screnReader">Notification</span>
                                </button>
                                <button className="btn btn-humburger" title="Humburger" type="button">
                                    <span className="for-screnReader">Humburger</span>
                                </button>
                            </div>
                        </div>
                        <div className="content-unit-wrap">
                            <div className="content-unit-inner">
                                <div className="display-flex search-row-wrap-flex">
                                    <div className="search-row">
                                        <div className="search-row-inner search-row-inner-flex">
                                            <button className="btn btn-change-view-chart" title="Change View to Chart" type="button"><span className="for-screnReader">Change View to Chart</span></button>
                                            <Serch />
                                            <button className="btn-underline" type="button" title="חיפוש מורחב">חיפוש מורחב</button>
                                        </div>
                                    </div>
                                    <button className="btn-add-user" title="הוספת משתמש" type="button">
                                        <div className="decoration"><div className="img"></div></div>
                                        <p>הוספת משתמש</p>
                                    </button>
                                </div>
                                <Table></Table>

                                <div className="display-flex btns-wrap">
                                    <div className="display-flex inner-flex">
                                        <button className="btn btn-print" title="Print" type="button"><span className="for-screnReader">Print</span></button>
                                        <button className="btn btn-export" title="Export" type="button"><span className="for-screnReader">Export</span></button>

                                        <div className="p-fluid">

                                            <div className="p-fluid-item">
                                                <div className="display-flex pad0 p-field">
                                                    <label htmlFor="6000">
                                                        נבחרו:
                                                        <span>0</span>
                                                    </label>
                                                    <Dropdown inputId="6000" value={this.state.selectedState} options={this.states} onChange={this.onStateChange} placeholder="שינוי תפקיד" optionLabel="name" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="display-flex inner-flex">
                                        <button className="btn-underline" type="button" title="ביטול">
                                            ביטול
                                        </button>
                                        <button className="btn-orange-gradient" type="button" title="שמירה">
                                            שמירה
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}



export default Dashboard