import {
  Container,
  Grid,
  Button,
  Typography,
  Select,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getSpecialties } from "../api/api_specialties";
import { deleteDoctor, getDoctors } from "../api/api_doctors";
import { toast } from "sonner";
import { API_URL } from "../api/constants";
import { Link } from "react-router";
import Swal from "sweetalert2";
import "../index.css";

// this is where everyone views each doctor
export default function DoctorFind() {
  const [cookies] = useCookies("currentuser");
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState("all");
  const [expanded, setExpanded] = useState(null); // "profile" | "appointment" | null

  useEffect(() => {
    getSpecialties()
      .then((data) => {
        setSpecialties(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    // get doctors from API
    getDoctors(specialty)
      .then((data) => {
        console.log(data);
        setDoctors(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [specialty]);

  const handleDoctorDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this doctor?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      // once user confirm, then we delete the doctor
      if (result.isConfirmed) {
        try {
          await deleteDoctor(id, token);
          toast.success("Doctor deleted successfully.");
          const updatedDoctors = await getDoctors(specialty);
          setDoctors(updatedDoctors);
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      }
    });
  };

  return (
    <>
      <Box sx={{ backgroundColor: "rgb(251, 251, 251)" }}>
        <Header />
        <Box sx={{ width: "99vw", overflow: "hidden" }}>
          <Box
            component="img"
            src="/Find a Doctor.png"
            sx={{
              height: "300px",
              width: "100%",
              objectFit: "cover", // fills box without stretching
              objectPosition: "center", // keeps the focal point centered
              display: "block", // removes extra spacing
            }}
          />
        </Box>
        <Container maxWidth="xl">
          <Grid container spacing={3} sx={{ py: 4 }}>
            {/* Filter Section */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ py: 2 }}>
                <Typography
                  variant="h5"
                  textAlign={"left"}
                  mb={2}
                  fontWeight={"bold"}
                >
                  Search
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="specialty-select-label">Specialty</InputLabel>
                  <Select
                    labelId="specialty-select-label"
                    id="specialty-select"
                    value={specialty}
                    label="Specialty"
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <MenuItem value="all">All Specialties</MenuItem>
                    {specialties.map((spe) => (
                      <MenuItem key={spe._id} value={spe._id}>
                        {spe.specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Doctors Section */}
            <Grid size={{ xs: 12, md: 10 }}>
              <Grid container spacing={3}>
                {doctors.length === 0 ? (
                  <Typography
                    variant="h5"
                    sx={{ py: 4, textAlign: "center", width: "100%" }}
                  >
                    No doctors found.
                  </Typography>
                ) : (
                  doctors.map((doc) => (
                    <Grid key={doc._id} size={{ xs: 12, sm: 12, lg: 6 }}>
                      <Card
                        sx={{
                          minHeight: "186px",
                          minWidth: "220px",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: "center",
                          p: 1,
                          borderRadius: 3,
                          gap: 2,
                        }}
                      >
                        {/* Doctor Image */}
                        <CardMedia
                          component="img"
                          image={
                            API_URL +
                            (doc.image
                              ? doc.image
                              : "uploads/default_image.png")
                          }
                          sx={{
                            width: 150,
                            height: 150,
                            borderRadius: 2,
                            objectFit: "cover",
                          }}
                        />

                        {/* Doctor Info */}
                        <CardContent sx={{ flex: 1, textAlign: "left", p: 0 }}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              whiteSpace: "normal", // allow wrapping
                              overflowWrap: "break-word", // break long words if necessary
                              wordBreak: "break-word", // additional safety for long strings
                            }}
                          >
                            {doc.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              whiteSpace: "normal", // allow wrapping
                              overflowWrap: "break-word", // break long words if necessary
                              wordBreak: "break-word", // additional safety for long strings
                            }}
                          >
                            {doc.specialty.specialty || "No Biography"}
                          </Typography>

                          {/* Buttons */}
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            {/* View Profile */}
                            <Button
                              variant="contained"
                              size="small"
                              to={`/doctor/${doc._id}`}
                              component={Link}
                              className={`expand-button ${
                                expanded === `profile-${doc._id}`
                                  ? "expanded"
                                  : ""
                              }`}
                              onMouseEnter={() =>
                                setExpanded(`profile-${doc._id}`)
                              }
                              onMouseLeave={() => setExpanded(null)}
                            >
                              <PersonIcon className="button-icon" />
                              <span className="button-text">View Profile</span>
                            </Button>

                            {/* Book Appointment (patients only) */}
                            {currentuser?.role === "patient" && (
                              <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                to={`/book-appointment/${doc._id}`}
                                component={Link}
                                className={`expand-button ${
                                  expanded === `appointment-${doc._id}`
                                    ? "expanded"
                                    : ""
                                }`}
                                onMouseEnter={() =>
                                  setExpanded(`appointment-${doc._id}`)
                                }
                                onMouseLeave={() => setExpanded(null)}
                              >
                                <CalendarMonthIcon className="button-icon" />
                                <span className="button-text">
                                  Book Appointment
                                </span>
                              </Button>
                            )}

                            {/* Delete (admins only) */}
                            {currentuser?.role === "admin" && (
                              <Tooltip title="Delete doctor">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDoctorDelete(doc._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
