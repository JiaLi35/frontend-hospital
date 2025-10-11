import Header from "./Header";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { getDoctor, updateDoctor } from "../api/api_doctors";
import { getSpecialties } from "../api/api_specialties";
import { uploadImage } from "../api/api_image";
import { API_URL } from "../api/constants";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function DoctorUpdateProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // retrieve id from the url
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies; // use this currentuser to get user_id and compare with the user_id in doctor.
  const { token = "" } = currentuser;
  const [specialties, setSpecialties] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [biography, setBiography] = useState("");
  const [image, setImage] = useState(null);
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    getDoctor(id)
      .then((doctorData) => {
        console.log(doctorData);
        // update the individual states with data
        setName(doctorData ? doctorData.name : "");
        setEmail(doctorData ? doctorData.email : "");
        setSpecialty(doctorData ? doctorData.specialty._id : "");
        setBiography(doctorData ? doctorData.biography : "");
        setImage(doctorData ? doctorData.image : null);
        setDoctorId(doctorData ? doctorData._id : "");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getSpecialties()
      .then((data) => {
        // putting the data into orders state
        setSpecialties(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUpdateDoctor = async () => {
    const updatedDoctor = await updateDoctor(doctorId, biography, image, token);
    console.log(updatedDoctor);
    toast.success("Doctor Profile successfully updated.");
    navigate(`/profile/${id}`);
  };

  return (
    <>
      <Header title="Edit Doctor Profile" />
      <Container maxWidth="sm">
        <Paper sx={{ padding: 3 }}>
          <Typography>Name</Typography>
          <Box mb={2}>
            <TextField
              placeholder="Name"
              fullWidth
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Box>
          <Typography>Email</Typography>
          <Box mb={2}>
            <TextField
              disabled
              placeholder="Email"
              fullWidth
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Box>
          <Box mb={2}>
            <FormControl sx={{ width: "100%" }}>
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
                {specialties.map((spe) => (
                  <MenuItem value={spe._id} key={spe._id}>
                    {spe.specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography>Biography</Typography>
          <Box mb={2}>
            <TextField
              placeholder="Biography"
              fullWidth
              value={biography}
              onChange={(event) => {
                setBiography(event.target.value);
              }}
            />
          </Box>
          <Box
            mb={2}
            sx={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            {image ? (
              <>
                <img src={API_URL + image} width="200px" />
                <Button
                  color="info"
                  variant="contained"
                  size="small"
                  onClick={() => setImage(null)}
                >
                  Remove
                </Button>
              </>
            ) : (
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload image
                <VisuallyHiddenInput
                  type="file"
                  onChange={async (event) => {
                    const data = await uploadImage(event.target.files[0]);
                    console.log(data);
                    // {image_url: "uploads\\image.jpg"}
                    // set the image url into state
                    setImage(data.image_url);
                  }}
                  accept="image/*"
                />
              </Button>
            )}
          </Box>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleUpdateDoctor}
          >
            Update Profile
          </Button>
        </Paper>
      </Container>
    </>
  );
}
