import { PHONE_REG_EXP, NAME_REG_EXP } from "../constants";

export const validatePhoneNumber = (value) => PHONE_REG_EXP.test(value);

export const validateName = (value) => NAME_REG_EXP.test(value);
