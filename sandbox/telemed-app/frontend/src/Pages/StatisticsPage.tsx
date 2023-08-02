import { Typography } from "@mui/material";
import { StaticPages } from "../Components/StaticPages";

export const StatisticsPage = () => {
  const content =
    "Here, you'll find valuable insights and data related to your telemedicine activities.";

  const children = (
    <Typography variant="h6" sx={{ textAlign: "center" }}>
      Our comprehensive statistics provide a clear overview of your
      consultations, patient engagement, and other key metrics.
      <br />
      Monitor your practice's performance, track trends, and make informed
      decisions to enhance the quality of care you provide.
    </Typography>
  );

  return <StaticPages content={content} children={children} />;
};
