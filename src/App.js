import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Account/Login/Login.jsx';
import AddEventForm from './components/Events/AddEvent/AddEventForm.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx'
// A simple Home component for this example
function Home() {
  return (
    <div>
      <h2>Tech Sisters Events</h2>
      
      <Link to="/login">Go to Login</Link>
      <br></br>
      <Link to="/add-event">Add Event</Link>
      <br></br>
      <Link to="/all-events">Dashboard</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>     
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-event" element={<AddEventForm />} />
        <Route path="/all-events" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;