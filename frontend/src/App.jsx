import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import './App.css'

function App() {
  // 1. REMOVED: useState and handleNavigate (Router handles this now)

  return (
    <div className="app-root">
      {/* Navbar stays at the top of every page */}
      <Navbar /> 

      {/* 2. ADDED: Routes define which component loads based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Footer stays at the bottom of every page */}
      <Footer />
    </div>
  )
}

export default App