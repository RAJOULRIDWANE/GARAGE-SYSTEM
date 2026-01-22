import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Contact from './pages/Contact.jsx' 
import About from './pages/About.jsx' 
import Services from './pages/Services.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

import './App.css'

function App() {
  return (
    <div className="app-root">
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App