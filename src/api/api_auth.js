import axios from "axios";
import { API_URL } from "./constants";

export const login = async (email, password) => {
  const response = await axios.post(API_URL + "users/login", {
    email,
    password,
  });
  return response.data;
};
