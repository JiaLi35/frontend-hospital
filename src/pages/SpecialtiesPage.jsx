import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getSpecialties,
  getSpecialty,
  addSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from "../api/api_specialties";
import Header from "../components/Header";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default function SpecialtiesPage() {
  /* ONLY ADMIN SHOULD SEE THIS PAGE */
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  // store categories data from API
  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState("");

  // Call the API
  useEffect(() => {
    getSpecialties()
      .then((data) => {
        // putting the data into specialties state
        setSpecialties(data);
      })
      .catch((error) => {
        console.log(error);
      });

    if (!currentuser || currentuser.role !== "admin") {
      navigate("/");
      toast.error("Access denied.");
    }
  }, []); // call only once when the page loads

  const handleAddNewSpecialty = async (specialty) => {
    if (!specialty.trim()) {
      toast.error("Please fill in the field");
    } else {
      try {
        // 2. trigger the API to create new specialty
        await addSpecialty(specialty, token);
        setSpecialty("");
        const updatedCategories = await getSpecialties();
        setSpecialties(updatedCategories);
        toast.success("New Specialty has been added");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleUpdateSpecialty = async (id) => {
    const specificSpecialty = await getSpecialty(id);

    Swal.fire({
      title: "Update Category",
      input: "text",
      inputPlaceholder: specificSpecialty.specialty,
      showCancelButton: true,
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage("Please fill in the fields");
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateSpecialty(id, result.value, token);
        const updatedSpecialty = await getSpecialties();
        setSpecialties(updatedSpecialty);
        toast.success("Specialty updated successfully");
      }
    });
  };

  const handleDeleteSpecialty = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this Specialty?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // once user confirm, then we delete the specialty
      if (result.isConfirmed) {
        try {
          // delete specialty in the backend
          await deleteSpecialty(id, token);
          // method #2: get the new data from the backend
          const updatedSpecialty = await getSpecialties();
          setSpecialties(updatedSpecialty);
          toast.success("Specialty has been deleted");
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      }
    });
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" mb={2}>
          Specialties
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: "20px",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              mt: "10px",
            }}
          >
            <TextField
              fullWidth
              label="Specialty Name"
              variant="outlined"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 40); // limit to 40 digits
              }}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleAddNewSpecialty(specialty)}
            >
              Add
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialties.map((spe) => (
                <TableRow
                  key={spe._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="specialty">
                    {spe.specialty}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="Edit Specialty">
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => handleUpdateSpecialty(spe._id)}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Specialty">
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => handleDeleteSpecialty(spe._id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
