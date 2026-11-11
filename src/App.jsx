import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Account/Login/Login.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AddEventForm from "./components/Events/AddEvent/AddEventForm.jsx";
import EventDetailsPage from "./components/Events/EventDetails/EventDetailsPage.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import ProtectedRoute from "./Services/ProtectedRoute.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import MentorsPage from "./components/MentorDashboard/MentorsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Toaster position="top-right" />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route
            path="/my-events"
            element={<Navigate to="/dashboard?scope=created" replace />}
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
          <Route
            path="/ask-a-tech-sister"
            element={
              <ProtectedRoute>
                <MentorsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
