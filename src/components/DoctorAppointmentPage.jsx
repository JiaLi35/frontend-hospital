import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { getAppointmentsByDoctorId } from "../api/api_appointments";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export default function DoctorAppointmentPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("all");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointmentsByDoctorId(id, status)
      .then((appointmentData) => {
        console.log(appointmentData);
        setAppointments(appointmentData);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }, [status]);

  return (
    <>
      <Header title="Doctor Manage Appointments" />

      <Container>
        <FormControl sx={{ mb: "10px" }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="Status"
            onChange={(event) => {
              setStatus(event.target.value);
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="rescheduled">Rescheduled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        {appointments.length === 0 ? (
          <>
            <Container>
              <Typography>No appointments found.</Typography>
            </Container>
          </>
        ) : null}
        <Paper elevation={1}>
          {appointments.map((appointment) => (
            <Box key={appointment._id} display={"flex"} gap={3}>
              <Typography>{appointment.patientId.name}</Typography>
              <Typography>{appointment.patientId.email}</Typography>
              <Typography>{appointment.dateTime}</Typography>
              <Typography>{appointment.status}</Typography>
              <Button to={`/appointment/${appointment._id}`} component={Link}>
                View Appointment
              </Button>
            </Box>
          ))}
        </Paper>
      </Container>
    </>
  );
}
