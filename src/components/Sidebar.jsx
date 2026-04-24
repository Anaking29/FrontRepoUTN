import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Tags, LogOut, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <h2><LayoutDashboard size={24} /> Event Manager</h2>
      <ul className="nav-links">
        <li className="nav-item">
          <NavLink to="/dashboard" end>
            <Calendar size={20} /> Events
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/categories">
            <Tags size={20} /> Categories
          </NavLink>
        </li>
      </ul>
      <button onClick={logout} className="logout-btn">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
