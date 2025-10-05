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
import { Link as Links } from "react-router";
import Header from "../components/Header";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <Header title={"Sign Up"} />
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
            // onClick={handleSignUp}
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
