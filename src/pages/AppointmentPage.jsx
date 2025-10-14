import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import PatientAppointmentPage from "../components/PatientAppointmentPage";
import DoctorAppointmentPage from "../components/DoctorAppointmentPage";
import AdminAppointmentPage from "../components/AdminAppointmentPage";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AppointmentPage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  if (currentuser && currentuser.role === "doctor") {
    return (
      <>
        <DoctorAppointmentPage />
      </>
    );
  } else if (currentuser && currentuser.role === "patient") {
    return (
      <>
        <PatientAppointmentPage />
      </>
    );
  } else if (currentuser && currentuser.role === "admin") {
    return (
      <>
        <AdminAppointmentPage />
      </>
    );
  } else {
    useEffect(() => {
      navigate("/login");
      toast.error("Access denied. Please login or signup first");
    }, [currentuser]);
  }
}
