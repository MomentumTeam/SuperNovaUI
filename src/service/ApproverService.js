import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const addCommanderApproverReq = async (newApproverInfo) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/approver/commanderApprover`,
    newApproverInfo
  );
  return response.data;
};

export const addSecurityApproverReq = async (newApproverInfo) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/approver/securityApprover`,
    newApproverInfo
  );
  return response.data;
};

export const addSuperSecurityApproverReq = async (newApproverInfo) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/approver/superSecurityApprover`,
    newApproverInfo
  );
  return response.data;
};

export const getUserTypeReq = async (id) => {
  const userType = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/userType/${id}`
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
    `${apiBaseUrl}/api/approver/searchByDisplayName`,
    { displayName: displayName, type: type, from: from, to: to }
  );
  return approvers.data;
};

export const searchApproverByDomainUser = async (domainUser, type) => {
  const approvers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/searchByDomainUser`,
    { domainUser: domainUser, type: type }
  );
  return approvers.data;
};

export const getAllSecurityApproversReq = async () => {
  //TODO
  const securityApprovers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/securityApprovers`
  );
  return securityApprovers.data;
};

export const getAllSuperSecurityApproversReq = async () => {
  //TODO
  const superSecurityApprovers = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/superSecurityApprovers`
  );
  return superSecurityApprovers.data;
};

export const getAllCommanderApproversReq = async () => {
  const allCommanderApprovers = await axiosApiInstance.get(
    //TODO
    `${apiBaseUrl}/api/approver/commanderApprovers`
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
