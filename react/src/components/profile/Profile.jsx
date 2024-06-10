import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Profile({ isOpen, toggleProfile }) { // Receive props
  const { user, setUser, setToken } = useStateContext();

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      });
  }, [setUser]);

  const onLogout = ev => {
    ev.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  return (
    <div className={`dropdown ${isOpen ? 'show' : ''}`}> {/* Add conditional class */}
      <a href="#" className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
         data-bs-toggle="dropdown" aria-expanded="false" onClick={toggleProfile}> {/* Toggle function */}
        <FontAwesomeIcon icon={faUser} className="rounded-circle me-2" width="32" height="32" />
        <strong className="text-truncate">{user?.name || 'User'}</strong>
      </a>
      <ul className="dropdown-menu text-small shadow">
        <li><a className="dropdown-item" href="#">New Appointment</a></li>
        <li><a className="dropdown-item" href="#">Settings</a></li>
        <li><a className="dropdown-item" href="#">Profile</a></li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li><a className="dropdown-item" href="#" onClick={onLogout}>Sign out</a></li>
      </ul>
    </div>
  );
}
