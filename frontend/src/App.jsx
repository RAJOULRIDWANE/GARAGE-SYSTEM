import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // 1. Import useLocation
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Contact from './pages/Contact.jsx' 
import About from './pages/About.jsx' 
import Services from './pages/Services.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx';
import 'remixicon/fonts/remixicon.css';
import ResetPassword from './pages/ResetPassword';
import ClientDashboard from './Client-Pages/ClientDashboard.jsx';
import MechanicDashboard from './Mechanic-Pages/MechanicDashboard.jsx';
import ReceptionistDashboard from './Receptionist-Pages/ReceptionistDashboard.jsx';
import ReceptionistClientDetails from './Receptionist-Pages/ReceptionistClientDetails';
import PartsManagerDashboard from './PartsManager-Pages/PartsManagerDashboard.jsx';
import SupervisorDashboard from './Supervisor-Pages/SupervisorDashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';
import './App.css'

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  let userRole = localStorage.getItem('USER_ROLE');
  const cleanRole = userRole ? userRole.replace(/['"]+/g, '').toLowerCase().trim() : '';

  if (!token) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.map(r => r.toLowerCase()).includes(cleanRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

function App() {
  const location = useLocation(); 

  const publicRoutes = [
    '/', 
    '/login', 
    '/signup', 
    '/about', 
    '/contact', 
    '/services', 
    '/forgot-password', 
    '/unauthorized'
  ];

  const showLayout = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/reset-password');

  return (
    <div className="app-root">
      
      {showLayout && <Navbar />} 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/unauthorized" element={
          <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>
            <h2>Access Denied</h2>
            <p>Your role is not authorized. Try logging out and back in.</p>
          </div>
        } />



        {/* CLIENT PATHS */}

        <Route element={<ProtectedRoute allowedRoles={['client','Client']} />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['client','Client']} />}>
          <Route path="/client/profile" element={<UserProfile />} />
        </Route>


        {/* MECHANIC PATHS */}


        <Route element={<ProtectedRoute allowedRoles={['mechanic', 'Mechanic']} />}>
          <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['mechanic', 'Mechanic']} />}>
          <Route path="/mechanic/profile" element={<UserProfile />} />
        </Route>


        {/* SUPERVISOR PATHS */}


        <Route element={<ProtectedRoute allowedRoles={['supervisor', 'Supervisor']} />}>
          <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['supervisor', 'Supervisor']} />}>
          <Route path="/supervisor/profile" element={<UserProfile />} />
        </Route>


        {/* RECEPTIONIST PATHS */}


        <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
          <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
          <Route path="/receptionist/profile" element={<UserProfile />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
          <Route path="/receptionist/client/:id/:name" element={<ReceptionistClientDetails />} />
        </Route>


        {/* PARTS-MANAGER PATHS */}


        <Route element={<ProtectedRoute allowedRoles={['parts_manager', 'Parts_manager']} />}>
          <Route path="/partsmanager/dashboard" element={<PartsManagerDashboard />} />
        </Route>

         <Route element={<ProtectedRoute allowedRoles={['parts_manager', 'Parts_manager']} />}>
          <Route path="/partsmanager/profile" element={<UserProfile />} />
        </Route>

      </Routes>

      {showLayout && <Footer />}
      
    </div>
  )
}

export default App