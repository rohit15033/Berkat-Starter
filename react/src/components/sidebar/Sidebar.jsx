import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faUsers,
  faCalendarCheck,
  faPeopleGroup,
  faBars,
  faTimes,
  faBox,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from "./sidebar.css";
import Profile from "../profile/Profile.jsx";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to control profile dropdown

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsCollapsed(false); // Open sidebar when profile dropdown is clicked
  };

  const sidebarLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <FontAwesomeIcon icon={faGauge} /> },
    { path: "/users", name: "Users", icon: <FontAwesomeIcon icon={faUsers} /> },
    { path: "/appointments", name: "Appointments", icon: <FontAwesomeIcon icon={faCalendarCheck} /> },
    { path: "/customers", name: "Customers", icon: <FontAwesomeIcon icon={faPeopleGroup} /> },
  ];

  return (
    <div className={`d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar position-fixed ${isCollapsed ? 'collapsed' : ''}`}
         style={{minWidth: isCollapsed ? '13vh' : '26vh', height: "100vh", zIndex: 99}}>
      <button onClick={toggleCollapse} className="btn-dark-custom mb-3">
        <FontAwesomeIcon icon={isCollapsed ? faBars : faTimes}/>
      </button>
      <NavLink to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        {!isCollapsed && <span className="fs-4 fw-bold">Sidebar</span>}
      </NavLink>
      <hr/>
      <ul className="nav nav-pills flex-column mb-auto">
        {sidebarLinks.map((link, index) => (
          <li className="nav-item" key={index}>
            <NavLink to={link.path} className={`nav-link ${isCollapsed ? 'fw-bold fs-5' : ''}`}
                     style={{color: "white"}}>
              {link.icon && link.icon} {!isCollapsed && link.name}
            </NavLink>
          </li>
        ))}
        <li className="nav-item mb-1">
          <button className="btn btn-dark-custom btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                  data-bs-toggle="collapse" data-bs-target="#inventory-collapse" aria-expanded="false">
            {<FontAwesomeIcon icon={faBox}/>} {!isCollapsed && 'Inventory'}
          </button>
          <div className="collapse" id="inventory-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><NavLink to="#"
                           className={`link-body-emphasis d-inline-flex text-decoration-none rounded ${isCollapsed ? 'fs-6' : ''}`}>Kebaya</NavLink>
              </li>
              <li><NavLink to="#"
                           className={`link-body-emphasis d-inline-flex text-decoration-none rounded ${isCollapsed ? 'fs-6' : ''}`}>Beskap</NavLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <hr/>
      <Profile isOpen={isProfileOpen} toggleProfile={toggleProfile} /> {/* Pass state and toggle function */}
    </div>
  );
};

export default Sidebar;
