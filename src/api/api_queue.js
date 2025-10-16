import axios from "axios";
import { API_URL } from "./constants";

// create a new queue number
export async function newQueueNumber(
  doctorId,
  patientId,
  appointmentId,
  token
) {
  const response = await axios.post(
    API_URL + "queues",
    {
      doctorId,
      patientId,
      appointmentId,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  console.log(response);
  return response.data;
}

// GET the current queue number (based on doctor)
export async function getCurrentQueueNumber(doctorId) {
  const response = await axios.get(
    API_URL + "queues/current-queue-number/" + doctorId
  );
  return response.data;
}

// GET the patient's queue number for that appointment (based on appointment id)
export async function getPatientQueueNumber(appointmentId) {
  const response = await axios.get(
    API_URL + "queues/patient-queue-number/" + appointmentId
  );
  return response.data;
}
