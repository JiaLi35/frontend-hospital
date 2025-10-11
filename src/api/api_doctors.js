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
export async function getDoctor(user_id) {
  const response = await axios.get(API_URL + "doctors/user/" + user_id);
  return response.data;
}

// GET doctor profile information based on their doctor _id
export async function getDoctorById(id) {
  const response = await axios.get(API_URL + "doctors/" + id);
  return response.data;
}

// POST new doctor profile information
export const addDoctorProfile = async (
  name,
  email,
  specialty,
  password,
  token
) => {
  const response = await axios.post(
    API_URL + "doctors/new-profile",
    {
      name,
      email,
      specialty,
      password,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

// PUT (update) doctor profile information
export const updateDoctor = async (id, biography, image, token) => {
  const response = await axios.put(
    API_URL + "doctors/update-profile/" + id,
    {
      biography: biography,
      image: image,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};
