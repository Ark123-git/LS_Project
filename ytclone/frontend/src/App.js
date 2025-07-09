

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Upload from './components/Upload';
import Login from './components/Login';
import Register from './components/Register';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import WatchLater from './components/WatchLater';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function Layout({ user, setUser }) {
  const location = useLocation();
  const hideSidebar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="d-flex">
        {!hideSidebar && <Sidebar />}
        <div
          className="main-content"
          style={{
            marginTop: '52px',
            
            paddingLeft: '150px',
          
            width: '100%',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/watch-later" element={<WatchLater />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
function App() {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    return (
      <Router>
        <Layout user={user} setUser={setUser} />
      </Router>
    );
  }
export default App;
