import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  // creating refs for my and user video
  const myVideo = useRef();
  const userVideo = useRef();

  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    // Importing simple-peer conditionally
    import("simple-peer").then((Peer) => {
      const peer = new Peer.default({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: call.from });
      });

      peer.on("stream", (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });

      peer.signal(call.signal);

      // conection ref is equal to peer
      connectionRef.current = peer;
    });
  };

  const callUser = (id) => {
    // Importing simple-peer conditionally
    import("simple-peer").then((Peer) => {
      const peer = new Peer.default({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: me,
          name,
        });
      });

      peer.on("stream", (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });

      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });

      connectionRef.current = peer;
    });
  };

  const leaveCall = () => {
    setCallEnded(true);

    // destroy connection - decline call
    connectionRef.current.destroy();

    // refresh page to get user a new id
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        name,
        stream,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
