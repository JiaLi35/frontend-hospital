import axios from "axios";
import { API_URL } from "./constants";

export const uploadImage = async (image) => {
  // create a new form data
  const formData = new FormData();
  formData.append("image", image);
  const response = await axios.post(API_URL + "images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
