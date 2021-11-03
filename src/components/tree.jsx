import exp from "constants";
import React from "react";
import { Tree, TreeNode} from 'react-organizational-chart'
import styled from 'styled-components';

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid red;
`;

// const ExampleTree = () => (
//     <Tree label={<div>Root</div>}>
//       <TreeNode label={<div>Child 1</div>}>
//         <TreeNode label={<div>Grand Child</div>} />
//       </TreeNode>
//     </Tree>
//   );

const StyledTreeExample = (props) => (
  <Tree
    lineWidth={'2px'}
    lineColor={'green'}
    lineBorderRadius={'10px'}
    label={<StyledNode>{props.data.one}</StyledNode>}
  >
    <TreeNode label={<StyledNode>{props.data.two}</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child</StyledNode>} />
    </TreeNode>
    <TreeNode label={<StyledNode>Child 2</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child</StyledNode>}>
        <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
        <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
      </TreeNode>
    </TreeNode>
    <TreeNode label={<StyledNode>Child 3</StyledNode>}>
      <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
      <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
    </TreeNode>
  </Tree>
);

export default StyledTreeExample;