import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
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
  const isMobile = useMediaQuery("(max-width:800px)");

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

  const localDateTime = (date) => {
    return dayjs(date).local().format("DD MMM YYYY, hh:mm A");
  };

  const isOlderThan3Years = (date) => {
    return dayjs().diff(dayjs(date), "year") >= 3;
  };
  const handleDeleteAppointment = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this appointment?",
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
      <Header />
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
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        {/* DESKTOP/TABLET VIEW */}
        {!isMobile ? (
          <Paper elevation={1} sx={{ marginY: 3, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Patient Email</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment, index) => {
                  const localDateAndTime = localDateTime(appointment.dateTime);

                  const oldAppointment = isOlderThan3Years(
                    appointment.dateTime
                  );

                  return (
                    <TableRow key={appointment._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography>{appointment.patientId.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{appointment.patientId.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{localDateAndTime}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          textTransform={"capitalize"}
                          color={
                            appointment.status === "cancelled"
                              ? "error.main"
                              : appointment.status === "completed"
                              ? "success.main"
                              : "text.primary"
                          }
                        >
                          {appointment.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {oldAppointment && (
                          <>
                            <Tooltip title="Delete Appointment">
                              <Button
                                color="error"
                                variant="contained"
                                onClick={() =>
                                  handleDeleteAppointment(appointment._id)
                                }
                              >
                                Delete
                              </Button>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          // MOBILE VIEW — CARD STYLE
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            {appointments.map((appointment, index) => {
              const localDateAndTime = localDateTime(appointment.dateTime);

              const oldAppointment = isOlderThan3Years(appointment.dateTime);

              return (
                <Box
                  key={appointment._id}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Box display={"flex"} gap={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {index + 1}.
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {appointment.patientId.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Specialty: {appointment.patientId.email}
                  </Typography>
                  <Typography variant="body2">
                    Date & Time: {localDateAndTime}
                  </Typography>
                  <Typography
                    textTransform={"capitalize"}
                    variant="body2"
                    color={
                      appointment.status === "cancelled"
                        ? "error.main"
                        : appointment.status === "completed"
                        ? "success.main"
                        : "text.primary"
                    }
                  >
                    Status: {appointment.status}
                  </Typography>
                  {oldAppointment && (
                    <>
                      <Tooltip title="Delete Appointment">
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() =>
                            handleDeleteAppointment(appointment._id)
                          }
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
        {appointments.length === 0 ? (
          <>
            <Container>
              <Typography>No appointments found.</Typography>
            </Container>
          </>
        ) : null}
      </Container>
    </>
  );

  /* get appoitnments. if the appointment dates are like 3 years ago, then show the delete button to delete the appointment.  */
}
