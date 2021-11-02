import styled from "styled-components";

const StyledMoveToProcessing = styled.div`
  position: relative;
  .more-btn {
    left: 19px;
  }
`;

const StyledHiddenArea = styled.div`
  position: absolute;
  transform-origin: center top;
  top: 40px;
  left: 40px;
  background: #ffffff;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 35px 30px;
  z-index: 1001;
  min-width: 353px;

  .btn-underline {
    margin-left: 10px;
  }
`;

const TableHiddenArea = () =>{

}

export {TableHiddenArea};