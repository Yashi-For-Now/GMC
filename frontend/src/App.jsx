import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>HOME PAGE</h1>} />
        <Route path="/signup" element={<h1>SIGNUP PAGE</h1>} />
        <Route path="/login" element={<h1>LOGIN PAGE</h1>} />
        <Route path="/meeting" element={<h1>MEETING PAGE</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
