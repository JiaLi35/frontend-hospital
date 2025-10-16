import axios from "axios";
import { API_URL } from "./constants";

// GET all appointments
export async function getAppointments(status) {
  const response = await axios.get(
    API_URL + "appointments/" + (status === "all" ? "" : "?status=" + status)
  );
  return response.data;
}

// GET appointments by patient id
export async function getAppointmentsByPatientId(patientId, status) {
  const response = await axios.get(
    API_URL +
      "appointments/patient-appointments/" +
      patientId +
      (status === "all" ? "" : "?status=" + status)
  );
  return response.data;
}

// GET appointments by doctor id
export async function getAppointmentsByDoctorId(doctorId, status) {
  const response = await axios.get(
    API_URL +
      "appointments/doctor-appointments/" +
      doctorId +
      (status === "all" ? "" : "?status=" + status)
  );
  return response.data;
}

// GET one appointment
export async function getAppointment(id) {
  const response = await axios.get(API_URL + "appointments/" + id);
  return response.data;
}

// book a new appointment
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

// reschedule appointment
export async function updateAppointment(
  id,
  doctorId,
  patientId,
  dateTime,
  token
) {
  const response = await axios.put(
    API_URL + "appointments/update-appointment/" + id,
    {
      doctorId,
      patientId,
      dateTime,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// mark appointment as completed
export async function completeAppointment(id, token) {
  const response = await axios.put(
    API_URL + "appointments/complete-appointment/" + id,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// cancel appointment
export async function cancelAppointment(id, token) {
  const response = await axios.put(
    API_URL + "appointments/cancel-appointment/" + id,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// delete appointment from database
export async function deleteAppointment(id, token) {
  const response = await axios.delete(API_URL + "appointments/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
