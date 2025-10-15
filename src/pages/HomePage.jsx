import {
  Typography,
  Container,
  Grid,
  Box,
  CssBaseline,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Header from "../components/Header";
import { useState, useEffect } from "react";

const services = [
  {
    title: "Emergency Care",
    description: "24/7 emergency services for critical care and trauma.",
    image:
      "https://www.bcie.org/fileadmin/_processed_/6/a/csm_hospital_web_b185b30ce1.jpg",
  },
  {
    title: "Cardiology",
    description: "Advanced heart care with modern technologies.",
    image:
      "https://www.bcie.org/fileadmin/_processed_/6/a/csm_hospital_web_b185b30ce1.jpg",
  },
  {
    title: "Pediatrics",
    description: "Compassionate care for infants, children, and adolescents.",
    image:
      "https://www.bcie.org/fileadmin/_processed_/6/a/csm_hospital_web_b185b30ce1.jpg",
  },
];

const carouselSlides = [
  {
    title: "Quality Care, Close to Home",
    subtitle: "Compassionate staff. Advanced facilities.",
    image:
      "https://www.bcie.org/fileadmin/_processed_/6/a/csm_hospital_web_b185b30ce1.jpg",
  },
  {
    title: "Expert Doctors",
    subtitle: "Specialists across many fields ready to help.",
    image:
      "https://www.bcie.org/fileadmin/_processed_/6/a/csm_hospital_web_b185b30ce1.jpg",
  },
  {
    title: "Your Health, Our Priority",
    subtitle: "Preventive care and personalised treatment plans.",
    image:
      "https://www.bcie.org/fileadmin/_processed_/6/a/csm_hospital_web_b185b30ce1.jpg",
  },
];

function CarouselInner({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: `${slides.length * 100}%`,
          transform: `translateX(-${active * (100 / slides.length)}%)`,
          transition: "transform 700ms ease",
        }}
      >
        {slides.map((s, i) => (
          <Box
            key={i}
            sx={{
              width: `${100 / slides.length}%`,
              height: "100%",
              position: "relative",
              backgroundImage: `url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
            }}
          >
            {/* dark overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Container
                maxWidth="md"
                sx={{ textAlign: "center", color: "common.white" }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  {s.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mt: 1, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
                >
                  {s.subtitle}
                </Typography>
              </Container>
            </Box>
          </Box>
        ))}
      </Box>

      {/* indicator dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {slides.map((_, i) => (
          <Box
            key={i}
            onClick={() => setActive(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: i === active ? "common.white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              boxShadow:
                i === active ? "0 0 0 3px rgba(255,255,255,0.14)" : "none",
            }}
            aria-label={`Go to slide ${i + 1}`}
            role="button"
          />
        ))}
      </Box>
    </Box>
  );
}

export default function HospitalHome() {
  return (
    <>
      <CssBaseline />
      <Header />

      {/* Carousel: 3 slides, dark overlay, auto-scroll, and text container per slide */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          height: { xs: 250, sm: 320, md: 420 },
        }}
      >
        <CarouselInner slides={carouselSlides} />
      </Box>

      <Container sx={{ py: 8, backgroundColor: "rgb(251, 251, 251)" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid
              item
              key={service.title}
              size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography>{service.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
