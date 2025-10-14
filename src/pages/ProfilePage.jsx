import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import DoctorUpdateProfile from "../components/DoctorUpdateProfile";
import { toast } from "sonner";
import PatientUpdateProfile from "../components/PatientUpdateProfile";
import { useEffect } from "react";

/* Here is where u filter the users based on their role. and then return the correct page based on their role. 

  something like this: 

  if (role === "doctor") {
    return(<DoctorProfile/>)
  } else {
    return(<PatientUpdateProfile/>)
  }

*/

export default function ProfilePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  if (currentuser && currentuser.role === "doctor") {
    return (
      <>
        <DoctorUpdateProfile />
      </>
    );
  } else if (currentuser && currentuser.role === "patient") {
    return (
      <>
        <PatientUpdateProfile />
      </>
    );
  } else {
    useEffect(() => {
      navigate("/login");
      toast.error("Access denied. Please login or signup first");
    }, [currentuser]);
  }
}
