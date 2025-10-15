import Header from "./Header";
import {
  Container,
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
import { getDoctorById, updateDoctor } from "../api/api_doctors";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoctorById(id)
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

    if (!currentuser || currentuser.role !== "doctor") {
      navigate("/");
      toast.error("Access denied");
    }
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
    if (!name || !specialty) {
      toast.error("Please fill in all the fields.");
    } else {
      try {
        setLoading(true);
        await updateDoctor(doctorId, biography.trim(), image, token);
        toast.success("Doctor Profile successfully updated.");
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column", // make it a column layout
        }}
      >
        <Header />
        <Container
          maxWidth="md"
          sx={{
            flex: 1, // fills remaining height below header
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper sx={{ padding: 3, width: "100%", maxWidth: "500px" }}>
            <Box mb={2}>
              <TextField
                disabled
                label="Name"
                placeholder="Name"
                fullWidth
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
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
            <Box mb={2}>
              <TextField
                label="Biography"
                placeholder="Biography"
                fullWidth
                value={biography}
                onChange={(event) => {
                  setBiography(event.target.value);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 500); // limit to 40 digits
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
              sx={{ mb: "10px" }}
            >
              Update Profile
            </Button>
            <Button
              color="error"
              variant="contained"
              fullWidth
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
          </Paper>
        </Container>
      </Box>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
