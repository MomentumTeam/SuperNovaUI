/** @format */

import { OrganizationChart } from 'primereact/organizationchart';
import '../assets/css/local/components/chart.min.css';

const HierarchyTree = ({ data }) => (
  <OrganizationChart selectionMode='single' value={data} />
);

export default HierarchyTree;
