import { useEffect, useState } from "react";
import { getAppointments } from "../api/api_appointments";

export default function AdminAppointmentPage() {
  const [status, setStatus] = useState("all");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments(status)
      .then((appointmentData) => {
        setAppointments(appointmentData);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }, [status]);

  return <>This is where the admin manages the appointments</>;

  /* get appoitnments. if the appointment dates are like 3 years ago, then show the delete button to delete the appointment.  */
}
