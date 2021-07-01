import { STATUSES } from '../constants';

const List = ({ list }) =>(
    <table className="tableStyle">
        <tbody>
            {list.map(({ id, createdAt, type, status }) => (
                <tr key={id}>
                    <td>
                        <div className="td-inner">
                            {createdAt}
                        </div>
                    </td>
                    <td>
                        <div className="td-inner">
                            {type}
                        </div>
                    </td>
                    <td>
                        <div className="td-inner td-inner-btn">
                            <button className={'btn-status ' + (status === STATUSES.SENT ? 'btn-sent' : ' btn-rejected')} type="button" title={status}>
                                {status}
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default List;