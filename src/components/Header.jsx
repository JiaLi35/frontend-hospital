import { Typography, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { getDoctor } from "../api/api_doctors";
import { useEffect, useState } from "react";
import { getPatient } from "../api/api_patients";

// use responsive appbar from material ui and drawers from material ui

export default function Header({ title }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    if (currentuser && currentuser.role === "doctor") {
      getDoctor(currentuser._id).then((doctorData) => {
        setDoctorId(doctorData ? doctorData._id : "");
      });
    } else if (currentuser && currentuser.role === "patient") {
      getPatient(currentuser._id).then((patientId) => {
        setPatientId(patientId ? patientId._id : "");
      });
    }
  }, [currentuser]);

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
        {currentuser && currentuser.role === "admin" ? (
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
              to={`/manage-appointments/${currentuser._id}`}
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Appointments
            </Button>
          </>
        ) : null}
        {currentuser && currentuser.role === "doctor" ? (
          <>
            <Button
              variant={"outlined"}
              color="primary"
              to={`/profile/${doctorId}`}
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Profile
            </Button>
            <Button
              variant={"outlined"}
              color="primary"
              to={`/manage-appointments/${doctorId}`}
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Appointments
            </Button>
          </>
        ) : null}
        {currentuser && currentuser.role === "patient" ? (
          <>
            <Button
              variant={"outlined"}
              color="primary"
              to={`/profile/${patientId}`}
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Profile
            </Button>
            <Button
              variant={"outlined"}
              color="primary"
              to={`/manage-appointments/${patientId}`}
              component={Link}
              sx={{ m: 1 }}
            >
              Manage Appointments
            </Button>
          </>
        ) : null}
        {currentuser ? (
          <Button
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => {
              // remove the cookie
              removeCookie("currentuser");
              // redirect back to home page
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
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
