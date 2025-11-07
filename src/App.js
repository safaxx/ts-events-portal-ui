import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import Login from './components/Login/Login.jsx';

// A simple Home component for this example
function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the homepage!</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Routes component wrappers all your routes */}
      <Routes>
        {/* This route defines the path for the Home page */}
        <Route path="/" element={<Home />} />
        
        {/* This route defines the path for the Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* You can add more routes here */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;