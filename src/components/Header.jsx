import { Typography, Box, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router";
import { useCookies } from "react-cookie";
import { getDoctor } from "../api/api_doctors";
import { useEffect, useState } from "react";
import { getPatient } from "../api/api_patients";
import { API_URL } from "../api/constants";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [image, setImage] = useState(null);

  // app bar
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (currentuser && currentuser.role === "doctor") {
      getDoctor(currentuser._id).then((doctorData) => {
        setDoctorId(doctorData ? doctorData._id : "");
        setImage(doctorData ? doctorData.image : null);
      });
    } else if (currentuser && currentuser.role === "patient") {
      getPatient(currentuser._id).then((patientId) => {
        setPatientId(patientId ? patientId._id : "");
      });
    }
  }, [currentuser]);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Hospital
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {/* RESPONSIVE DROPDOWN MENU (TO BE REPLACED WITH DRAWER) */}
              <MenuItem
                variant={"outlined"}
                color="primary"
                to="/"
                component={Link}
                sx={{ m: 1 }}
              >
                Home
              </MenuItem>
              <MenuItem
                variant={"outlined"}
                color="primary"
                to="/doctors"
                component={Link}
                sx={{ m: 1 }}
              >
                Find a Doctor
              </MenuItem>
              {currentuser && currentuser.role === "admin" ? (
                <Box>
                  <MenuItem to="/add-doctor" component={Link} sx={{ m: 1 }}>
                    Add a Doctor
                  </MenuItem>
                  <MenuItem to="/specialties" component={Link} sx={{ m: 1 }}>
                    Manage Specialties
                  </MenuItem>
                  <MenuItem
                    to={`/manage-appointments/${currentuser._id}`}
                    component={Link}
                    sx={{ m: 1 }}
                  >
                    Manage Appointments
                  </MenuItem>
                </Box>
              ) : null}
              {currentuser && currentuser.role === "doctor" ? (
                <MenuItem
                  to={`/manage-appointments/${doctorId}`}
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Manage Appointments
                </MenuItem>
              ) : null}
              {currentuser && currentuser.role === "patient" ? (
                <MenuItem
                  to={`/manage-appointments/${patientId}`}
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Manage Appointments
                </MenuItem>
              ) : null}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Hospital
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* MAIN HOME PAGE BUTTONS */}
            <Button
              variant={"text"}
              color="dark"
              to="/"
              component={Link}
              sx={{ m: 1 }}
            >
              Home
            </Button>
            <Button
              variant={"text"}
              color="dark"
              to="/doctors"
              component={Link}
              sx={{ m: 1 }}
            >
              Find a Doctor
            </Button>
            {currentuser && currentuser.role === "admin" ? (
              <>
                <Button
                  variant={"text"}
                  color="dark"
                  to="/add-doctor"
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Add a Doctor
                </Button>
                <Button
                  variant={"text"}
                  color="dark"
                  to="/specialties"
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Manage Specialties
                </Button>
                <Button
                  variant={"text"}
                  color="dark"
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
                  variant={"text"}
                  color="dark"
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
                  variant={"text"}
                  color="dark"
                  to={`/manage-appointments/${patientId}`}
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Manage Appointments
                </Button>
              </>
            ) : null}
          </Box>
          {currentuser ? (
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography>{currentuser.name}</Typography>
              <Tooltip title="Open profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="User Avatar"
                    src={
                      API_URL + (image ? image : "uploads/default-avatar.jpg")
                    }
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  to={
                    currentuser.role === "doctor"
                      ? `/profile/${doctorId}`
                      : `/profile/${patientId}`
                  }
                  component={Link}
                >
                  <PersonIcon fontSize="small" sx={{ marginRight: "10px" }} />
                  <Typography>Manage Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    // remove the cookie
                    removeCookie("currentuser");
                    // redirect back to login page
                    window.location.href = "/login";
                  }}
                >
                  <LogoutIcon fontSize="small" sx={{ marginRight: "10px" }} />
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  variant={"text"}
                  color="dark"
                  to="/login"
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant={"text"}
                  color="dark"
                  to="/signup"
                  component={Link}
                  sx={{ m: 1 }}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
