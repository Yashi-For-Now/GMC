import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, Container, Button, TextField } from "@mui/material";

const Wrapper = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#429E9D", // Black background
  color: "#fff", // White text
});

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "350px",
  padding: "30px",
  borderRadius: "10px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", //soft shadow effect
});

const StyledButton = styled(Button)({
  padding: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  backgroundColor: "#2C786C",
  color: "fff",
  transition: "background 0.3s",
  "&:hover": {
    backgroundColor: "#1D5C4A",
  },
});

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      console.log("Login Response:", response.data);
      localStorage.setItem("token", response.data.token);
      // console.log(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };
  return (
    <Wrapper>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          name="email"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          fullWidth
          onChange={handleChange}
          required
        />
        <StyledButton type="submit" variant="contained" fullWidth>
          Login
        </StyledButton>
      </Form>
    </Wrapper>
  );
};

export default Login;
