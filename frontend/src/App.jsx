import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content
  if (currentPage === 'signup') {
    content = <Signup onNavigate={handleNavigate} />
  } else if (currentPage === 'login') {
    content = <Login onNavigate={handleNavigate} />
  } else {
    content = <Home onNavigate={handleNavigate} />
  }

  return (
    <div className="app-root">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      {content}
      <Footer />
    </div>
  )
}

export default App
