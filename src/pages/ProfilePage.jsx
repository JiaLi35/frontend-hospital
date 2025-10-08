import { Container, Typography } from "@mui/material";
import Header from "../components/Header";

export default function ProfilePage() {
  return (
    <>
      <Header title="Manage Profile" />
      <Container>
        <Typography>This is where you manage your profile</Typography>
      </Container>
    </>
  );
}
