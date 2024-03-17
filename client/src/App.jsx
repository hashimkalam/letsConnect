import { AppBar, Typography } from "@mui/material";
import VideoPlayer from "../components/VideoPlayer";
import Notifications from "../components/Notifications";
import Options from "../components/Options";

const App = () => {
  return (
    <div>
      <AppBar position="static" color="inherit">
        <Typography variant="h2" align="center">
          Connect
        </Typography>
      </AppBar>

      <VideoPlayer />

      <Options>
        <Notifications />
      </Options>
    </div>
  );
};

export default App;
