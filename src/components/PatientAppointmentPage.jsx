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
import {
  getAppointmentsByPatientId,
  cancelAppointment,
} from "../api/api_appointments";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import Swal from "sweetalert2";

export default function PatientAppointmentPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("all");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointmentsByPatientId(id, status)
      .then((appointmentData) => {
        console.log(appointmentData);
        setAppointments(appointmentData);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }, [status]);

  const handleCancelAppointment = async (app_id) => {
    Swal.fire({
      title: "Are you sure you want to cancel this appointment?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      // once user confirm, then we delete the specialty
      if (result.isConfirmed) {
        try {
          await cancelAppointment(app_id);
          const updated = await getAppointmentsByPatientId(id, status);
          setAppointments(updated);
          toast.success("Successfully cancelled appointment");
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      }
    });
  };

  return (
    <>
      <Header title="Patient Manage Appointments" />

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
              <Typography>
                No appointments found.
                <Button to="/doctors" component={Link}>
                  Book an appointment now
                </Button>
              </Typography>
            </Container>
          </>
        ) : null}
        <Paper elevation={1}>
          {appointments.map((appointment) => {
            const localDateTime = dayjs(appointment.dateTime)
              .local()
              .format("DD MMM YYYY, hh:mm A");

            return (
              <Box
                key={appointment._id}
                display={"flex"}
                gap={3}
                sx={{ padding: "10px" }}
              >
                <Typography>{appointment.doctorId.name}</Typography>
                <Typography>
                  {appointment.doctorId.specialty.specialty}
                </Typography>
                <Typography>{localDateTime}</Typography>
                <Typography>{appointment.status}</Typography>
                <Button
                  to={`/appointment/${appointment._id}`}
                  component={Link}
                  variant="contained"
                >
                  View Appointment
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  disabled={
                    appointment.status === "cancelled" ||
                    appointment.status === "completed"
                      ? true
                      : false
                  }
                  onClick={() => handleCancelAppointment(appointment._id)}
                >
                  Cancel
                </Button>
              </Box>
            );
          })}
        </Paper>
      </Container>
    </>
  );
}
