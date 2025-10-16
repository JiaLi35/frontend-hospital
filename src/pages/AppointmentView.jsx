import {
  Container,
  Paper,
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import { getAppointment, updateAppointment } from "../api/api_appointments";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getSpecialties } from "../api/api_specialties";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCookies } from "react-cookie";
dayjs.extend(customParseFormat);

export default function AppointmentView() {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const { id } = useParams();
  const navigate = useNavigate();
  const today = dayjs();
  const [userId, setUserId] = useState(""); // user id for navigation purposes
  const [specialties, setSpecialties] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [nric, setNric] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [status, setStatus] = useState("");

  const timeSlots = useMemo(
    () => [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ],
    []
  );

  useEffect(() => {
    if (currentuser && currentuser.role === "patient") {
      setUserId(patientId);
    } else if (currentuser && currentuser.role === "doctor") {
      setUserId(doctorId);
    } else {
      navigate("/login");
      toast.error("Something went wrong, please login first.");
    }
  }, [currentuser, patientId, doctorId]);

  useEffect(() => {
    getAppointment(id)
      .then((appointmentData) => {
        setDoctorId(appointmentData ? appointmentData.doctorId._id : "");
        setDoctorName(appointmentData ? appointmentData.doctorId.name : "");
        setSpecialty(
          appointmentData ? appointmentData.doctorId.specialty._id : ""
        );
        setPatientId(appointmentData ? appointmentData.patientId._id : "");
        setPatientName(appointmentData ? appointmentData.patientId.name : "");
        setEmail(appointmentData ? appointmentData.patientId.email : "");
        setNric(appointmentData ? appointmentData.patientId.nric : "");
        setPhoneNumber(
          appointmentData ? appointmentData.patientId.phone_number : ""
        );
        // ISO datetime string from backend
        const isoDateTime = appointmentData.dateTime;

        // Convert ISO → dayjs object
        const dayjsDateTime = dayjs(isoDateTime);

        // 1️⃣ Extract date part (for DateCalendar)
        setDate(dayjsDateTime.startOf("day"));

        // 2️⃣ Extract time part (for timeSlots)
        // Format to something like "09:30 AM"
        const formattedTime = dayjsDateTime.format("hh:mm A");
        setSelectedTime(formattedTime);
        setStatus(appointmentData ? appointmentData.status : "");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });

    getSpecialties()
      .then((data) => {
        setSpecialties(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, []);

  const handleUpdateAppointment = async () => {
    // Combine date and time
    const combinedDateTime = dayjs(
      `${date.format("YYYY-MM-DD")} ${selectedTime}`,
      "YYYY-MM-DD hh:mm A"
    );

    const now = dayjs();

    // ✅ Validation: prevent booking in the past
    if (combinedDateTime.isBefore(now)) {
      toast.error(
        "You cannot select a past date or time. Please choose another time slot."
      );
      return;
    }

    // Convert to ISO string
    const dateTime = combinedDateTime.toISOString();

    try {
      await updateAppointment(id, doctorId, patientId, dateTime, token);
      toast.success("Successfully updated Appointment");
      navigate(`/manage-appointments/${userId}`);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: "rgb(251, 251, 251)" }}>
        <Header />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container sx={{ marginY: "30px" }}>
            <Button
              sx={{ marginBottom: "20px" }}
              onClick={() => {
                navigate(`/manage-appointments/${userId}`);
              }}
            >
              <ArrowBackIcon />
              Go Back
            </Button>
            <Paper elevation={1} sx={{ padding: "20px" }}>
              <Box mb={2} display={"flex"} gap={3}>
                <TextField
                  label="Doctor Name"
                  placeholder="Name"
                  fullWidth
                  disabled
                  value={doctorName}
                  onChange={(event) => {
                    setDoctorName(event.target.value);
                  }}
                />
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-label">
                    Specialty
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    disabled
                    value={specialty}
                    label="Specialty"
                    onChange={(event) => {
                      setSpecialty(event.target.value);
                    }}
                  >
                    {specialties.map((spe) => (
                      <MenuItem value={spe._id} key={spe._id}>
                        {spe.specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Grid container spacing={1} mb={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateCalendar
                    views={["year", "month", "day"]}
                    autoFocus
                    disabled={
                      status === "cancelled" || status === "completed"
                        ? true
                        : false
                    }
                    disablePast
                    minDate={today}
                    maxDate={today.add(1, "year")}
                    value={date}
                    onChange={(newValue) => {
                      setSelectedTime(null);
                      setDate(newValue);
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography mb={2}>Select a time: </Typography>
                  {(() => {
                    const availableTimeSlots = timeSlots.filter((time) => {
                      // Only filter if the selected date is today
                      if (date && date.isSame(today, "day")) {
                        const now = dayjs();
                        const slotTime = dayjs(time, "hh:mm A");

                        // Compare by converting slotTime to today’s date + that time
                        const slotDateTime = today
                          .hour(slotTime.hour())
                          .minute(slotTime.minute());

                        return slotDateTime.isAfter(now);
                      }

                      // For future dates, show all slots
                      return true;
                    });

                    // ✅ If no available slots, show message box
                    if (availableTimeSlots.length === 0) {
                      return (
                        <Box
                          sx={{
                            p: 2,
                            border: "1px dashed #ccc",
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            textAlign: "center",
                          }}
                        >
                          <Typography color="text.secondary">
                            No timeslots available for today. Please book
                            another day.
                          </Typography>
                        </Box>
                      );
                    }

                    return (
                      <Grid container spacing={2}>
                        {availableTimeSlots.map((time) => (
                          <Grid
                            item
                            size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                            key={time}
                            gap={3}
                          >
                            <Button
                              disabled={
                                status === "cancelled" || status === "completed"
                                  ? true
                                  : false
                              }
                              fullWidth
                              variant={
                                selectedTime === time ? "contained" : "outlined"
                              }
                              onClick={() => {
                                setSelectedTime(time);
                              }}
                              sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                borderColor: "#2196f3",
                                color:
                                  selectedTime === time ? "#fff" : "#2196f3",
                                backgroundColor:
                                  selectedTime === time
                                    ? "#2196f3"
                                    : "transparent",
                                "&:hover": {
                                  backgroundColor:
                                    selectedTime === time
                                      ? "#1976d2"
                                      : "#e3f2fd",
                                },
                              }}
                            >
                              {time}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    );
                  })()}
                </Grid>
              </Grid>
              <Box mb={2} display={"flex"} gap={3}>
                <TextField
                  disabled
                  label="Patient Name"
                  placeholder="Name"
                  fullWidth
                  value={patientName}
                  onChange={(event) => {
                    setPatientName(event.target.value);
                  }}
                />
                <TextField
                  label="Email"
                  disabled
                  placeholder="Email"
                  fullWidth
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </Box>
              <Box mb={2} display={"flex"} gap={3}>
                <TextField
                  disabled
                  label="NRIC No."
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
                <TextField
                  disabled
                  label="Phone Number"
                  placeholder="Phone Number"
                  fullWidth
                  value={phoneNumber}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "") // remove non-digits
                      .slice(0, 10); // limit to 10 digits
                  }}
                />
              </Box>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                disabled={
                  status === "cancelled" || status === "completed"
                    ? true
                    : false
                }
                onClick={handleUpdateAppointment}
              >
                Reschedule Appointment
              </Button>
            </Paper>
          </Container>
        </LocalizationProvider>
      </Box>
    </>
  );
}
