
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Help from "./pages/Help";
import SearchPage from "./pages/SearchPage";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import ExperienceDetails from "./pages/ExperienceDetails";
import CreateExperience from "./pages/CreateExperience";
import HostDashboard from "./pages/HostDashboard";
import Messages from "./pages/Messages";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import "./App.css";


function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/booking" element={<BookingPage />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/help" element={<Help />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/terms" element={<Terms />} />
					<Route path="/experience/:id" element={<ExperienceDetails />} />
					<Route path="/create-experience" element={<CreateExperience />} />
					<Route path="/host-dashboard" element={<HostDashboard />} />
					<Route path="/messages" element={<Messages />} />
					<Route path="/privacy" element={<Privacy />} />
					<Route path="/faq" element={<FAQ />} />
					<Route path="/legal" element={<Legal />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
