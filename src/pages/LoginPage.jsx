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
import { login } from "../api/api_auth";
import { toast } from "sonner";
import validator from "email-validator";
import { useCookies } from "react-cookie";
import { Link as Links, useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all the fields.");
    } else if (!validator.validate(email)) {
      // 2. make sure the email is valid
      toast.error("Please use a valid email address");
    } else {
      try {
        const userData = await login(email, password);
        // set cookies
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // cookie expires in 8 hours
        });
        toast.success("Successfully logged in.");
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
          backgroundImage: "url('/login_bg.jpg')",
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
              padding: 4,
              width: "100%",
              maxWidth: "435px",
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)", // translucent white
              backdropFilter: "blur(10px)", // adds that "frosted glass" effect
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // soft shadow for levitation
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <Typography variant="h4" textAlign={"center"} mb={2}>
              Login
            </Typography>
            <Box mb={2}>
              <TextField
                label="Email"
                type="email"
                placeholder="Email"
                fullWidth
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(" ", "") // remove spaces
                    .slice(0, 64); // limit to 64 digits
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
                    .replace(" ", "") // remove spaces
                    .slice(0, 18); // limit to 18 digits
                }}
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleLogin}
            >
              Log In
            </Button>
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <Typography>
                Don't have an account? Click
                <Link to="/signup" component={Links} sx={{ marginX: "3px" }}>
                  here
                </Link>
                to sign up
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
