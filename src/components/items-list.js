import React from 'react';

class ItemsList extends React.Component {





    render() {
        return (
            <table class="tableStyle">
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
                            <td data-th="תאריך" class="">
                                <div class="td-inner">
                                    {date}
                                </div>
                            </td>
                            <td data-th="תיאור" class="">
                                <div class="td-inner">
                                    {description}
                                </div>
                            </td>

                            <td data-th="סטטוס">
                                <div class="td-inner td-inner-btn">
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
