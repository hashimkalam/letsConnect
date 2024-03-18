import { AppBar, Typography } from "@mui/material";
import VideoPlayer from "./components/VideoPlayer";
import Notifications from "./components/Notifications";
import Options from "./components/Options";

const App = () => {
  return (
    <div className="bg-sky-400 min-h-screen space-y-10">
      <AppBar position="static" color="inherit">
        <Typography className="bg-sky-600" variant="h2" align="center">
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
