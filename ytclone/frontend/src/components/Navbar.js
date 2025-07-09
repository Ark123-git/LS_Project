

import React from 'react';
import { Link } from 'react-router-dom';
function Navbar(props) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    props.setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="navbar-class navbar navbar-expand-lg w-100 h-20 fixed-top px-3 " >
      <Link className="VidGraph-text navbar-brand" to="/">VidGraph</Link>
      <div className="ms-auto d-flex align-items-center">
        {props.user ? (
          <>
            <span className="text-white me-3">Logged in as <strong>{props.user.username}</strong></span>
            <button onClick={handleLogout} className="btn btn-sm btn-outline-light">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline-light me-2">Login</Link>
            <Link to="/register" className="btn btn-sm btn-outline-light">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
