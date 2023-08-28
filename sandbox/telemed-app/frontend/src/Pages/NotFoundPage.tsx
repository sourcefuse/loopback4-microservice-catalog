import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const NotFoundPage = () => (
  <Grid
    sx={{ height: 400 }}
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <Grid item>
      <Typography variant="h3">404 page not found</Typography>
      <Typography>
        We are sorry but the page you are looking for does not exist.
      </Typography>
    </Grid>
  </Grid>
);
