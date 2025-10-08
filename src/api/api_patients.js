import axios from "axios";
import { API_URL } from "./constants";

// GET patient profile information based on user_id

// PUT (update) patient profile information

// POST new patient profile information
export const addPatientProfileAndSignUp = async (
  name,
  email,
  nric,
  phone_number,
  password
) => {
  const response = await axios.post(API_URL + "patients/new-profile", {
    name,
    email,
    nric,
    phone_number,
    password,
  });
  return response.data;
};
