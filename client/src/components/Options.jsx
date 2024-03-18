import { Button, TextField } from "@mui/material";

import { SocketContext } from "../SocketContext";
import { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Options = ({ children }) => {
  const { me, name, setName, callAccepted, callEnded, leaveCall, callUser } =
    useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");

  return (
    <div className="bg-white p-4 px-6 rounded-xl w-[80vw] mx-auto">
      <form noValidate autoComplete="off">
        <p>Account Info</p>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <CopyToClipboard text={me}>
          <Button variant="container" color="primary" fullWidth>
            Copy your ID
            <ContentCopyIcon className="text-sky-600" />
          </Button>
        </CopyToClipboard>
      </form>

      <form noValidate autoComplete="off">
        <p>Make a call</p>
        <TextField label="Name" fullWidth />
        {callAccepted && !callEnded ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ContentCopyIcon />}
            fullWidth
            onClick={leaveCall}
          >
            Hang up
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
            fullWidth
            onClick={() => callUser(idToCall)}
          >
            Call
          </Button>
        )}
      </form>
      {children}
    </div>
  );
};

export default Options;
