import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Account/Login/Login.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AddEventForm from "./components/Events/AddEvent/AddEventForm.jsx";
import ProtectedRoute from "./components/Services/ProtectedRoute.js";
import NavBar from "./components/NavBar/NavBar.jsx";
import MyEventsPage from "./components/Events/MyEventsPage.jsx";
import EventDetailsPage from "./components/Events/EventDetailsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavBar /> 
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <AddEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-event/:eventId"
            element={
              <ProtectedRoute>
                <AddEventForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
