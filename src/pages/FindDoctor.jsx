import { Container, Grid, Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Header from "../components/Header";

export default function FindDoctor() {
  return (
    <>
      <Header title={"Find a Doctor"} />
      <Container>
        <Grid container spacing={4}>
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
                  Narita Brian
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Narita Brian is my favourite umamusume
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
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
                  Narita Brian
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Narita Brian is my favourite umamusume
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
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
                  Narita Brian
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Narita Brian is my favourite umamusume
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
