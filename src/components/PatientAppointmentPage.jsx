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
import BlockIcon from "@mui/icons-material/Block";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "./Header";
import { useEffect, useState } from "react";
import {
  getAppointmentsByPatientId,
  cancelAppointment,
} from "../api/api_appointments";
import { Link, useParams } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import Swal from "sweetalert2";

export default function PatientAppointmentPage() {
  const { id } = useParams();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const [status, setStatus] = useState("checked-in&status=scheduled");
  const [appointments, setAppointments] = useState([]);
  const isMobile = useMediaQuery("(max-width:890px)");

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
          await cancelAppointment(app_id, token);
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

  const localDateTime = (date) => {
    return dayjs(date).local().format("DD MMM YYYY, hh:mm A");
  };

  const isToday = (date) => {
    return dayjs(date).isSame(dayjs(), "day");
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
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
            <MenuItem value="checked-in&status=scheduled">
              Scheduled & Check In
            </MenuItem>
            <MenuItem value="checked-in">Checked-In</MenuItem>
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
                  <TableCell>Doctor Name</TableCell>
                  <TableCell>Specialty</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment, index) => {
                  const localDateAndTime = localDateTime(appointment.dateTime);
                  const todayDate = isToday(appointment.dateTime);

                  return (
                    <TableRow key={appointment._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography>{appointment.doctorId.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {appointment.doctorId.specialty.specialty}
                        </Typography>
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
                        {todayDate &&
                          (appointment.status === "scheduled" ||
                            appointment.status === "checked-in") && (
                            <Tooltip title="Check-In">
                              <Button
                                color="success"
                                variant="contained"
                                sx={{ marginRight: "10px" }}
                                to={`/queue/${appointment._id}`}
                                component={Link}
                              >
                                Check In
                              </Button>
                            </Tooltip>
                          )}
                        <Tooltip
                          title={
                            appointment.status === "cancelled" ||
                            appointment.status === "completed"
                              ? "View Appointment Details"
                              : "Reschedule Appointment"
                          }
                        >
                          <Button
                            color="primary"
                            variant="contained"
                            to={`/appointment/${appointment._id}`}
                            component={Link}
                          >
                            {appointment.status === "cancelled" ||
                            appointment.status === "completed" ? (
                              <VisibilityIcon />
                            ) : (
                              <CalendarMonthIcon />
                            )}
                          </Button>
                        </Tooltip>
                        {(appointment.status === "scheduled" ||
                          appointment.status === "checked-in") && (
                          <Tooltip title="Cancel Appointment">
                            <Button
                              color="error"
                              variant="contained"
                              sx={{ ml: 1 }}
                              onClick={() =>
                                handleCancelAppointment(appointment._id)
                              }
                            >
                              <BlockIcon />
                            </Button>
                          </Tooltip>
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
              const todayDate = isToday(appointment.dateTime);
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
                      {appointment.doctorId.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Specialty: {appointment.doctorId.specialty.specialty}
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

                  <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                    {todayDate &&
                      (appointment.status === "scheduled" ||
                        appointment.status === "checked-in") && (
                        <Tooltip title="Check-In">
                          <Button color="success" variant="contained">
                            Check In
                          </Button>
                        </Tooltip>
                      )}
                    <Tooltip
                      title={
                        appointment.status === "cancelled" ||
                        appointment.status === "completed"
                          ? "View Appointment Details"
                          : "Reschedule Appointment"
                      }
                    >
                      <Button
                        to={`/appointment/${appointment._id}`}
                        component={Link}
                        size="small"
                        color="primary"
                        variant="contained"
                      >
                        {appointment.status === "cancelled" ||
                        appointment.status === "completed" ? (
                          <VisibilityIcon fontSize="small" />
                        ) : (
                          <CalendarMonthIcon fontSize="small" />
                        )}
                      </Button>
                    </Tooltip>
                    {(appointment.status === "scheduled" ||
                      appointment.status === "checked-in") && (
                      <Tooltip title="Cancel Appointment">
                        <Button
                          color="error"
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleCancelAppointment(appointment._id)
                          }
                        >
                          <BlockIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
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
      </Container>
    </>
  );
}
