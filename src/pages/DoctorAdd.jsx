import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import validator from "email-validator";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { getSpecialties } from "../api/api_specialties";
import { addDoctorProfile } from "../api/api_doctors";
import { useCookies } from "react-cookie";

export default function DoctorAdd() {
  /*
  ONLY ADMIN SHOULD SEE THIS PAGE
   check the role of the logged in user: 
    - if not admin, throw a 403 forbidden error
    - if admin, let them see the page
  */

  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const [specialties, setSpecialties] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    getSpecialties().then((data) => {
      setSpecialties(data);
    });
  }, []);

  const handleAddDoctor = async () => {
    if (!name || !email || !specialty || !password || !confirmPassword) {
      toast.error("Please fill in all the fields.");
    } else if (!validator.validate(email)) {
      // 2. make sure the email is valid
      toast.error("Please use a valid email address");
    } else if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
    } else {
      try {
        await addDoctorProfile(name, email, specialty, password, token);
        toast.success("Successfully created a doctor's account and profile");
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  if (!currentuser || currentuser.role !== "admin") {
    navigate("/");
    toast.error("Access Denied");
    return <></>;
  }

  return (
    <>
      <Header title="Add a Doctor" />
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
              placeholder="Email"
              fullWidth
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Box>
          <Box mb={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Specialty</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={specialty}
                label="Specialty"
                onChange={(event) => {
                  setSpecialty(event.target.value);
                }}
              >
                {specialties.map((spe) => (
                  <MenuItem value={spe._id}>{spe.specialty}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography>Password</Typography>
          <Box mb={2}>
            <TextField
              placeholder="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </Box>
          <Typography>Confirm Password</Typography>
          <Box mb={2}>
            <TextField
              placeholder="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            />
          </Box>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleAddDoctor}
          >
            Add Doctor
          </Button>
        </Paper>
      </Container>
    </>
  );
}
