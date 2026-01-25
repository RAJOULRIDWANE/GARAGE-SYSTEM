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
import ResetPassword from './pages/ResetPassword';
import ClientDashboard from './Client-Pages/ClientDashboard.jsx';
import MechanicDashboard from './Mechanic-Pages/MechanicDashboard.jsx';
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
  const location = useLocation(); // 2. Get the current URL address

  // 3. Define the list of "Public Pages" (Where Navbar/Footer should show)
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

  // 4. Check: Is the current path in the list? (OR is it the reset-password page?)
  const showLayout = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/reset-password');

  return (
    <div className="app-root">
      
      {/* 5. The Switch: Only show Navbar if showLayout is true */}
      {showLayout && <Navbar />} 

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={
          <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>
            <h2>Access Denied</h2>
            <p>Your role is not authorized. Try logging out and back in.</p>
          </div>
        } />

        {/* --- PROTECTED ROUTES --- */}
        {/* Navbar/Footer will automatically HIDE here because they are not in 'publicRoutes' */}
        
        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/client-dashboard" element={<ClientDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['mechanic']} />}>
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
        </Route>

      </Routes>

      {/* 6. Same Switch for Footer */}
      {showLayout && <Footer />}
      
    </div>
  )
}

export default App