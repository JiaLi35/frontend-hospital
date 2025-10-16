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
      !name.trim() ||
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
    } else if (phoneNumber.length !== 11) {
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
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/signup_bg.png')",
          backgroundSize: { md: "cover", lg: "cover", xl: "initial" }, // ensures image fills entire space
          backgroundPosition: { md: "center", lg: "center", xl: "initial" }, // centers it nicely
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgb(245, 245, 245)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Container
          maxWidth="xl"
          sx={{
            flex: 1, // fills remaining height below header
            height: "100%",
            display: "flex",
            justifyContent: {
              sm: "center",
              md: "center",
              lg: "center",
              xl: "flex-end",
            },
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              marginRight: { xl: "10px" },
              padding: 4,
              width: "100%",
              maxWidth: "500px",
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)", // translucent white
              backdropFilter: "blur(10px)", // adds that "frosted glass" effect
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // soft shadow for levitation
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <Typography variant="h4" textAlign={"center"} mb={2}>
              Sign Up
            </Typography>
            <Box mb={2}>
              <TextField
                label="Name"
                placeholder="Name"
                fullWidth
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\d/g, "")
                    .slice(0, 50); // limit to 50 digits
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
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(" ", "") // remove non-digits
                    .slice(0, 64); // limit to 64 digits
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
                    .slice(0, 11); // limit to 11 digits
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
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(" ", "") // remove non-digits
                    .slice(0, 18); // limit to 18 digits
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
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(" ", "") // remove non-digits
                    .slice(0, 18); // limit to 18 digits
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
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <Typography>
                Already have an account? Click
                <Link to="/login" component={Links} sx={{ marginX: "3px" }}>
                  here
                </Link>
                to log in
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
