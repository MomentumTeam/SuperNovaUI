import React from 'react';
import Action from '../components/action';
import ItemsList from '../components/items-list';
import Serch from '../components/serch';
import logo from '../assets/images/logo.png';
import userpic from '../assets/images/userpic.png';
import graf from '../assets/images/graf.png';
class Dashboard extends React.Component {
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
            // 
            <React.Fragment>
                <div class="main-inner-item main-inner-item2">
                    <div class="main-inner-item2-content">
                        <div class="display-flex title-wrap">
                            <h2>
                                פרטים אישיים
                            </h2>
                            <h1>
                                <img src={logo} alt="Logo יסודות" />
                            </h1>
                        </div>
                        <div class="personal-information-wrap">
                            <div class="display-flex personal-information-inner">
                                <div class="personal-information-item">
                                    <div class="userpic-wrap">
                                        <img src={userpic} alt="userpic" />
                                    </div>
                                </div>
                                <div class="personal-information-item">
                                    <dl>
                                        <dt>שם</dt>
                                        <dd>לירן עזרא</dd>
                                    </dl>
                                    <dl>
                                        <dt>מ"א</dt>
                                        <dd>45808006</dd>
                                    </dl>
                                </div>
                                <div class="personal-information-item">
                                    <dl>
                                        <dt>תפקיד</dt>
                                        <dd>
                                            <a href="#" class="" title="צלם מומחה1">
                                                צלם מומחה1
                                            </a>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>היררכיה</dt>
                                        <dd>אמן <span>/</span> ספיר <span>/</span> צוותצילום <span>/</span> תכניתנית3
                                        </dd>
                                    </dl>
                                </div>
                                <div class="personal-information-item">
                                    <dl>
                                        <dt>טלפון</dt>
                                        <dd class="no-wrap">054-4769588</dd>
                                    </dl>
                                    <dl>
                                        <dt>תק"ש</dt>
                                        <dd>12/12/22</dd>
                                    </dl>
                                </div>
                                <div class="personal-information-item">
                                    <dl>
                                        <dt>מייל</dt>
                                        <dd>
                                            <a href="mailto:iron@dynaamic.com" class="" title="צלם מומחה1">
                                                iron@dynaamic.com
                                            </a>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>כתובת</dt>
                                        <dd>עליזה בגין 8 ראשלצ</dd>
                                    </dl>
                                </div>
                                <div class="personal-information-item">
                                    <button class="btn-green-gradient btn-full-details" type="button"
                                        title="פרטים מלאים">
                                        פרטים מלאים
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="search-unit-wrap">
                            <div class="search-unit-inner">
                                <Serch />
                                <div class="graf">
                                    <img src={graf} alt="graf" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-inner-item main-inner-item3">
                    <div class="main-inner-item3-content">
                        <div class="display-flex display-flex-end btns-wrap">
                            <button class="btn btn-notification" title="Notification" type="button">
                                <span class="for-screnReader">Notification</span>
                            </button>
                            <button class="btn btn-humburger" title="Humburger" type="button">
                                <span class="for-screnReader">Humburger</span>
                            </button>
                        </div>

                        <div class="actions-inner-wrap">
                            <h2>פעולות</h2>
                            <Action />
                        </div>

                        <div class="requests-inner-wrap">
                            <div class="display-flex title-wrap">
                                <h2>בקשות שלי</h2>
                                <a href="#" class="" title="הכל - נפתך בחלון חדש">
                                    הכל
                                </a>
                            </div>
                            <div class="table-item-wrap">
                                <div class="table-item-inner">
                                    <ItemsList list={requestList}>  </ItemsList>
                                </div>
                            </div>
                        </div>


                        <div class="messages-inner-wrap">
                            <div class="display-flex title-wrap">
                                <h2>הודעות</h2>
                                <a href="#" class="" title="הכל - נפתך בחלון חדש">
                                    הכל
                                </a>
                            </div>
                            <div class="table-item-wrap">
                                <div class="table-item-inner">
                                    <ItemsList list={messagesList}>  </ItemsList>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

//ReactDom.render(<Dashboard />, document.getElementById('root'));

export default Dashboard