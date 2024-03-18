import { useContext, useRef } from "react";
import { SocketContext } from "../SocketContext";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);

  return (
    <div className="bg-red-500 mx-10">
      {/* own video */}
      <div className="bg-white w-full h-[50vh]">
        <div className="">
          <p>{name || "Name"}</p>
          <video playsInline muted ref={myVideo} autoPlay className="" />
        </div>
      </div>

      {/* other persons video */}
      {callAccepted && !callEnded && (
        <div className="bg-white w-full h-[50vh]">
          <div className="">
            <p>{call.name || "Name"}</p>
            <video playsInline ref={userVideo} autoPlay className="" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
