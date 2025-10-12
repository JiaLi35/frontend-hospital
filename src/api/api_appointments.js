import axios from "axios";
import { API_URL } from "./constants";

export async function getAppointmentsByPatientId(patientId, status) {
  const response = await axios.get(
    API_URL +
      "appointments/patient-appointments/" +
      patientId +
      (status === "all" ? "" : "?status=" + status)
  );
  return response.data;
}

export async function getAppointmentsByDoctorId(doctorId, status) {
  const response = await axios.get(
    API_URL +
      "appointments/doctor-appointments/" +
      doctorId +
      (status === "all" ? "" : "?status=" + status)
  );
  return response.data;
}

export async function getAppointment(id) {
  const response = await axios.get(API_URL + "appointments/" + id);
  return response.data;
}

export async function newAppointment(doctorId, dateTime, patientId, token) {
  const response = await axios.post(
    API_URL + "appointments/new-appointment",
    {
      doctorId,
      dateTime,
      patientId,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}
