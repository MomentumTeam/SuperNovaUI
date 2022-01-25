import { OrganizationChart } from 'primereact/organizationchart';
import '../assets/css/local/components/chart.min.css';
import { ProgressSpinner } from 'primereact/progressspinner';

const HierarchyTree = ({ data, isTreeLoading }) => {
  const refAssignCallback = (ref) => {
    if (ref) {
      //the containerRef is currently null, ref available = mounted.
      var element = ref;
      var scrollWidth = element.scrollWidth;
      var clientWidth = element.getBoundingClientRect().width;

      //explicitly set the scrollTop position of the scrollContainer
      element.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  };

  return (
    <div
      ref={refAssignCallback}
      style={{ overflowX: 'auto', overflowY: 'hidden' }}
    >
      {isTreeLoading ? (
        <ProgressSpinner className="tree-loading-spinner" />
      ) : (
        <OrganizationChart selectionMode="multiple" value={data} />
      )}
    </div>
  );
};

export default HierarchyTree;
