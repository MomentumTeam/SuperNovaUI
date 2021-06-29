import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import ModalForm from './modal-form';
import '../assets/css/local/components/modal-item.min.css';
class Action extends React.Component {
    state = {
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

    constructor(props) {
        super(props);
        this.state = {
            displayResponsive: false,
            position: 'center',
            actionList: []
        };

        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);

    }

    onClick(name, position) {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    renderFooter(name) {
        return (
            <div className="display-flex display-flex-end">
                <Button label="ביטול" onClick={() => this.onHide(name)} className="btn-underline" />
                <Button label="שמירה" onClick={() => this.onHide(name)} className="btn-orange-gradient" />
            </div>
        );
    }

    render() {

        const { actionList } = this.state
        return (
            <ul className="display-flex units-wrap">

                {actionList.map(({ id, className, actionName }) => (
                    <li key={id}>
                        <Button className={className} title={actionName} label={actionName} onClick={() => this.onClick('displayResponsive')} />
                        <Dialog header="תפקיד חדש" visible={this.state.displayResponsive} onHide={() => this.onHide('displayResponsive')} footer={this.renderFooter('displayResponsive')}>
                            <ModalForm />
                        </Dialog>
                    </li>
                ))}
            </ul>
        );
    }
}

export default Action;