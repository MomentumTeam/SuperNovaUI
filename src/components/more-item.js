import React from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
class MoreItem extends React.Component {


    constructor(props) {
        super(props);

        this.items = [
            {

                items: [
                    {
                        label: 'צפייה',
                        command: () => {
                            this.toast.show({ severity: 'success', summary: 'צפייה', detail: 'Data Viewing', life: 3000 });
                        }
                    },
                    {
                        label: 'עריכת תפקיד',
                        command: () => {
                            this.toast.show({ severity: 'success', summary: 'עריכת תפקיד', detail: 'Data Editing a role', life: 3000 });
                        }
                    }
                    ,
                    {
                        label: 'מחיקה',
                        command: () => {
                            this.toast.show({ severity: 'success', summary: 'מחיקה', detail: 'Data Request permission', life: 3000 });
                        }
                    }
                ]
            }
        ];
    }

    render() {



        return (
            <div className="moreBtnwrap">
                <Toast ref={(el) => { this.toast = el; }}></Toast>
                <Menu model={this.items} popup ref={el => this.menu = el} id="popup_menu" />
                <Button className="btn more-btn" label="Show" onClick={(event) => this.menu.toggle(event)} aria-controls="popup_menu" aria-haspopup />
            </div>
        );
    }
}






export default MoreItem