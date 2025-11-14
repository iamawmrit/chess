import { PageTitle } from "@/components/pageTitle";
import ProfileSection from "@/sections/profile";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <PageTitle title="Chessrith" />
      <ProfileSection />
    </Box>
  );
}
