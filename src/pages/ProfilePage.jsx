import { Container, Typography } from "@mui/material";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import DoctorProfile from "../components/DoctorProfile";
import { toast } from "sonner";
import PatientProfile from "../components/PatientProfile";

/* Here is where u filter the users based on their role. and then return the correct page based on their role. 

  something like this: 

  if (role === "doctor") {
    return(<DoctorProfile/>)
  } else {
    return(<PatientProfile/>)
  }

*/

export default function ProfilePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  if (currentuser && currentuser.role === "doctor") {
    return (
      <>
        <DoctorProfile />
      </>
    );
  } else if (currentuser) {
    return (
      <>
        <PatientProfile />
      </>
    );
  } else {
    navigate("/login");
    toast.error("Access denied. Please login or signup first");
    return <></>;
  }
}
