import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import PatientAppointmentPage from "../components/PatientAppointmentPage";
import DoctorAppointmentPage from "../components/DoctorAppointmentPage";
import { toast } from "sonner";

export default function AppointmentPage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;

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
  } else {
    navigate("/login");
    toast.error("Access denied. Please login or signup first");
    return <></>;
  }
}
