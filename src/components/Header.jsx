import { Typography, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useCookies } from "react-cookie";

// use responsive appbar from material ui and drawers from material ui

export default function Header({ title }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          mb: 3,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography>{title}</Typography>
        <Button
          variant={"outlined"}
          color="primary"
          to="/"
          component={Link}
          sx={{ m: 1 }}
        >
          Home
        </Button>
        <Button
          variant={"outlined"}
          color="primary"
          to="/doctors"
          component={Link}
          sx={{ m: 1 }}
        >
          Find a Doctor
        </Button>
        {currentuser ? (
          <>
            <Button
              variant={"outlined"}
              color="primary"
              to="/add-doctor"
              component={Link}
              sx={{ m: 1 }}
            >
              Add a Doctor
            </Button>
            <Button
              variant={"outlined"}
              color="primary"
              to="/specialties"
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Specialties
            </Button>
            <Button
              variant={"outlined"}
              color="primary"
              to="/manage-profile"
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Profile
            </Button>
            <Button
              variant="outlined"
              sx={{ m: 1 }}
              onClick={() => {
                // remove the cookie
                removeCookie("currentuser");
                // redirect back to home page
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={"outlined"}
              color="primary"
              to="/login"
              component={Link}
              sx={{ m: 1 }}
            >
              Login
            </Button>
            <Button
              variant={"outlined"}
              color="primary"
              to="/signup"
              component={Link}
              sx={{ m: 1 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </>
  );
}
