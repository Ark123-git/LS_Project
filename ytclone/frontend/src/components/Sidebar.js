import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
function Sidebar() {
  return (

   
<ul className="nav sidebar-class flex-column">
        <li className="nav-item"><Link className="nav-link" to="/">HOME</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/upload">UPLOAD</Link></li>
         <li className="nav-item"><Link className="nav-link" to="/dashboard">DASHBOARD</Link></li>
       <li className="nav-item"><Link className="nav-link" to="/watch-later">WATCH LATER</Link></li>
       </ul>



  );
}

export default Sidebar;
