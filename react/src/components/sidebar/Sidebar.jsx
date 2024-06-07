import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faUsers, faCalendarCheck, faPeopleGroup, faBars, faTimes, faBox } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <FontAwesomeIcon icon={faGauge} /> },
    { path: "/users", name: "Users", icon: <FontAwesomeIcon icon={faUsers} /> },
    { path: "/appointments", name: "Appointments", icon: <FontAwesomeIcon icon={faCalendarCheck} /> },
    { path: "/customers", name: "Customers", icon: <FontAwesomeIcon icon={faPeopleGroup} /> },
  ];

  return (
    <div className={`d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ height: "100vh" }}>
      <button onClick={toggleCollapse} className="btn btn-dark">
        <FontAwesomeIcon icon={isCollapsed ? faBars : faTimes} />
      </button>
      <NavLink to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        {!isCollapsed && <span className="fs-4">Sidebar</span>}
      </NavLink>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {sidebarLinks.map((link, index) => (
          <li className="nav-item" key={index}>
            <NavLink to={link.path} className="nav-link" style={{ color: "white" }}>
              {link.icon && link.icon} {!isCollapsed && link.name}
            </NavLink>
          </li>
        ))}
        <li className="nav-item mb-1">
          <button className="btn btn-dark btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#inventory-collapse" aria-expanded="false">
            {!isCollapsed && <FontAwesomeIcon icon={faBox} />} {!isCollapsed && 'Inventory'}
          </button>
          <div className="collapse" id="inventory-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><NavLink to="#" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Kebaya</NavLink></li>
              <li><NavLink to="#" className="link-body-emphasis d-inline-flex text-decoration-none rounded">Beskap</NavLink></li>
            </ul>
          </div>
        </li>
      </ul>
      <hr />
    </div>
  );
};

export default Sidebar;
