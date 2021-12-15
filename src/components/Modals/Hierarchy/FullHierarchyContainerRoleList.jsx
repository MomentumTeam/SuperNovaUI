import React, { useState } from "react";
import styled from "styled-components";
import { useToast } from "../../../context/use-toast";
import { FullRoleInformation } from "../Role/FullRoleInformation";

const StyledContainerRoleList = styled.div`
  width: 100%;
  background-color: #f7f7f7;
  border: 1px solid rgb(167, 171, 189, 0.61);
  border-radius: 10px;
  margin-bottom: 20px;
  max-height: 342px;
  overflow-y: auto;
  scrollbar-color: #e1e0e2 #e4e5e6;
  scrollbar-width: thin;
  padding: 20px 25px 20px 10px;

  &::-webkit-scrollbar-track {
    background-color: #e4e5e6;
    border-radius: 30px;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 0;
    background-color: #e4e5e6;
    border-radius: 30px;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb {
    background: #e1e0e2;
    border-radius: 30px;
  }

  @media (max-width: 1366px) {
    padding: 15px 15px 15px 00px;
    max-height: 100%;
  }
`;

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledListItem = styled.li`
  margin-bottom: 15px;
  border-bottom: 1px solid #d7d7d7;
  @media (max-width: 699px) {
    margin-bottom: 8px;
  }
`;

const StyledItemContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 699px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Text = styled.p`
  padding-left: 18px;
  color: rgba(32, 25, 97, 0.7);
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  @media (max-width: 699px) {
    padding-left: 10px;
  }
`;

const Status = styled.p`
  background-color: rgba(63, 188, 157, 0.2);
  color: #3fbc9d;
  font-weight: 700;
  font-size: 11px;
  line-height: 13px;
  border-radius: 19px;
  padding: 10px 10px;
  width: 59px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 699px) {
    margin-top: 8px;
  }
`;

const ContainerRoleList = ({ roles }) => {
  const { actionPopup } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const sendActionPopup = (actionName = "עריכת תפקיד", error = null) => {
    actionPopup(actionName, error);
  };

  const onClick = (role) => {
    setSelectedRole(role);
    setIsActionModalOpen(true);
  }

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
      <StyledContainerRoleList>
        <StyledList>
          {roles &&
            roles.map((role) => {
              return (
                <StyledListItem>
                  <StyledItemContent>
                    <Text onClick={() => onClick(role)}>
                      {role?.jobTitle && role.jobTitle != "unknown" ? role.jobTitle : role.roleId}
                    </Text>
                    {/* <Status>פנוי</Status> */}
                  </StyledItemContent>
                </StyledListItem>
              );
            })}
        </StyledList>
      </StyledContainerRoleList>

      {selectedRole != null && <FullRoleInformation
        role={selectedRole}
        isOpen={isActionModalOpen}
        closeModal={closeActionModal}
        edit={false}
        actionPopup={sendActionPopup}
      />}
    </>
  );
};

export { ContainerRoleList };
