import React from 'react';

class Action extends React.Component {

    state = {
        actionList: []
    }

    componentDidMount() {
        this.setState({
            actionList: [
                { id: "1", className: "btn-actions btn-actions1", actionName: "תפקיד חדש" },
                { id: "2", className: "btn-actions btn-actions2", actionName: "שינוי היררכיה" },
                { id: "3", className: "btn-actions btn-actions3", actionName: "מעבר תפקיד" },
                { id: "4", className: "btn-actions btn-actions4", actionName: "הוספת משתמש" },
                { id: "5", className: "btn-actions btn-actions5", actionName: "היררכיה חדשה" },
                { id: "6", className: "btn-actions btn-actions6", actionName: "גורם מאשר" },
            ]
        })
    }



    render() {

        const { actionList } = this.state
        return (
            <ul class="display-flex units-wrap">
                {actionList.map(({ id, className, actionName }) => (
                    <li key={id}>

                        <button className={className} title={actionName} type="button">
                            <div class="decoration">
                                <div class="img"></div>
                            </div>
                            <p>{actionName}</p>
                        </button>

                    </li>
                ))}
            </ul>
        );
    }
}



export default Action
