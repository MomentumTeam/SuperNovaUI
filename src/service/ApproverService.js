import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUserTypeReq = async (entityId) => {
  const userType = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approvers/userType/${entityId}`
  );
  return userType.data;
};

export const searchApproverByDisplayNameReq = async (
  displayName,
  type,
  from,
  to
) => {
  const approvers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approvers/displayname/${displayName}`,
    {
      params: {
        type,
        from,
        to,
      },
    }
  );
  return approvers.data;
};

export const searchHighApproverByDisplayNameReq = async (
  displayName,
) => {
  const approvers = await axiosApiInstance.get(`${apiBaseUrl}/api/approvers/highcommanders/displayname/${displayName}`);
  return approvers.data;
};

export const searchApproverByDomainUser = async (domainUser, type) => {
  const approvers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approvers/domainuser/${domainUser}`,
    {
      params: {
        type,
      },
    }
  );
  return approvers.data;
};

export const getAllApproversReq = async (type) => {
  const allCommanderApprovers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approvers/`,
    {
      params: {
        type,
      },
    }
  );
  return allCommanderApprovers.data;
};

export const updateDecisionReq = async (requestId, decision) => {
  const response = await axiosApiInstance.put(`${apiBaseUrl}/api/approvers/decision/${requestId}`, {decision: decision});
  return response.data;
};

export const isApproverValid = async (approverId, groupId) => {
  const response = await axiosApiInstance.post(`${apiBaseUrl}/api/approvers/isValid`, { approverId, groupId });
  return response.data;
}
