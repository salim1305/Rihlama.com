import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import ExperienceDetails from "./pages/ExperienceDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import Messages from "./pages/Messages";
import HostDashboard from "./pages/HostDashboard";
import CreateExperience from "./pages/CreateExperience";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App min-h-screen flex flex-col">
          <BrowserRouter>
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/experience/:id" element={<ExperienceDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookings" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/book/:id" element={<BookingPage />} />
                <Route path="/host" element={<HostDashboard />} />
                <Route path="/host-dashboard" element={<HostDashboard />} />
                <Route path="/create-experience" element={<CreateExperience />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* Placeholder pages for footer links */}
                <Route path="/destinations" element={<SearchPage />} />
                <Route path="/categories" element={<SearchPage />} />
                <Route path="/gift-cards" element={<Contact />} />
                <Route path="/host-resources" element={<Help />} />
                <Route path="/host-community" element={<Help />} />
                <Route path="/responsible-hosting" element={<Help />} />
                <Route path="/safety" element={<Help />} />
                <Route path="/cancellation" element={<Help />} />
                <Route path="/sitemap" element={<Help />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;