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
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { deleteAppointment, getAppointments } from "../api/api_appointments";
import Header from "./Header";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import Swal from "sweetalert2";
import { toast } from "sonner";

export default function AdminAppointmentPage() {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const [status, setStatus] = useState("all");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments(status)
      .then((appointmentData) => {
        setAppointments(appointmentData);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }, [status]);

  const handleDeleteAppointment = async (id) => {
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
          await deleteAppointment(id, token);
          const updatedAppointments = await getAppointments(status);
          setAppointments(updatedAppointments);
          toast.success("Successfully deleted appointment.");
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      }
    });
  };

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

        <Paper elevation={1} sx={{ marginY: "20px" }}>
          {appointments.map((appointment, index) => {
            const localDateTime = dayjs(appointment.dateTime)
              .local()
              .format("DD MMM YYYY, hh:mm A");

            const isOlderThan3Years =
              dayjs().diff(dayjs(appointment.dateTime), "year") >= 3;

            return (
              <Box
                key={appointment._id}
                display={"flex"}
                gap={3}
                sx={{ padding: "20px" }}
              >
                <Typography>{index + 1}</Typography>
                <Typography>{appointment.patientId.name}</Typography>
                <Typography>{appointment.patientId.email}</Typography>
                <Typography>{localDateTime}</Typography>
                <Typography>{appointment.status}</Typography>
                {isOlderThan3Years && (
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDeleteAppointment(appointment._id)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            );
          })}
          {appointments.length === 0 ? (
            <>
              <Container>
                <Typography>No appointments found.</Typography>
              </Container>
            </>
          ) : null}
        </Paper>
      </Container>
    </>
  );

  /* get appoitnments. if the appointment dates are like 3 years ago, then show the delete button to delete the appointment.  */
}
