import { useRef } from 'react';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const Notifications = ({notifications}) => {
    const op = useRef(null);

    return (
    <div className='display-flex display-flex-end btns-wrap'>
        <button
            className='btn btn-notification p-mr-4'
            title='Notification'
            type='button'
            onClick={(e) => op.current.toggle(e)}
        >
            {
                notifications?.length > 0 &&
                <Badge
                value={notifications.length}
                style={{position: 'relative', top: '1.2rem', left: '1.2rem'}}
                />
            }
        </button>
        <OverlayPanel ref={op} id="overlay_panel" style={{width: '450px'}} className="overlaypanel-demo">
            <DataTable value={notifications} selectionMode="single" paginator rows={5} paginatorClassName="notificationPaginator">
                <Column field="type" header="סוג" />
                <Column field="message" header="תוכן" />
                <Column field="reason" header="סיבה" />
            </DataTable>
        </OverlayPanel>
    </div>
    )
};

export default Notifications;