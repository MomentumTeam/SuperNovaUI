import React, { useState } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import warningIcon from "../assets/images/warning-icon.svg";
import "../assets/css/local/components/info-popup.css";

const InfoIconWrapper = styled.div`
  background-color: transparent;
  width: 19px;
  height: 19px;
  background-size: contain;
  opacity: 1;
  margin: 0 10px;
  position: relative;
`;

const WarningIcon = styled.div`
  background-color: transparent;
  width: 16px;
  height: 16px;
  background-size: contain;
  opacity: 1;
  margin: 0 10px;
  background-image: url(${warningIcon});
  position: relative;
`;

const StyledReactTooltip = styled(ReactTooltip)`
  background-color: white !important;
  color: black !important;
  max-width: 380px;
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.25);
  opacity: 0.95 !important;
`;

const getIsFirstTime = (name) => {
  const firstTimesObj = localStorage.getItem("info-icons");
  if (firstTimesObj)
    return JSON.parse(localStorage.getItem("info-icons"))[name] === undefined;

  localStorage.setItem("info-icons", "{}");
  return true;
};

const setIsFirstTime = (name) => {
  const newObj = {
    ...JSON.parse(localStorage.getItem("info-icons")),
    [name]: false,
  };
  localStorage.setItem("info-icons", JSON.stringify(newObj));
};

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

const InfoPopup = ({
  name,
  infoText,
  visible = false,
  withTitle = true,
  warning = false,
}) => {
  const [firstTime, setfirstTime] = useState(getIsFirstTime(name));

  if (visible) {
    return (
      <div
        onMouseEnter={() => {
          setIsFirstTime(name);
          setfirstTime(false);
        }}
        style={{ width: "19px", height: "19px" }}
      >
        {warning ? (
          <WarningIcon data-tip data-for={name}></WarningIcon>
        ) : (
          <InfoIconWrapper data-tip data-for={name}>
            <svg
              width="19"
              height="19"
              className={firstTime ? "blinking-info-popup" : ""}
            >
              <g>
                <path
                  id="Path_1357"
                  data-name="Path 1357"
                  d="M12.875,5.293a7.579,7.579,0,1,1-5.362,2.22,7.55,7.55,0,0,1,5.362-2.22m0-1.918a9.5,9.5,0,1,0,9.5,9.5,9.5,9.5,0,0,0-9.5-9.5Z"
                  transform="translate(-3.375 -3.375)"
                  fill="#2979f4"
                />
                <path
                  id="Path_1358"
                  data-name="Path 1358"
                  d="M18.442,20.188H16.523V14.478h1.918Zm0-7.582H16.523V10.687h1.918Z"
                  transform="translate(-7.982 -5.938)"
                  fill="#2979f4"
                />
              </g>
            </svg>
          </InfoIconWrapper>
        )}
        <StyledReactTooltip id={name} effect="solid" place="left" type="light">
          {mapToParagraphsWithNewLines(infoText, withTitle)}
        </StyledReactTooltip>
      </div>
    );
  }
  return <div></div>;
};

export default InfoPopup;
