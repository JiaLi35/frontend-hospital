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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BlockIcon from "@mui/icons-material/Block";
import DoneIcon from "@mui/icons-material/Done";
import Header from "./Header";
import { useEffect, useState, useRef } from "react";
import {
  cancelAppointment,
  completeAppointment,
  getAppointmentsByDoctorId,
} from "../api/api_appointments";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useCookies } from "react-cookie";
dayjs.extend(utc);
dayjs.extend(timezone);
import Swal from "sweetalert2";

export default function DoctorAppointmentPage() {
  const { id } = useParams();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const [status, setStatus] = useState("checked-in");
  const [appointments, setAppointments] = useState([]);
  const isMobile = useMediaQuery("(max-width:875px)");

  useEffect(() => {
    getAppointmentsByDoctorId(id, status)
      .then((appointmentData) => {
        setAppointments(appointmentData);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message);
      });

    if (!currentuser || currentuser.role !== "doctor") {
      navigate("/");
      toast.error("Access denied");
    }
  }, [status]);

  const localDateTime = (date) => {
    return dayjs(date).local().format("DD MMM YYYY, hh:mm A");
  };

  const refreshAppointments = async () => {
    const updated = await getAppointmentsByDoctorId(id, status);
    setAppointments(updated);
  };

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
          await refreshAppointments();
          toast.success("Successfully cancelled appointment");
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      }
    });
  };

  const handleCompleteAppointment = async (app_id) => {
    try {
      await completeAppointment(app_id, token);
      toast.success("Appointment marked as complete.");
      await refreshAppointments();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Auto-cancel appointments that are more than 30 minutes past their scheduled time.
  // - For appointments already past the 30-min deadline, cancel immediately.
  // - For future deadlines, schedule a timeout to auto-cancel when the deadline is reached.
  // Uses a ref to keep track of timers and already-processed IDs to avoid duplicate API calls.
  const cancelTimersRef = useRef({ timers: {}, processed: new Set() });

  useEffect(() => {
    // clear existing timers
    Object.values(cancelTimersRef.current.timers).forEach((t) =>
      clearTimeout(t)
    );
    cancelTimersRef.current.timers = {};

    if (!appointments || appointments.length === 0) return;

    appointments.forEach((appt) => {
      if (!appt || !appt._id) return;
      const apptId = appt._id;
      // skip if all appointments that aren't scheduled.
      if (appt.status !== "scheduled") return;
      // don't re-process IDs we've already scheduled/cancelled
      if (cancelTimersRef.current.processed.has(apptId)) return;

      const deadline = dayjs(appt.dateTime).add(30, "minute").local();
      const now = dayjs().local();

      // if we're already past the deadline, cancel immediately
      if (now.isAfter(deadline)) {
        cancelTimersRef.current.processed.add(apptId);
        (async () => {
          try {
            await cancelAppointment(apptId, token);
            refreshAppointments();
            toast.success("Appointment auto-cancelled after 30 minutes");
          } catch (error) {
            console.error("Auto-cancel failed", error);
          }
        })();
        return;
      }

      // otherwise schedule a timeout to cancel when deadline is reached
      const msUntilDeadline = deadline.diff(now);
      const timer = setTimeout(async () => {
        try {
          await cancelAppointment(apptId, token);
          refreshAppointments();
          toast.success("Appointment auto-cancelled after 30 minutes");
        } catch (error) {
          console.error("Auto-cancel failed", error);
        }
        cancelTimersRef.current.processed.add(apptId);
        delete cancelTimersRef.current.timers[apptId];
      }, msUntilDeadline);

      cancelTimersRef.current.timers[apptId] = timer;
      cancelTimersRef.current.processed.add(apptId);
    });

    return () => {
      Object.values(cancelTimersRef.current.timers).forEach((t) =>
        clearTimeout(t)
      );
      cancelTimersRef.current.timers = {};
    };
  }, [appointments, token]);

  return (
    <>
      <Header />
      <Container sx={{ mt: "40px", mb: "20px" }}>
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

                  return (
                    <TableRow key={appointment._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ maxWidth: "200px" }}>
                        <Typography
                          sx={{
                            whiteSpace: "normal", // allow wrapping
                            overflowWrap: "break-word", // break long words if necessary
                            wordBreak: "break-word", // additional safety for long strings
                          }}
                        >
                          {appointment.patientId.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: "200px" }}>
                        <Typography
                          sx={{
                            whiteSpace: "normal", // allow wrapping
                            overflowWrap: "break-word", // break long words if necessary
                            wordBreak: "break-word", // additional safety for long strings
                          }}
                        >
                          {appointment.patientId.email}
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
                        <Box display={"flex"} gap={1}>
                          <Tooltip
                            title={
                              appointment.status === "cancelled" ||
                              appointment.status === "completed"
                                ? "View Appointment"
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
                          {appointment.status === "checked-in" && (
                            <Tooltip title="Complete Appointment">
                              <Button
                                color="success"
                                variant="contained"
                                onClick={() =>
                                  handleCompleteAppointment(appointment._id)
                                }
                              >
                                <DoneIcon />
                              </Button>
                            </Tooltip>
                          )}
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
                        </Box>
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

                  <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                    <Tooltip
                      title={
                        appointment.status === "cancelled" ||
                        appointment.status === "completed"
                          ? "View Appointment"
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
                    {appointment.status === "checked-in" && (
                      <Tooltip title="Complete Appointment">
                        <Button
                          color="success"
                          variant="contained"
                          onClick={() =>
                            handleCompleteAppointment(appointment._id)
                          }
                        >
                          <DoneIcon />
                        </Button>
                      </Tooltip>
                    )}
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
                  </Box>
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
}
