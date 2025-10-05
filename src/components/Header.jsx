import { Typography, Container } from "@mui/material";

export default function Header({ title }) {
  return (
    <>
      <Container
        sx={{
          textAlign: "center",
          py: 3,
          mb: 3,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography>{title}</Typography>
      </Container>
    </>
  );
}
