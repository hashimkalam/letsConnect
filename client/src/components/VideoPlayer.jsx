import { useContext, useRef } from "react";
import { SocketContext } from "../SocketContext";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);

  console.log(`stream - ${stream}`);
  return (
    <div className="mx-10">
      {/* own video */}

      <div className="bg-white w-[60vw] mx-auto h-[50vh]">
        <p className="text-xl font-bold">{name || "Name"}</p>
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          className="w-full h-[100%]"
        />
      </div>

      {/* other persons video */}
      {callAccepted && !callEnded && (
        <div className="bg-white w-[60vw] mx-auto h-[50vh]">
          <p className="text-xl font-bold">{call.name || "Name"}</p>
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-full h-[100%]"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
