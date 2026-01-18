import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Contact from './pages/Contact.jsx'
import './App.css'

function App() {
  return (
    <div className="app-root">
      <Navbar /> 

      {/* ADD THIS DIV WRAPPER */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App