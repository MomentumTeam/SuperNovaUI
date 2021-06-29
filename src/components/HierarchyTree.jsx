import { OrganizationChart } from 'primereact/organizationchart';
import '../assets/css/local/components/chart.min.css';

const HierarchyTree = ({data}) => (
    <OrganizationChart value={data} />
);

export default HierarchyTree;
