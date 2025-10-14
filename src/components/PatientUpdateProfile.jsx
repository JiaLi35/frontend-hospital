import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import Header from "./Header";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { getPatientById, updatePatient } from "../api/api_patients";

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

  useEffect(() => {
    getPatientById(id)
      .then((patientData) => {
        console.log(patientData);
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
    if (!name || !phoneNumber) {
      toast.error("Please fill in all the fields.");
    } else {
      try {
        const updatedPatient = await updatePatient(
          patientId,
          phoneNumber,
          token
        );
        console.log(updatedPatient);
        toast.success("Patient Profile successfully updated.");
        navigate(`/profile/${id}`);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
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
                    .slice(0, 10); // limit to 12 digits
                }}
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleUpdatePatient}
            >
              Update Profile
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
