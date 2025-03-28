import React from "react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Grid2, styled, Typography } from "@mui/material";
import Peer from "peerjs";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Wrapper = styled(Container)(({ theme }) => {
  textAlign: "center";
  marginTop: "20px";
});

const Heading1 = styled(Typography)(({ theme }) => {
  variant: "h4";
});

const Heading2 = styled(Typography)(({ theme }) => {
  variant: "h6";
});

const CallButton = styled(Button)(({ theme }) => {
  variant: "contained";
  color: "primary";
});

const Container1 = styled(Grid2)(({ theme }) => {
  spacing: "2";
  justifyContent: "center";
  marginTop: "20px";
});

const Container2 = styled(Grid2)(({ theme }) => {
  xs: "2";
  md: "5";
});
const MeetingRoom = () => {
  const { roomId } = useParams();
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
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

    setPeer(newPeer);

    return () => newPeer.destroy(); //clean up on unmount
  }, [roomId]);

  useEffect(() => {
    socket.on("user-connected", (remotePeerId) => {
      if (peer) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            userVideoRef.current.srcObject = stream;
            const outgoingCall = peer.call(remotePeerId, stream);
            outgoingCall.on("stream", (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
            });
            // setCall(outgoingCall);
          });
      }
    });
  }, [peer]);
  return (
    <Wrapper>
      <Heading1>Meeting Room</Heading1>

      <Heading2>Room ID: {roomId}</Heading2>
      <input
        type="text"
        placeholder="Enter Remote Peer ID"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
      />
      <CallButton onClick={callPeer}>Call</CallButton>

      <Container1>
        <Container2>
          <Heading2>Your Video</Heading2>
          <video
            ref={userVideoRef}
            autoPlay
            muted
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Container2>
        <Container2>
          <Heading2>Remote Video</Heading2>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Container2>
      </Container1>
    </Wrapper>
  );
};

export default MeetingRoom;
