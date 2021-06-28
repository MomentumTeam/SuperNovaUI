import React from 'react';
import Action from '../components/action';
import ItemsList from '../components/items-list';

import '../assets/css/local/components/aside.min.css';
class Aside extends React.Component {


    state = {
        requestList: [],
        messagesList: []
    }
    componentDidMount() {
        this.setState({
            requestList: [
                { id: "1", date: "28/05/21", description: "בקשה ליצירת תפקיד חדש", status: "נשלחה" },
                { id: "2", date: "28/05/21", description: "בקשה לשינוי היררכיה", status: "נשלחה" },
                { id: "3", date: "28/05/21", description: "בקשה למעבר תפקיד", status: "נדחתה" },
                { id: "4", date: "28/05/21", description: "btn-actions", status: "נדחתה" },
            ],

            messagesList: [
                { id: "1", date: "28/05/21", description: "בקשה ליצירת תפקיד חדש", status: "נשלחה" },
                { id: "2", date: "28/05/21", description: "בקשה לשינוי היררכיה", status: "נשלחה" },
                { id: "3", date: "28/05/21", description: "בקשה למעבר תפקיד", status: "נדחתה" },
                { id: "4", date: "28/05/21", description: "btn-actions", status: "נדחתה" },
            ]
        })
    }


    render() {
        const { requestList, messagesList } = this.state
        return (
            <div className="main-inner-item main-inner-item3">
                <div className="main-inner-item3-content">
                    <div className="display-flex display-flex-end btns-wrap">
                        <button className="btn btn-notification" title="Notification" type="button">
                            <span className="for-screnReader">Notification</span>
                        </button>
                        <button className="btn btn-humburger" title="Humburger" type="button">
                            <span className="for-screnReader">Humburger</span>
                        </button>
                    </div>

                    <div className="actions-inner-wrap">
                        <h2>פעולות</h2>

                        <Action />
                    </div>

                    <div className="requests-inner-wrap">
                        <div className="display-flex title-wrap">
                            <h2>בקשות שלי</h2>
                            <a href="#" title="הכל - נפתך בחלון חדש">
                                הכל
                            </a>
                        </div>
                        <div className="table-item-wrap">
                            <div className="table-item-inner">
                                <ItemsList list={requestList}>  </ItemsList>
                            </div>
                        </div>
                    </div>


                    <div className="messages-inner-wrap">
                        <div className="display-flex title-wrap">
                            <h2>הודעות</h2>
                            <a href="#" title="הכל - נפתך בחלון חדש">
                                הכל
                            </a>
                        </div>
                        <div className="table-item-wrap">
                            <div className="table-item-inner">
                                <ItemsList list={messagesList}>  </ItemsList>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}



export default Aside
