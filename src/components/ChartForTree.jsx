import React from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Tree } from 'primereact/tree';
import { Toast } from 'primereact/toast';
import { getOGChildren } from '../service/KartoffelService';


class ChartForTree extends React.Component {
    // TODO: Show the loading icon in overlay above the tree
    // TODO: Fix the overflow-x scroll when there's many children
    // TODO: Fix the text out of bounds when there's many children

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            nodes: null,
            selectedNodeKey: null,
            selectedNode: null,
            checked: false,
        };
    }

    async componentDidMount() {
        const groupsUnderAman = await this.getDirectGroupChildren();

        this.setState({
            nodes: this.mapGroupsToNodes(groupsUnderAman),
            loading: false
        });
    }

    getDirectGroupChildren = async (groupId) => {
        const response = await getOGChildren(groupId, true);
        return response.groups;
    }

    mapGroupsToNodes = (groups) => {
        const nodes = [];

        for (let index = 0; index < groups.length; index++) {
            nodes.push({
                key: index.toString(),
                label: groups[index].name,
                data: groups[index],
                leaf: false
            });
        }

        return nodes;
    }

    getNodeByKey(nodes, key) {
        let treePath = key.split('-');

        let currNode = nodes[parseInt(treePath[0], 10)];

        for (let index = 1; index < treePath.length; index++) {
            currNode = currNode.children[parseInt(treePath[index], 10)];
        }

        return currNode;
    }

    /**
     * Updates the full tree object with new node at location retrieves by the key property.
     * 
     * Each node has key in the following manner:
     * key: indexLevel-indexLevel-...-indexLevel
     * 
     * Where indexLevel is the index in the array from the top nodes array.
     * In that way we can travel across the tree without problem.
     */
     updateFullTree(nodes, newNode) {

        // Get array of index path through the tree
        let treePath = newNode.key.split('-');

        // Duplicate current nodes state and selecting the updated branch in the tree
        let newNodes = [...nodes];
        let updatedBranch = newNodes[parseInt(treePath[0], 10)];
        let currNodeRef = updatedBranch;

        if (treePath.length < 2) {
            newNodes[parseInt(treePath[0], 10)] = newNode;
        } else {

            // Traversing the tree until reaching the node to update
            for (let index = 1; index < treePath.length - 1; index++) {
                currNodeRef = currNodeRef.children[parseInt(treePath[index], 10)];
            }

            // Update the last node which is the new node in the whole duplicated tree by reference.
            currNodeRef.children[parseInt(treePath[treePath.length - 1], 10)] = newNode;

            // Update the branch in the nodes tree
            newNodes[parseInt(treePath[0], 0)] = updatedBranch;
        }
        
        return newNodes;
    }

    nodeTemplate = (node, options) => {
        let label = <span>{node.label}</span>;
        let data = <span>{node.data}</span>;

        return (
            <div className={options.className}>
                <div className="p-field-checkbox">
                    <Checkbox 
                        inputId={"binary"}
                        value={node.key}
                        checked={node.key === this.state.selectedNodeKey}
                        onChange={(event) => this.selectNode(event.value)}
                    />
                    <label htmlFor="binary">{label}</label>
                </div>
            </div>
        )
    }

    async expandMoreNodes(event) {
        if (!event.node.children) {
            this.setState({
                loading: true
            });

            let currentNode = { ...event.node, children: [] };

            const nodeChildren = await this.getDirectGroupChildren('615a0bb3bc71c74638d25914');

            if (nodeChildren.length === 0) {
                currentNode.leaf = true;
            }

            for (let index = 0; index < nodeChildren.length; index++) {
                currentNode.children.push({
                    key: currentNode.key + '-' + index.toString(),
                    label: nodeChildren[index].name,
                    data: nodeChildren[index],
                    leaf: false,
                });
            }

            let updateSearchNodes = this.updateFullTree(this.state.nodes, currentNode);

            this.setState({
                nodes: updateSearchNodes,
                loading: false
            });
        }
    }

    selectNode(nodeKey) {
        const nodeSelected = this.getNodeByKey(this.state.nodes, nodeKey);

        if (this.props.onSelectNode && typeof this.props.onSelectNode === 'function') {
            this.props.onSelectNode(nodeSelected.data);
        }

        this.setState({
            selectedNodeKey: nodeKey,
            selectedNode: nodeSelected
        });
    }

    render() {

        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <div className="card">
                    <Tree
                        propagateSelectionUp={false}
                        propagateSelectionDown={false}
                        loading={this.state.loading}
                        nodeTemplate={this.nodeTemplate}
                        value={this.state.nodes}
                        onExpand={async (event) => await this.expandMoreNodes(event)}
                        selectionMode="single"
                        selectionKeys={this.state.selectedNodeKey}
                        onSelectionChange={(event) => this.selectNode(event.value)}
                    />
                </div>
            </div>
        );
    }
}

export default ChartForTree
