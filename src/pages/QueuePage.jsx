import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAppointment } from "../api/api_appointments";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Container, Typography } from "@mui/material";
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
  const { currentuser } = cookies;
  const { token } = currentuser;
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
    if (!currentuser || currentuser.role !== "patient") {
      navigate("/");
      toast.error("Access denied");
    }

    getAppointment(id)
      .then((appointmentData) => {
        // set appointment data
        console.log(appointmentData);
        setAppointmentId(appointmentData ? appointmentData._id : "");
        // if a completed / cancelled appointment, redirect out.
        if (currentuser && currentuser.role !== "patient") {
          navigate("/");
          toast.error("Access denied.");
        } else if (
          appointmentData.status !== "scheduled" &&
          appointmentData.status !== "checked-in" &&
          !dayjs(appointmentData.dateTime).isSame(dayjs(), "day")
        ) {
          navigate(`/manage-appointments/${appointmentData.patientId._id}`);
          toast("heloo");
        }
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
  }, [patientNumber, currentNumber]);

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
      <Header />
      <Container sx={{ mt: "40px", mb: "20px" }}>
        <Typography variant="h3">Check-In Appointment</Typography>
        <Typography>
          {patientNumber
            ? "Please wait for your number."
            : "Do you want to check in to this appointment?"}
        </Typography>

        <Box my={3}>
          <Typography>Appointment Details: </Typography>
          <Typography>Date: {date}</Typography>
          <Typography>Doctor Name: {doctorName}</Typography>
          <Typography>Specialty: {specialty}</Typography>
          <Typography>Patient Name: {patientName}</Typography>
          <Typography>Patient Email: {email}</Typography>
          <Typography>Patient Phone Number: {phoneNumber}</Typography>
        </Box>
        {!patientNumber && (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleCheckIn()}
          >
            Check In
          </Button>
        )}
        <Box>
          <Typography>
            Current queue number:{" "}
            {currentNumber ? currentNumber : "No queue for today."}
          </Typography>
          {patientNumber && (
            <Typography>Your queue number: {patientNumber}</Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
