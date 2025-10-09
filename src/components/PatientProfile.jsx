import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import Header from "../components/Header";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { getPatient, updatePatient } from "../api/api_patients";

export default function PatientProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // retrieve id from the url
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies; // use this currentuser to get user_id and compare with the user_id in doctor.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nric, setNric] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    getPatient(id)
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
    const updatedPatient = await updatePatient(patientId, phoneNumber);
    console.log(updatedPatient);
    toast.success("Patient Profile successfully updated.");
    navigate(`/profile/${id}`);
  };

  return (
    <>
      <Header title="Edit Patient Profile" />
      <Container maxWidth="sm">
        <Paper sx={{ padding: 3 }}>
          <Typography>Name</Typography>
          <Box mb={2}>
            <TextField
              placeholder="Name"
              fullWidth
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Box>
          <Typography>Email</Typography>
          <Box mb={2}>
            <TextField
              disabled
              placeholder="Email"
              fullWidth
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Box>
          <Typography>NRIC No.</Typography>
          <Box mb={2}>
            <TextField
              placeholder="NRIC No."
              disabled
              fullWidth
              value={nric}
              onChange={(event) => {
                setNric(event.target.value);
              }}
            />
          </Box>
          <Typography>Phone Number</Typography>
          <Box mb={2}>
            <TextField
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
    </>
  );
}
