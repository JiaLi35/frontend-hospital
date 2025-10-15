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
import { useState, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { getPatient } from "../api/api_patients";
import { getDoctorById } from "../api/api_doctors";
import { getSpecialties } from "../api/api_specialties";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "sonner";
import { newAppointment } from "../api/api_appointments";
import Header from "../components/Header";
dayjs.extend(customParseFormat);

export default function AppointmentAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = dayjs();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies; // use this currentuser to get user_id and compare with the user_id in doctor.
  const { token = "", _id = "" } = currentuser; // to pass on to check whether valid user or not
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

  /* 1. get doctor id from url 
     2. useEffect fetch doctor info (name, specialty) from doctorId
     3. useEffect fetch patient info (name, phone number, email, nric) from user_id
     4. fill in all fields (leave name, phone number, nric editable in case user is booking for another patient that dont have acc)
     5. Add data into database through API
  */

  useEffect(() => {
    if (!currentuser || currentuser.role !== "patient") {
      toast.error("Please login or signup as a patient first.");
      navigate("/signup");
    }

    getDoctorById(id)
      .then((doctorData) => {
        console.log(doctorData);
        // update the individual states with data
        setDoctorName(doctorData ? doctorData.name : "");
        setSpecialty(doctorData ? doctorData.specialty._id : "");
        setDoctorId(doctorData ? doctorData._id : "");
      })
      .catch((error) => {
        console.log(error);
      });

    getPatient(_id)
      .then((patientData) => {
        console.log(patientData);
        // update the individual states with data
        setPatientName(patientData ? patientData.name : "");
        setEmail(patientData ? patientData.email : "");
        setNric(patientData ? patientData.nric : "");
        setPhoneNumber(patientData ? patientData.phone_number : "");
        setPatientId(patientData ? patientData._id : "");
      })
      .catch((error) => {
        console.log(error);
      });

    getSpecialties()
      .then((data) => setSpecialties(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async () => {
    if (
      !doctorName ||
      !specialty ||
      !date ||
      !selectedTime ||
      !patientName ||
      !email ||
      !phoneNumber ||
      !nric
    ) {
      toast("Please fill in all the fields");
    } else {
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
        await newAppointment(doctorId, dateTime, patientId, token);
        toast("Successfully booked appointment");
        navigate(`/manage-appointments/${patientId}`); // go to manage appointments tab for patients
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <Header />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container sx={{ marginY: "30px" }}>
          <Button
            sx={{ marginBottom: "20px" }}
            onClick={() => {
              navigate("/doctors");
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
                value={doctorName}
                onChange={(event) => {
                  setDoctorName(event.target.value);
                }}
                slotProps={{ htmlInput: { readOnly: true } }}
              />
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Specialty</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={specialty}
                  label="Specialty"
                  onChange={(event) => {
                    setSpecialty(event.target.value);
                  }}
                  slotProps={{ htmlInput: { readOnly: true } }}
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
                          No timeslots available for today. Please book another
                          day.
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
                              color: selectedTime === time ? "#fff" : "#2196f3",
                              backgroundColor:
                                selectedTime === time
                                  ? "#2196f3"
                                  : "transparent",
                              "&:hover": {
                                backgroundColor:
                                  selectedTime === time ? "#1976d2" : "#e3f2fd",
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
                label="Patient Name"
                placeholder="Name"
                fullWidth
                value={patientName}
                onChange={(event) => {
                  setPatientName(event.target.value);
                }}
                slotProps={{ htmlInput: { readOnly: true } }}
              />
              <TextField
                label="Email"
                placeholder="Email"
                fullWidth
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                slotProps={{ htmlInput: { readOnly: true } }}
              />
            </Box>
            <Box mb={2} display={"flex"} gap={3}>
              <TextField
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
                slotProps={{ htmlInput: { readOnly: true } }}
              />
              <TextField
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
                slotProps={{ htmlInput: { readOnly: true } }}
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleSubmit}
            >
              Book Appointment
            </Button>
          </Paper>
        </Container>
      </LocalizationProvider>
    </>
  );
}
