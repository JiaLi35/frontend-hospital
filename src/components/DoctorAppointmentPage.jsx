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
import { useEffect, useState, useRef, useMemo } from "react";
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
  const [status, setStatus] = useState("checked-in&status=scheduled");
  const [sort, setSort] = useState("asc");
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
            const updatedAppointments = await getAppointmentsByPatientId(
              id,
              status
            );
            setAppointments(updatedAppointments);
            toast.success("Appointment auto-cancelled after 30 minutes");
          } catch (error) {
            console.error("Auto-cancel failed", error);
          }
        })();
        return;
      }

      // otherwise schedule a timeout to cancel when deadline is reached
      // Note: browsers clamp setTimeout delays to a signed 32-bit int (~2_147_483_647 ms
      // which is ~24.85 days). Scheduling a single timeout longer than that will
      // either overflow or fire immediately, which caused far-future appointments
      // (e.g. in November) to be auto-cancelled as soon as the page loaded.
      const msUntilDeadline = deadline.diff(now);

      // Helper to schedule arbitrarily long delays by chaining timeouts.
      const MAX_TIMEOUT = 2147483647; // maximum safe setTimeout delay (~2^31-1)

      const scheduleCancelTimeout = (idToCancel, remainingMs) => {
        if (remainingMs <= 0) {
          // deadline already reached (or corner case after chaining) -> cancel now
          (async () => {
            try {
              await cancelAppointment(idToCancel, token);
              const updatedAppointments = await getAppointmentsByPatientId(
                id,
                status
              );
              setAppointments(updatedAppointments);
              toast.success("Appointment auto-cancelled after 30 minutes");
            } catch (error) {
              console.error("Auto-cancel failed", error);
            }
            cancelTimersRef.current.processed.add(idToCancel);
            delete cancelTimersRef.current.timers[idToCancel];
          })();
          return;
        }

        // If remaining time is larger than MAX_TIMEOUT, schedule a partial timeout
        // that will re-schedule the remainder when it fires.
        if (remainingMs > MAX_TIMEOUT) {
          const partial = setTimeout(() => {
            // remove this partial timer ref before scheduling next chunk
            if (cancelTimersRef.current.timers[idToCancel] === partial) {
              delete cancelTimersRef.current.timers[idToCancel];
            }
            scheduleCancelTimeout(idToCancel, remainingMs - MAX_TIMEOUT);
          }, MAX_TIMEOUT);
          cancelTimersRef.current.timers[idToCancel] = partial;
        } else {
          const finalTimer = setTimeout(async () => {
            try {
              await cancelAppointment(idToCancel, token);
              const updatedAppointments = await getAppointmentsByPatientId(
                id,
                status
              );
              setAppointments(updatedAppointments);
              toast.success("Appointment auto-cancelled after 30 minutes");
            } catch (error) {
              console.error("Auto-cancel failed", error);
            }
            cancelTimersRef.current.processed.add(idToCancel);
            delete cancelTimersRef.current.timers[idToCancel];
          }, remainingMs);

          cancelTimersRef.current.timers[idToCancel] = finalTimer;
        }
      };

      // start the chained timeout
      scheduleCancelTimeout(apptId, msUntilDeadline);
      // mark as processed so we don't schedule duplicates
      cancelTimersRef.current.processed.add(apptId);
    });

    return () => {
      Object.values(cancelTimersRef.current.timers).forEach((t) =>
        clearTimeout(t)
      );
      cancelTimersRef.current.timers = {};
    };
  }, [appointments, token]);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = dayjs(a.dateTime);
      const dateB = dayjs(b.dateTime);
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [appointments, sort]);

  return (
    <>
      <Box sx={{ backgroundColor: "rgb(251, 251, 251)" }}>
        <Header />
        <Container sx={{ mt: "40px", mb: "20px" }}>
          <Box sx={{ display: "flex", gap: "10px", mb: "10px" }}>
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
            <FormControl>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ backgroundColor: "#FFF" }}
              >
                Sort by date:
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Status"
                onChange={(event) => {
                  setSort(event.target.value);
                }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                  {sortedAppointments.map((appointment, index) => {
                    const localDateAndTime = localDateTime(
                      appointment.dateTime
                    );

                    if (
                      !currentuser ||
                      currentuser.role !== "doctor" ||
                      currentuser._id !== appointment.doctorId.user_id
                    ) {
                      navigate("/");
                      toast.error("Access denied");
                    }

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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
            >
              {sortedAppointments.map((appointment, index) => {
                const localDateAndTime = localDateTime(appointment.dateTime);

                if (
                  !currentuser ||
                  currentuser.role !== "doctor" ||
                  currentuser._id !== appointment.doctorId.user_id
                ) {
                  navigate("/");
                  toast.error("Access denied");
                }

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

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap={1}
                      mt={1}
                    >
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
      </Box>
    </>
  );
}
