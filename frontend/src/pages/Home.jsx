import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { v4 as uuidV4 } from "uuid";

const Wrapper = styled(Container)(({ theme }) => {
  textAlign: "center";
  marginTop: "50px";
});

const Heading1 = styled(Typography)(({ theme }) => {
  variant: "h4";
});

const Heading2 = styled(Typography)(({ theme }) => {
  variant: "h6";
});

const Heading5 = styled(Typography)(({ theme }) => {
  variant: "h5";
});

const LogoutButton = styled(Button)(({ theme }) => {
  variant: "contained";
  color: "secondary";
  marginBottom: "20px";
});

const CreateButton = styled(Button)(({ theme }) => {
  variant: "contained";
  color: "primary";
  marginBottom: "20px";
});

const JoinButton = styled(Button)(({ theme }) => {
  variant: "contained";
  color: "secondary";
  // marginBottom: "20px";
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

const Home = ({ user, handleLogout }) => {
  // const [user, setUser] = useState(""); // should not be null search why we wrote null pehle
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  const createRoom = () => {
    const newRoomId = uuidV4();
    navigate("/meetingroom/${roomId}");
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate("/meetingroom/${roomId}");
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };
  return (
    <Wrapper>
      <Heading1>Welcome, {user?.name || "User"}!</Heading1>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <Heading5>Say Hello</Heading5>
      <CreateButton onClick={createRoom}>Create Room</CreateButton>
      <br />

      <TextField
        label="Enter Room ID"
        variant="outlined"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <JoinButton onClick={joinRoom}>Join Room</JoinButton>
    </Wrapper>
  );
};

export default Home;
