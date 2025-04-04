import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Container, styled } from "@mui/material";
import Peer from "peerjs";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Wrapper = styled(Container)({
  display: "flex",
  // flexDirection: "column",p
  // justifyContent: "center",p
  // alignItems: "center",p
  height: "100vh",
  width: "100vw",
  backgroundColor: "#429E9D", // Black background
  color: "#fff", // White text
  // textAlign: "center",p
  // gap: "20px",p
  padding: "20px",
});

const VideoSection = styled("div")({
  flex: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const VideoContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  // alignItems: "center",p
  gap: "20px",
  width: "100%", //80%
  // maxWidth: "900px",p
});
const VideoBox = styled("div")({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  padding: "10px",
  borderRadius: "12px",
  // backgroundColor: "#000",
});

const ChatSection = styled("div")({
  // width: "60%",p
  // maxWidth: "300px"p,
  // overflowY: "auto",p
  flex: 1,
  backgroundColor: "#ffffff",
  color: "#333",
  padding: "15px",
  borderRadius: "10px",
  // marginTop: "20px",p
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  height: "90vh",
});

const ChatMessages = styled("div")({
  flex: 1,
  overflowY: "auto",
  paddingBottom: "10px",
});

const ChatMessage = styled("div")({
  textAlign: "left",
  marginBottom: "10px",
});

const ChatInputContainer = styled("div")({
  display: "flex",
  // marginTop: "10px",p
  gap: "10px",
  // width: "60%",p
});

const ChatInput = styled("input")({
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
});

const SendButton = styled(Button)({
  backgroundColor: "#2C786C",
  color: "#fff",
  "&:hover": {
    backgroundColor: "1D5C4A",
  },
});

const StyledVideo = styled("video")({
  width: "100%",
  borderRadius: "10px",
  // height: "100%",
});

const ButtonGroup = styled("div")({
  display: "flex",
  gap: "20px",
  marginTop: "15px",
});

const StyledButton = styled(Button)({
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  backgroundColor: "#2C786C",
  color: "#fff",
  transition: "backgroundColor 0.3s",
  "&: hover": {
    backgroundColor: "#1D5C4A",
  },
});

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [chatMessage, setChatMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const userName = location.state?.userName || "Anonymous";
  // const [call, setCall] = useState(null);
  const userVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const newPeer = new Peer(); // instance of peerjs

    newPeer.on("open", (id) => {
      console.log("My Peer ID: ", id);
      setPeerId(id);
      socket.emit("join-room", { roomId, peerId: id });
    });

    newPeer.on("call", (incomingCall) => {
      // console.log("Incoming Call from: ", incomingCall.peer);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // console.log("Local stream");
          userVideoRef.current.srcObject = stream;
          incomingCall.answer(stream);
          incomingCall.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
          // setCall(incomingCall);
        });
    });

    newPeer.on("disconnected", () => {
      console.log("Peer disconnected, attempting to reconnect...");
    });
    setPeer(newPeer);

    return () => newPeer.destroy(); //clean up on unmount
  }, [roomId]);

  //to handle audio/ video permission issues
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        userVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Media Access Error: ", err);
        alert("Please allow camera and microphone access to join the call");
      }
    };
    getUserMedia();
  }, []);

  useEffect(() => {
    if (!peer) return; // Ensure peer is available before setting up the event listener

    const handleUserConnected = (remotePeerId) => {
      console.log(`New user connected: ${remotePeerId}`);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userVideoRef.current.srcObject = stream;
          const call = peer.call(remotePeerId, stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });

          call.on("close", () => {
            remoteVideoRef.current.srcObject = null; // Clear remote video on disconnect
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices: ", err);
        });
    };

    socket.on("user-connected", handleUserConnected);

    return () => socket.off("user-connected", handleUserConnected); // Cleanup on unmount
  }, [peer]);

  const handleLeaveMeeting = () => {
    if (userVideoRef.current?.srcObject) {
      userVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    socket.emit("user-disconnected", peerId);
    navigate("/");
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("chat-message", { user: userName, message: newMessage });
      setChatMessage((prev) => [...prev, { message: newMessage, user: "You" }]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive-message", ({ userId, message }) => {
      setChatMessage((prev) => [...prev, { message, user: userId }]);
    });
    return () => {
      socket.off("receive-message");
    };
  }, []);
  // socket.on("user-disconnected", (peerId) => {
  //   console.log(`User ${peerId} has left the meeting`);
  //   socket.broadcast.emit("Remove-user", peerId);
  // });

  useEffect(() => {
    socket.on("remove-user", (disconnectedPeerId) => {
      if (
        remoteVideoRef.current?.srcObject &&
        disconnectedPeerId === remotePeerId
      ) {
        remoteVideoRef.current.srcObject = null;
      }
    });
    return () => socket.off("remove-user");
  }, [remotePeerId]);
  // const callPeer = () => {
  //   if (!peer || !remotePeerId) {
  //     console.error("Peer instance or Remote Peer ID is missing.");
  //     return;
  //   }

  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       userVideoRef.current.srcObject = stream;
  //       const outgoingCall = peer.call(remotePeerId, stream);
  //       outgoingCall.on("stream", (remoteStream) => {
  //         remoteVideoRef.current.srcObject = remoteStream;
  //       });
  //     })
  //     .catch((err) => console.error("Error accessing media devices: ", err));
  // };

  const toggleMix = () => {
    if (userVideoRef.current && userVideoRef.current.srcObject) {
      const audioTracks = userVideoRef.current.srcObject.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMicMuted(!audioTracks[0].enabled);
      }
    }
  };

  const toggleCam = () => {
    if (userVideoRef.current && userVideoRef.current.srcObject) {
      const videoTracks = userVideoRef.current.srcObject.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsCamOn(videoTracks[0].enabled);
      }
    }
  };
  return (
    <Wrapper>
      <VideoSection>
        <h1>Meeting Room</h1>

        <h4>Room ID: {roomId}</h4>

        <VideoContainer>
          <VideoBox>
            <h3>Your Video</h3>
            <StyledVideo ref={userVideoRef} autoPlay muted />
          </VideoBox>
          <VideoBox>
            <h3>Remote Video</h3>
            <StyledVideo ref={remoteVideoRef} autoPlay />
          </VideoBox>
        </VideoContainer>
        <ButtonGroup>
          <StyledButton onClick={toggleMix}>
            {isMicMuted ? "Unmute Mic" : "Mute Mic"}
          </StyledButton>
          <StyledButton onClick={toggleCam}>
            {isCamOn ? "Turn Camera Off" : "Turn Camera On"}
          </StyledButton>
          <StyledButton
            onClick={handleLeaveMeeting}
            style={{ backgroundColor: "#E74C3C" }}
          >
            Leave Meeting
          </StyledButton>
        </ButtonGroup>
      </VideoSection>
      <ChatSection>
        <h3>Chat</h3>
        <ChatMessages>
          {chatMessage.map((chat, index) => (
            <ChatMessage key={index}>
              <strong>{chat.user}:</strong>
              {chat.message}
            </ChatMessage>
          ))}
        </ChatMessages>

        <ChatInputContainer>
          <ChatInput
            placeholder="Type your message here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <SendButton onClick={sendMessage}>Send</SendButton>
        </ChatInputContainer>
      </ChatSection>
    </Wrapper>
  );
};

export default MeetingRoom;
