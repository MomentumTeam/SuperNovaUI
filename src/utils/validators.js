import { PHONE_REG_EXP, NAME_REG_EXP } from "../constants";

export const validatePhoneNumber = (value) => {
  return PHONE_REG_EXP.test(value) ? null : "מספר לא תקין";
};

export const validateName = (value) => {
  return NAME_REG_EXP.test(value) ? null : "שם לא תקין";
};
