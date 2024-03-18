import { Button } from "@mui/material";
import { useContext } from "react";
import { SocketContext } from "../SocketContext";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  console.log(`is received call -- ${call.isReceivedCall}`);

  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div className="flex justify-center items-center space-x-3 mt-5">
          <h1>{call.name || "Stranger"} is calling: </h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Accept
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;
