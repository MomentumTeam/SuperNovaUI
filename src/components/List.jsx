import { STATUSES, TYPES } from '../constants';
import datesUtil from '../utils/dates';

const List = ({ list }) => {
    return (
    <table className="tableStyle">
        <tbody>
            {list.map(({ id, createdAt, type, status }) => (
                <tr key={id}>
                    <td>
                        <div className="td-inner">
                            {datesUtil.formattedDate(Number(createdAt))}
                        </div>
                    </td>
                    <td>
                        <div className="td-inner">
                            {TYPES[type]}
                        </div>
                    </td>
                    <td>
                        <div className="td-inner td-inner-btn">
                            <button className={'btn-status ' + (status === STATUSES.SENT ? 'btn-sent' : ' btn-rejected')} type="button">
                                {STATUSES[status]}
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)};

export default List;