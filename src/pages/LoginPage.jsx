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
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Header title={"Login"} />
      <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
        <Paper sx={{ padding: 3 }}>
          <Typography>Email</Typography>
          <Box mb={2}>
            <TextField
              type="email"
              placeholder="Email"
              fullWidth
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
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
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleLogin}
          >
            Log In
          </Button>
          <Box sx={{ display: "flex" }}>
            <Typography>Already have an account? Click</Typography>
            <Link to="/signup" component={Links}>
              here
            </Link>
            <Typography>to sign up</Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
