import {
  Container,
  Grid,
  Button,
  Typography,
  Select,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getSpecialties } from "../api/api_specialties";
import { getDoctors } from "../api/api_doctors";
import { toast } from "sonner";

// this is where everyone views each doctor
export default function DoctorFind() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState("all");

  useEffect(() => {
    getSpecialties()
      .then((data) => {
        setSpecialties(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    // get doctors from API
    getDoctors(specialty)
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [specialty]);

  return (
    <>
      <Header title={"Find a Doctor"} />
      <Container>
        <Box sx={{ py: 2 }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Specialty</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={specialty}
              label="Specialty"
              onChange={(event) => {
                setSpecialty(event.target.value);
              }}
            >
              <MenuItem value="all">Choose a Specialty</MenuItem>
              {specialties.map((spe) => (
                <MenuItem value={spe._id}>{spe.specialty}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={4}>
          {doctors.length === 0 ? (
            <Typography variant="h4" sx={{ py: 3, textAlign: "center" }}>
              No doctors found.
            </Typography>
          ) : null}
          {doctors.map((doc) => (
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Card>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image="https://gametora.com/images/umamusume/characters/chara_stand_1016_101601.png"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {doc.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Narita Brian is my favourite umamusume
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View Profile</Button>
                  <Button size="small">Book an Appointment</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
