import axios from "axios";
import { API_URL } from "./constants";

// GET patient profile information based on user_id
export const getPatient = async (id) => {
  const response = await axios.get(API_URL + "patients/" + id);
  return response.data;
};

// PUT (update) patient profile information
export const updatePatient = async (id, phone_number, token) => {
  const response = await axios.put(
    API_URL + "patients/update-profile/" + id,
    {
      phone_number: phone_number,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

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
