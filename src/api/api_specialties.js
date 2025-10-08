import axios from "axios";
import { API_URL } from "./constants";

// GET specialties
export const getSpecialties = async () => {
  const response = await axios.get(API_URL + "specialties");
  return response.data;
};

// GET 1 specialty
export const getSpecialty = async (id) => {
  const response = await axios.get(API_URL + "specialties/" + id);
  return response.data;
};

// POST specialty (create)
export const addSpecialty = async (specialty) => {
  const response = await axios.post(API_URL + "specialties", {
    specialty: specialty,
  });
  return response.data;
};

// PUT specialty (update)
export const updateSpecialty = async (id, specialty) => {
  const response = await axios.put(API_URL + "specialties/" + id, {
    specialty: specialty,
  });
  return response.data;
};

// DELETE specialty (delete)
export const deleteSpecialty = async (id) => {
  const response = await axios.delete(API_URL + "specialties/" + id);
  return response.data;
};
