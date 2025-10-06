import { Container, Typography } from "@mui/material";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <>
      <Header title={"Home"} />
      <Container>
        <Typography>This is the home page</Typography>
      </Container>
    </>
  );
}
