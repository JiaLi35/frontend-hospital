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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Header title={"Login"} />
      <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
        <Paper sx={{ padding: 3 }}>
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
          <Button
            color="primary"
            variant="contained"
            fullWidth
            // onClick={handleLogin}
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
