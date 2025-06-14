import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import UserDashboard from "../Pages/UserDashboard";
import HospitalDashboard from "../Pages/HospitalDashboard";
import About from "../Pages/About";
import Events from "../Pages/Events";
import Contact from "../Pages/Contact";
import HospitalPage from "../Pages/HospitalPage";
import EmergencyRequest from "../Pages/EmergencyRequest";
import { Toaster } from "react-hot-toast";
import EmergencySuccess from "../Pages/EmergencySuccess";
import Donate from "../Pages/Donate";
import FindDonor from "../Pages/FindDonor";
import Requests from "../Pages/Requests";
import BloodPredictor from "../Pages/BloodPredictor";

// Simple 404 page
const NotFound = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                404
            </h1>
            <p className="text-xl mb-6 text-white/80">Page Not Found</p>
            <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
                Go Home
            </a>
        </div>
    </div>
);

// Wrapper to conditionally render Navbar/Footer
const Layout = ({ children }) => {
    const location = useLocation();
    const hideNavFooter = ["/login", "/signup"].includes(location.pathname);
    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavFooter && <Navbar />}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        color: "white",
                    },
                }}
            />
            <main className="flex-grow">{children}</main>
            {!hideNavFooter && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route
                        path="/hospital-dashboard"
                        element={<HospitalDashboard />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/find-donor" element={<FindDonor />} />
                    <Route path="/hospital/:id" element={<HospitalPage />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/emergency" element={<EmergencyRequest />} />
                    <Route
                        path="/emergency/success"
                        element={<EmergencySuccess />}
                    />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/blood-predictor" element={<BloodPredictor />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
