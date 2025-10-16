import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../components/Header";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getDoctorById } from "../api/api_doctors";
import { API_URL } from "../api/constants";

export default function DoctorPage() {
  const { id } = useParams();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    getDoctorById(id)
      .then((data) => setDoctor(data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!doctor) {
    return (
      <>
        <Header />
        <Container sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No Doctor Found.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container sx={{ py: 5 }}>
        <Button
          sx={{ marginBottom: "20px" }}
          onClick={() => {
            navigate("/doctors");
          }}
        >
          <ArrowBackIcon />
          Go Back
        </Button>
        <Card
          elevation={3}
          sx={{
            padding: "20px 50px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Doctor Image */}
          <CardMedia
            component="img"
            sx={{
              width: { xs: 250, md: 300 },
              height: { xs: 250, md: 300 },
              objectFit: "cover",
              borderRadius: "10px",
            }}
            image={
              API_URL +
              (doctor.image ? doctor.image : "uploads/default_image.png")
            }
            alt={doctor.name}
          />

          {/* Doctor Info */}
          <CardContent sx={{ flex: 1, p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {doctor.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {doctor.specialty?.specialty || "General Practitioner"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Email:</strong> {doctor.email}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: "pre-line" }}
            >
              {doctor.biography || "No biography available."}
            </Typography>

            {currentuser?.role === "patient" && (
              <Stack direction="row" justifyContent="flex-start" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  component={Link}
                  to={`/book-appointment/${id}`}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Book an Appointment
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
