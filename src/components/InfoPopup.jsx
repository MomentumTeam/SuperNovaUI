import React from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import img from "../assets/images/info-icon.svg";

const InfoIcon = styled.div`
  background-color: transparent;
  width: 19px;
  height: 19px;
  background-size: contain;
  opacity: 1;
  margin: 0 10px;
  background-image: url(${img});
  position: relative;
`;

const StyledReactTooltip = styled(ReactTooltip)`
  background-color: white !important;
  color: black !important;
  max-width: 380px;
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.25);
  opacity: 0.95 !important;
`;

const mapToParagraphsWithNewLines = (text, withTitle) =>
  text.split("\n").map((str, index) => (
    <p
      key={index}
      style={{
        fontWeight: index === 0 && withTitle ? "900" : "normal",
        textAlign: "center",
        lineHeight: 1.5,
        fontSize: 15,
        color: "#646496",
      }}
    >
      {str}
    </p>
  ));

const InfoPopup = ({ name, infoText, visible = false, withTitle = true }) => {
  if (visible) {
    return (
      <div>
        <InfoIcon data-tip data-for={name}></InfoIcon>
        <StyledReactTooltip id={name} effect="solid" place="left" type="light">
          {mapToParagraphsWithNewLines(infoText, withTitle)}
        </StyledReactTooltip>
      </div>
    );
  }
  return <div></div>;
};

export default InfoPopup;