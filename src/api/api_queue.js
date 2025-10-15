import axios from "axios";
import { API_URL } from "./constants";

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

export async function getCurrentQueueNumber(doctorId) {
  const response = await axios.get(
    API_URL + "queues/current-queue-number/" + doctorId
  );
  return response.data;
}

export async function getPatientQueueNumber(appointmentId) {
  const response = await axios.get(
    API_URL + "queues/patient-queue-number/" + appointmentId
  );
  return response.data;
}

export async function deleteQueueNumber() {}
