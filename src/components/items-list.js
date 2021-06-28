import React from 'react';

class ItemsList extends React.Component {


    render() {
        return (
            <table className="tableStyle">
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>תיאור</th>
                        <th>סטטוס</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.list.map(({ id, date, description, status }) => (
                        <tr key={id}>
                            <td data-th="תאריך" >
                                <div className="td-inner">
                                    {date}
                                </div>
                            </td>
                            <td data-th="תיאור" >
                                <div className="td-inner">
                                    {description}
                                </div>
                            </td>

                            <td data-th="סטטוס">
                                <div className="td-inner td-inner-btn">
                                    <button className={'btn-status ' + (status === 'נשלחה' ? 'btn-sent' : ' btn-rejected')} type="button"
                                        title={status}>
                                        {status}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}



export default ItemsList
