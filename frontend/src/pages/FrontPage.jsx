import React from "react";
import { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user", //facing user
};

const FrontPage = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("Captured Image:", imageSrc);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Check your camera before joining</h2>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat={"image/jpeg"}
        videoConstraints={videoConstraints}
        style={{ borderRadius: "10px", marginBottom: "20px" }}
      />
      <br />
      <button onClick={capture}>Capture Image</button>
      <button onClick={() => navigate("/meeting")}>Join Meeting</button>
    </div>
  );
};

export default FrontPage;
