import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAppointment } from "../api/api_appointments";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  getCurrentQueueNumber,
  getPatientQueueNumber,
  newQueueNumber,
} from "../api/api_queue";
import { useCookies } from "react-cookie";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function QueuePage() {
  const [cookies] = useCookies();
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentId, setAppointmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [patientNumber, setPatientNumber] = useState("");

  useEffect(() => {
    getAppointment(id)
      .then((appointmentData) => {
        // if a completed / cancelled appointment, redirect out.
        if (!currentuser || currentuser.role !== "patient") {
          navigate("/");
        } else if (
          (appointmentData.status !== "scheduled" &&
            appointmentData.status !== "checked-in") ||
          !dayjs(appointmentData.dateTime).isSame(dayjs(), "day")
        ) {
          navigate(`/manage-appointments/${appointmentData.patientId._id}`);
          toast("Cannot check in for this appointment.");
        }
        // set appointment data
        setAppointmentId(appointmentData ? appointmentData._id : "");
        // doctor info
        setDoctorId(appointmentData ? appointmentData.doctorId._id : "");
        setDoctorName(appointmentData ? appointmentData.doctorId.name : "");
        setSpecialty(
          appointmentData ? appointmentData.doctorId.specialty.specialty : ""
        );
        // patient info
        setPatientId(appointmentData ? appointmentData.patientId._id : "");
        setPatientName(appointmentData ? appointmentData.patientId.name : "");
        setEmail(appointmentData ? appointmentData.patientId.email : "");
        setPhoneNumber(
          appointmentData ? appointmentData.patientId.phone_number : ""
        );
        // ISO datetime string from backend
        const isoDateTime = appointmentData.dateTime;

        // Convert ISO → dayjs object
        const formattedTime = dayjs(isoDateTime)
          .local()
          .format("DD MMM YYYY, hh:mm A");

        setDate(formattedTime);

        // set the current queue number for the doctor
        getCurrentQueueNumber(
          appointmentData ? appointmentData.doctorId._id : ""
        )
          .then((data) => {
            console.log(data);
            setCurrentNumber(data.number);
          })
          .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message);
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message);
      });
  }, [currentNumber]);

  useEffect(() => {
    // set the Patient's queue number
    getPatientQueueNumber(id)
      .then((data) => {
        console.log(data);
        setPatientNumber(data.number);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message);
      });
  }, [id, patientNumber]);

  // patient gets a new queue number, and show the current queue number
  const handleCheckIn = async () => {
    try {
      await newQueueNumber(doctorId, patientId, appointmentId, token);
      const updatedQueueNumber = await getCurrentQueueNumber(doctorId);
      setCurrentNumber(updatedQueueNumber.number);
      const updatedPatientNumber = await getPatientQueueNumber(appointmentId);
      setPatientNumber(updatedPatientNumber.number);
      toast.success("Successfully checked in!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: "rgb(251, 251, 251)" }}>
        <Header />
        <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
          <Button
            sx={{ marginBottom: "20px" }}
            onClick={() => {
              navigate(`/manage-appointments/${patientId}`);
            }}
          >
            <ArrowBackIcon />
            Go Back
          </Button>
          <Box
            sx={{
              display: "flex",
              gap: { xs: "10px", sm: "200px", md: "275px" },
            }}
          >
            {/* Page Title */}
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Check-In Appointment
              </Typography>

              <Typography variant="subtitle1" color="text.secondary" mb={3}>
                {patientNumber
                  ? "Thank you for checking in. Please wait for your turn."
                  : "Confirm your details below to check in for your appointment."}
              </Typography>
            </Box>

            {/* Action Buttons */}
            {!patientNumber ? (
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleCheckIn}
                  sx={{ borderRadius: 2, px: 4, py: 1.2 }}
                >
                  Check In
                </Button>
              </Box>
            ) : null}
          </Box>

          {/* Appointment Info Card */}
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              p: 3,
              mb: 4,
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom textAlign="center" mb={3}>
                Appointment Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Date
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {date}
                  </Typography>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Doctor
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {doctorName}
                  </Typography>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Specialty
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {specialty}
                  </Typography>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Your Name (Patient)
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {patientName}
                  </Typography>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Email
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {email}
                  </Typography>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Phone Number
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Queue Info Section */}
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: "background.default",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Queue Status
            </Typography>
            <Typography variant="body1" mb={1}>
              Current queue number:{" "}
              <strong>{currentNumber || "No queue for today."}</strong>
            </Typography>
            {patientNumber && (
              <Typography
                variant="body1"
                color="success.main"
                fontWeight="bold"
              >
                Your queue number: {patientNumber}
              </Typography>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
}
