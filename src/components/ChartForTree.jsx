import React from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Tree } from 'primereact/tree';
import { Toast } from 'primereact/toast';
import { getTree } from '../service/TreeService';


class ChartForTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: null,
            selectedKey: null,
            selectedKeys1: null,
            selectedKeys2: null,
            selectedKeys3: null,
            checked: false,
            cities: [],

        };

        // this.nodeService = new NodeService();
        this.onNodeSelect = this.onNodeSelect.bind(this);
        this.onNodeUnselect = this.onNodeUnselect.bind(this);
        this.nodeTemplate = this.nodeTemplate.bind(this);
    }

    componentDidMount() {
        getTree().then(data => this.setState({ nodes: data }));
    }

    onNodeSelect(node) {
        this.toast.show({ severity: 'success', summary: 'Node Selected', detail: node.label, life: 3000 });
    }

    onNodeUnselect(node) {
        this.toast.show({ severity: 'success', summary: 'Node Unselected', detail: node.label, life: 3000 });
    }


    nodeTemplate(node, options) {
        let label = <span>{node.label}</span>;
        let data = <span>{node.data}</span>;
        return (
            <div className={options.className}>
                <p className="title"> {label}</p>
                <div className="p-field-checkbox">
                    <Checkbox inputId={"binary"} checked={this.state.checked} onChange={e => this.setState({ checked: e.checked })} />
                    <label htmlFor="binary">{label}</label>
                </div>
                <p className="number"> {data}</p>
            </div>
        )
    }

    render() {

        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <div className="card">

                    <Tree nodeTemplate={this.nodeTemplate} value={this.state.nodes} selectionMode="multiple" selectionKeys={this.state.selectedKeys1} onSelectionChange={e => this.setState({ selectedKeys1: e.value })} />

                </div>
            </div>
        )
    }
}

export default ChartForTree
