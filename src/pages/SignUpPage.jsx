import {
  Container,
  Box,
  TextField,
  Paper,
  Typography,
  Button,
  Link,
} from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import validator from "email-validator";
import { toast } from "sonner";
import { Link as Links, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { addPatientProfileAndSignUp } from "../api/api_patients";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nric, setNric] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (
      !name ||
      !email ||
      !nric ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all the fields.");
    } else if (!validator.validate(email)) {
      // 2. make sure the email is valid
      toast.error("Please use a valid email address");
    } else if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
    } else if (nric.length !== 12) {
      // if nric no. is not a certain length, throw an error to input a valid value
      toast.error("Please enter a valid IC number.");
    } else if (phoneNumber.length !== 10) {
      // if phone number is not a certain length, throw an error to input a valid value
      toast.error("Please enter a valid phone number.");
    } else {
      try {
        const userData = await addPatientProfileAndSignUp(
          name,
          email,
          nric,
          phoneNumber,
          password
        );
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // cookie expires in 8 hours
        });
        toast.success("Successfully created a new account and patient profile");
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Header title={"Sign Up"} />
      <Container maxWidth="sm">
        <Paper sx={{ padding: 3 }}>
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
              type="number"
              placeholder="NRIC No."
              fullWidth
              value={nric}
              onChange={(event) => {
                setNric(event.target.value);
              }}
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/\D/g, "") // remove non-digits
                  .slice(0, 12); // limit to 12 digits
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Phone Number"
              type="number"
              placeholder="+60"
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
          <Box mb={2}>
            <TextField
              label="Password"
              placeholder="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Confirm Password"
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
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Box sx={{ display: "flex" }}>
            <Typography>Already have an account? Click</Typography>
            <Link to="/login" component={Links}>
              here
            </Link>
            <Typography>to log in</Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
