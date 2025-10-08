import axios from "axios";
import { API_URL } from "./constants";

// GET multiple doctor profiles
export async function getDoctors(specialty) {
  const response = await axios.get(
    API_URL + "doctors" + (specialty === "all" ? "" : "?specialty=" + specialty)
  );
  return response.data;
}

// GET doctor profile information based on user_id
export async function getDoctor(id) {
  const response = await axios.get(API_URL + "doctors/" + id);
  return response.data;
}

// POST new doctor profile information
export const addDoctorProfile = async (name, email, specialty, password) => {
  const response = await axios.post(API_URL + "doctors/new-profile", {
    name,
    email,
    specialty,
    password,
  });
  return response.data;
};

// PUT (update) doctor profile information
