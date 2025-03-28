import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import FrontPage from "./pages/FrontPage";
import MeetingRoom from "./pages/MeetingRoom";

const App = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/FrontPage" element={<FrontPage />} />
        <Route
          path="/meetingroom/:roomId"
          element={user ? <MeetingRoom /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
