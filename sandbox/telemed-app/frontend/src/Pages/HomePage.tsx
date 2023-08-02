import { Typography } from "@mui/material";
import { PatientPage } from "./PatientPage";
import { DoctorPage } from "./DoctorPage";

interface HomePageProps {
  role: string | undefined;
}

export const HomePage: React.FC<HomePageProps> = ({ role }) => {
  if (role === "Doctor") {
    return <DoctorPage />;
  } else if (role === "Patient") {
    return <PatientPage />;
  }

  return (
    <>
      <Typography variant="h3">
        There was an error while fetching your user.
      </Typography>
      <Typography>Kindly try logging again.</Typography>
    </>
  );
};
