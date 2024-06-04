import { useCallback, useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import Pagination from "../components/Pagination.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { debounce } from "lodash";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getAppointments();
  };

  const onDelete = (appointment) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    axiosClient.delete(`/appointments/${appointment.id}`)
      .then(() => {
        setNotification("Appointment has been deleted successfully");
        getAppointments();
      });
  }

  const debouncedGetAppointments = useCallback(
    debounce((page, query) => {
      setLoading(true);
      axiosClient.get("/appointments", { params: { page, search: query } })
        .then(({ data }) => {
          setLoading(false);
          console.log(data);
          data.data.forEach(appointment => {
            appointment.type = appointment.type.replace(/_/g, ' ');
          });
          setAppointments(data.data);
          setLastPage(data.meta.last_page);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 500),
    []
  );

  useEffect(() => {
    debouncedGetAppointments(currentPage, searchQuery);
  }, [currentPage, searchQuery, debouncedGetAppointments]);

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Appointments</h1>
        <Link to="/appointments/new" className="btn-add">Add New Appointment</Link>
      </div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Time</th>
            <th>Information</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading && (
            <tbody>
            <tr>
              <td colSpan="7" className={"text-center"}>Loading...</td>
            </tr>
            </tbody>
          )}
          {!loading && appointments.length > 0 && (
            <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.customers?.[0]?.name || 'N/A'}</td>
                <td>{appointment.customers?.[0]?.phone || 'N/A'}</td>
                <td>{appointment.time}</td>
                <td>{appointment.information}</td>
                <td>{appointment.type}</td>
                <td>
                  <Link to={'/appointments/' + appointment.id} className="btn-edit">Edit</Link>
                  &nbsp;
                  <button onClick={ev => onDelete(appointment)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          )}
          {appointments.length === 0 && (
            <tbody>
            <tr>
              <td colSpan="7" className="text-center">No appointments found.</td>
            </tr>
            </tbody>
          )}
        </table>
      </div>
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={handlePageChange} />
    </div>
  )
}
