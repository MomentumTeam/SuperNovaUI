import React from 'react';

import { OrganizationChart } from 'primereact/organizationchart';
import '../assets/css/local/components/chart.min.css';
class Chart extends React.Component {





    render() {
        const data = [{

            label: 'ספיר',
            expanded: true,
            children: [
                {
                    label: 'יחידה 1',
                    className: 'style2',
                    expanded: true,
                    children: [
                        {
                            label: 'יחידה 2',
                        },
                        {
                            label: 'יחידה 2',

                        }
                    ]
                },
                {
                    label: '8200',
                    expanded: true,
                    children: [
                        {
                            label: 'יחידה 2',
                        },
                        {
                            label: 'יחידה 2',
                        }
                    ]
                }
            ]
        }];
        return (
            <OrganizationChart value={data}></OrganizationChart>
        )
    }
}



export default Chart
