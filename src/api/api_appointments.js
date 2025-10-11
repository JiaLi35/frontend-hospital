import axios from "axios";
import { API_URL } from "./constants";

export async function newAppointment(
  doctorId,
  doctorName,
  specialty,
  dateTime,
  patientId,
  patientName,
  email,
  phone_number,
  nric,
  token
) {
  const response = await axios.post(
    API_URL + "appointments/new-appointment",
    {
      doctorId,
      doctorName,
      specialty,
      dateTime,
      patientId,
      patientName,
      email,
      phone_number,
      nric,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}
