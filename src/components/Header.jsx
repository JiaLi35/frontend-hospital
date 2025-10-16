import { Typography, Box, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
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
  const [loading, setLoading] = useState(false);

  // app bar
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DocOnline
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation"
              onClick={() => setMobileOpen(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
            >
              <Box
                sx={{ width: 260 }}
                role="presentation"
                onClick={() => setMobileOpen(false)}
                onKeyDown={() => setMobileOpen(false)}
              >
                <List>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                      <HomeIcon sx={{ marginRight: "10px" }} />
                      <ListItemText primary="Home" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/doctors">
                      <SearchIcon sx={{ marginRight: "10px" }} />
                      <ListItemText primary="Find a Doctor" />
                    </ListItemButton>
                  </ListItem>
                  {currentuser && currentuser.role === "admin" && (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={Link} to="/add-doctor">
                          <PersonAddIcon sx={{ marginRight: "10px" }} />
                          <ListItemText primary="Add a Doctor" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={Link} to="/specialties">
                          <TurnedInIcon sx={{ marginRight: "10px" }} />
                          <ListItemText primary="Manage Specialties" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          to={`/manage-appointments/${currentuser._id}`}
                        >
                          <CalendarMonthIcon sx={{ marginRight: "10px" }} />
                          <ListItemText primary="Manage Appointments" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                  {currentuser && currentuser.role !== "admin" && (
                    <ListItem disablePadding>
                      <ListItemButton
                        component={Link}
                        to={
                          currentuser && currentuser.role === "patient"
                            ? `/manage-appointments/${patientId}`
                            : `/manage-appointments/${doctorId}`
                        }
                      >
                        <CalendarMonthIcon sx={{ marginRight: "10px" }} />
                        <ListItemText primary="Manage Appointments" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DocOnline
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
              <HomeIcon sx={{ marginRight: "10px" }} />
              Home
            </Button>
            <Button
              variant={"text"}
              color="dark"
              to="/doctors"
              component={Link}
              sx={{ m: 1 }}
            >
              <SearchIcon sx={{ marginRight: "10px" }} />
              Find a Doctor
            </Button>
            {currentuser && currentuser.role === "admin" && (
              <>
                <Button
                  variant={"text"}
                  color="dark"
                  to="/add-doctor"
                  component={Link}
                  sx={{ m: 1 }}
                >
                  <PersonAddIcon sx={{ marginRight: "10px" }} />
                  Add a Doctor
                </Button>
                <Button
                  variant={"text"}
                  color="dark"
                  to="/specialties"
                  component={Link}
                  sx={{ m: 1 }}
                >
                  <TurnedInIcon sx={{ marginRight: "10px" }} />
                  Manage Specialties
                </Button>
                <Button
                  variant={"text"}
                  color="dark"
                  to={`/manage-appointments/${currentuser._id}`}
                  component={Link}
                  sx={{ m: 1 }}
                >
                  <CalendarMonthIcon sx={{ marginRight: "10px" }} />
                  Manage Appointments
                </Button>
              </>
            )}
            {currentuser && currentuser.role !== "admin" && (
              <Button
                variant={"text"}
                color="dark"
                to={
                  currentuser && currentuser.role === "patient"
                    ? `/manage-appointments/${patientId}`
                    : `/manage-appointments/${doctorId}`
                }
                component={Link}
                sx={{ m: 1 }}
              >
                <CalendarMonthIcon sx={{ marginRight: "10px" }} />
                Manage Appointments
              </Button>
            )}
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
                {currentuser && currentuser.role !== "admin" && (
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
                )}

                <MenuItem
                  onClick={() => {
                    // remove the cookie
                    removeCookie("currentuser");
                    setTimeout(() => {
                      setLoading(true);
                      // redirect back to login page
                      window.location.href = "/login";
                      setLoading(false);
                    }, 500);
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
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </AppBar>
  );
}
