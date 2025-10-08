import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  InputLabel,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  getSpecialties,
  getSpecialty,
  addSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from "../api/api_specialties";
import Header from "../components/Header";
import { toast } from "sonner";

export default function SpecialtiesPage() {
  /* ONLY ADMIN SHOULD SEE THIS PAGE */

  // store categories data from API
  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState("");

  // Call the API
  useEffect(() => {
    getSpecialties()
      .then((data) => {
        // putting the data into orders state
        setSpecialties(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // call only once when the page loads

  const handleAddNewSpecialty = async (specialty) => {
    if (!specialty) {
      toast.error("Please fill in the field!");
    } else {
      try {
        // 2. trigger the API to create new category
        await addSpecialty(specialty);
        // 3.
        setSpecialty("");
        const updatedCategories = await getSpecialties();
        setSpecialties(updatedCategories);
        toast("New Specialty has been added");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Header title="Manage Specialties" />
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
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right" sx={{ paddingRight: "130px" }}>
                  Actions
                </TableCell>
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
                      <Button
                        color="primary"
                        variant="contained"
                        // onClick={() => handleUpdateCategory(category._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        // onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </Button>
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
