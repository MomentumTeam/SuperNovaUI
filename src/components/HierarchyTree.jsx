import { OrganizationChart } from "primereact/organizationchart";
import "../assets/css/local/components/chart.min.css";
import { updateNode } from "../service/TreeService";

const HierarchyTree = ({ data }) => (
  <OrganizationChart
    selectionMode="single"
    onSelectionChange={(event) => {
      console.log("onSelectionChange");
    }}
    onNodeUnselect={(event) => {
      console.log("onNodeUnselect");
    }}
    onNodeSelect={(event) => {
      console.log("onNodeSelect");
    }}
    value={data}
  />
);

export default HierarchyTree;
