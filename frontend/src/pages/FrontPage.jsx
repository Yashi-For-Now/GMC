import React from "react";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Container, styled, Typography } from "@mui/material";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user", //facing user
};

const Wrapper = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
  height: "100vh",
  backgroundColor: "#429E9D",
  color: "#fff",
  gap: "20px",
  textAlign: "center",
});

const VideoBox = styled("div")({
  // backgroundColor: "#000",
  borderRadius: "12px",
  padding: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1 )",
});

const StyledButton = styled(Button)({
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  backgroundColor: "#2C786C",
  color: "#fff",
  transition: "background 0.3s",
  "&: hover": {
    backgroundColor: "#1D5C4A",
  },
});

const ButtonContainer = styled("div")({
  display: "flex",
  gap: "10px",
  marginTop: "20px",
});

const NameInput = styled("input")({
  padding: "10px",
  borderRadius: "8px",
  fontSize: "14px",
  border: "1px solid #ccc",
});

const FrontPage = () => {
  const { roomId } = useParams();
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Anonymous");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("Captured Image:", imageSrc);
  }, []);

  return (
    <Wrapper>
      <Typography variant="h4">Check Your Camera Before Joining</Typography>
      <VideoBox>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat={"image/jpeg"}
          videoConstraints={videoConstraints}
          style={{ borderRadius: "10px", marginBottom: "20px" }}
        />
      </VideoBox>
      <NameInput
        type="text"
        placeholder="Enter Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <ButtonContainer>
        <StyledButton onClick={capture}>Capture Image</StyledButton>
        <StyledButton
          onClick={() => {
            sessionStorage.setItem("userName", userName);
            navigate(`/MeetingRoom/${roomId}`, { state: { userName } });
          }}
        >
          Join Meeting
        </StyledButton>
      </ButtonContainer>
    </Wrapper>
  );
};

export default FrontPage;
