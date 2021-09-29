import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUserTypeReq = async (entityId) => {
  const userType = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/userType/${entityId}`
  );
  return userType.data;
};

export const searchApproverByDisplayNameReq = async (
  displayName,
  from,
  to
) => {
  const approvers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/displayname/${displayName}`,
    {
      params: {
        from, to
      }
    });
  return approvers.data;
};

export const searchApproverByDomainUser = async (domainUser, type) => {
  const approvers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/domainuser/${domainUser}`,
    {
      params:{
        type
      }
    }
  );
  return approvers.data;
};

export const getAllApproversReq = async (type) => {
  const allCommanderApprovers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/`,
    {
      params: {
        type
      }
    }
  );
  return allCommanderApprovers.data;
};

export const updateCommanderDecisionReq = async (requestId, approverDecision) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/approver/commanderDecision/${requestId}`,
    { approverDecision: approverDecision }
  );
  return response.data;
};

export const updateSecurityDecisionReq = async (requestId, approverDecision) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/approver/securityDecision/${requestId}`,
    { approverDecision: approverDecision }
  );
  return response.data;
};

export const updateSuperSecurityDecisionReq = async (requestId, approverDecision) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/approver/superSecurityDecision/${requestId}`,
    { approverDecision: approverDecision }
  );
  return response.data;
};
