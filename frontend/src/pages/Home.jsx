import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, styled } from "@mui/material";
import axios from "axios";
import { v4 as uuidV4 } from "uuid";

const Wrapper = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#429E9D", // Black background
  color: "#fff", // White text
  textAlign: "center",
});

const ContentBox = styled("div")({
  width: "400px",
  padding: "30px",
  borderRadius: "12px",
  backgroundColor: "#fff",
  color: "#333",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});
const StyledButton = styled(Button)({
  padding: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  width: "100%",
  borderRadius: "8px",
  backgroundColor: "#2C786C",
  color: "#fff",
  transition: "background 0.3s",
  "&:hover": {
    backgroundColor: "#1D5C4A",
  },
  marginTop: "15px",
});

const LogoutButton = styled(Button)({
  marginTop: "30px",
  backgroundColor: "#C029B8",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#A93226",
  },
});

const StyledTextField = styled(TextField)({
  width: "100%",
  marginTop: "15px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
});
const Home = () => {
  const [user, setUser] = useState(null); // should not be null search why we wrote null pehle
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // console.log("Token from localStorage:", token);
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log(response.data.user);
        setUser(response.data.user);
      })
      .catch((err) => {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, user]);

  const createRoom = () => {
    const newRoomId = uuidV4();
    navigate(`/MeetingRoom/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/FrontPage/${roomId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setUser(null);
  };

  return (
    <Wrapper>
      <ContentBox>
        <h2>Welcome to Say Hello, {user?.name || "User"}!</h2>
        <StyledButton onClick={createRoom}>Create Room</StyledButton>
        <br />

        <StyledTextField
          label="Enter Room ID"
          variant="outlined"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <StyledButton onClick={joinRoom}>Join Room</StyledButton>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ContentBox>
    </Wrapper>
  );
};

export default Home;
