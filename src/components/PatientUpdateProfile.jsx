import { Container, Box, Paper, TextField, Button } from "@mui/material";
import Header from "./Header";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { getPatientById, updatePatient } from "../api/api_patients";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function PatientUpdateProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // retrieve id from the url
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies; // use this currentuser to get user_id and compare with the user_id in doctor.
  const { token = "" } = currentuser;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nric, setNric] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPatientById(id)
      .then((patientData) => {
        if (
          !currentuser ||
          currentuser.role !== "patient" ||
          currentuser._id !== patientData.user_id
        ) {
          navigate("/");
          toast.error("Access denied");
        }
        // update the individual states with data
        setName(patientData ? patientData.name : "");
        setEmail(patientData ? patientData.email : "");
        setNric(patientData ? patientData.nric : "");
        setPhoneNumber(patientData ? patientData.phone_number : "");
        setPatientId(patientData ? patientData._id : "");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUpdatePatient = async () => {
    if (!phoneNumber) {
      toast.error("Please fill in all the fields.");
    } else {
      try {
        setLoading(true);
        await updatePatient(patientId, phoneNumber, token);
        toast.success("Patient Profile successfully updated.");
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column", // make it a column layout
          backgroundColor: "rgb(251, 251, 251)",
        }}
      >
        <Header />
        <Container
          maxWidth="md"
          sx={{
            flex: 1, // fills remaining height below header
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper sx={{ padding: 3, width: "100%", maxWidth: "500px" }}>
            <Box mb={2}>
              <TextField
                disabled
                label="Name"
                placeholder="Name"
                fullWidth
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                disabled
                placeholder="Email"
                fullWidth
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="NRIC No."
                placeholder="NRIC No."
                disabled
                fullWidth
                value={nric}
                onChange={(event) => {
                  setNric(event.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Phone Number"
                placeholder="Phone Number"
                fullWidth
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "") // remove non-digits
                    .slice(0, 11); // limit to 11 digits
                }}
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleUpdatePatient}
              sx={{ mb: "10px" }}
            >
              Update Profile
            </Button>
            <Button
              color="error"
              variant="contained"
              fullWidth
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
          </Paper>
        </Container>
      </Box>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
