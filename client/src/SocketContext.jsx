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

  // Creating refs for my and user video
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Requesting user media and setting up socket listeners
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

    return () => {
      socket.disconnect(); // Disconnect socket when component unmounts
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    // Importing simple-peer conditionally
    import("simple-peer")
      .then((module) => {
        const Peer = module.default;
        const peer = new Peer({
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

        connectionRef.current = peer;
      })
      .catch((error) => {
        console.error("Error importing simple-peer:", error);
      });
  };

  const callUser = (id) => {
    // Importing simple-peer conditionally
    import("simple-peer")
      .then((module) => {
        const Peer = module.default;
        const peer = new Peer({
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
      })
      .catch((error) => {
        console.error("Error importing simple-peer:", error);
      });
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    // Refresh page to get user a new ID
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
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
