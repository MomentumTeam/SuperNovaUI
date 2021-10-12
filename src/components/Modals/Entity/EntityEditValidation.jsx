import * as Yup from "yup";
import { PHONE_REG_EXP } from "../../constants";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  identityCard: Yup.number().required(),
  phone: Yup.string().matches(PHONE_REG_EXP, "Phone number is not valid").required(),
  clearance: Yup.number().required(),
});

const validateSchema = async(data) => {
 try {
   await validationSchema.validate(data);
 } catch (err) {
   throw new Error(err.errors);
 }
}