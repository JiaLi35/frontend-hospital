import { Button, Container, Paper, Typography } from "@mui/material";
import Header from "../components/Header";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getDoctorById } from "../api/api_doctors";

export default function DoctorPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    getDoctorById(id)
      .then((doctorData) => {
        setName(doctorData ? doctorData.name : "");
        setBiography(doctorData ? doctorData.biography : "");
        setSpecialty(doctorData ? doctorData.specialty.specialty : "");
        setEmail(doctorData ? doctorData.email : "");
        setImage(doctorData ? doctorData.image : null);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Header title="Doctor Page" />
      <Container>
        <Paper elevation={1} sx={{ padding: "20px" }}>
          <Typography>Name: {name}</Typography>
          <Typography>Email: {email}</Typography>
          <Typography>Specialty: {specialty}</Typography>
          <Typography>Biography: {biography}</Typography>
          {/* <Typography>Name: {name}</Typography> */}
          <Button to={`/book-appointment/${id}`} component={Link}>
            Book appointment
          </Button>
        </Paper>
      </Container>
    </>
  );
}
