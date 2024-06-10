import { useEffect, useState, useCallback } from 'react';
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { debounce } from "lodash";
import moment from 'moment'; // Import moment library

const DailyAppointments = () => {
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [appointmentsTomorrow, setAppointmentsTomorrow] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState("");

  const handleSearch = () => {
    debouncedGetAppointments();
  };

  const onDelete = (appointment) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    axiosClient.delete(`/appointments/${appointment.id}`)
      .then(() => {
        setNotification("Appointment has been deleted successfully");
        debouncedGetAppointments();
      });
  }

  const handelTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const debouncedGetAppointments = useCallback(
    debounce((query, type) => {
      setLoading(true);
      axiosClient.get("/appointments", { params: { search: query, type } })
        .then(({ data }) => {
          setLoading(false);
          const today = moment().startOf('day');
          const tomorrow = moment().add(1, 'days').startOf('day');
          const filteredAppointmentsToday = data.data.filter(appointment => {
            const appointmentDate = moment(appointment.time, 'DD-MM-YYYY HH:mm');
            return appointmentDate.isSame(today, 'day');
          });

          const filteredAppointmentsTomorrow = data.data.filter(appointment => {
            const appointmentDate = moment(appointment.time, 'DD-MM-YYYY HH:mm');
            return appointmentDate.isSame(tomorrow, 'day');
          });
          console.log(filteredAppointmentsToday);
          console.log(filteredAppointmentsTomorrow)
          setAppointmentsToday(filteredAppointmentsToday);
          setAppointmentsTomorrow(filteredAppointmentsTomorrow);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 500),
    []
  );

  // debugger;

  useEffect(() => {
    debouncedGetAppointments(searchQuery, typeFilter);
  }, [searchQuery, typeFilter]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col text-end">
          <Link to="/appointments/new" className="btn btn-success">Add New Appointment</Link>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
        </div>
        <div className="col">
          <select className="form-select" onChange={handelTypeFilterChange} value={typeFilter}>
            <option value="">All</option>
            <option value="new_customer">New Customer</option>
            <option value="fitting">Fitting</option>
            <option value="last_fitting">Last Fitting</option>
          </select>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <h2 className="mb-3">Appointments for Today</h2>
          {loading && <p>Loading appointments...</p>}
          {!loading && appointmentsToday.length === 0 && <p className="mb-1">No appointments for today.</p>}
          {!loading && appointmentsToday.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {appointmentsToday.map(appointment => (
                <div className="col" key={appointment.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Time: {moment(appointment.time, 'DD-MM-YYYY HH:mm').format('D MMMM YYYY, HH:mm')}</h5>
                      <p className="card-text">Customer Name: {appointment.customers?.[0]?.name || 'N/A'}</p>
                      <p className="card-text">Customer Phone: {appointment.customers?.[0]?.phone || 'N/A'}</p>
                      <p className="card-text">Information: {appointment.information}</p>
                      <p className="card-text">Type: {appointment.type}</p>
                      <div className="text-center mt-3">
                        <Link to={`/appointments/${appointment.id}`} className="btn btn-primary me-2">Edit</Link>
                        <button onClick={() => onDelete(appointment)} className="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <h2>Appointments for Tomorrow</h2>
          {loading && <p>Loading appointments...</p>}
          {!loading && appointmentsTomorrow.length === 0 && <p>No appointments for tomorrow.</p>}
          {!loading && appointmentsTomorrow.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {appointmentsTomorrow.map(appointment => (
                <div className="col" key={appointment.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Time: {moment(appointment.time, 'DD-MM-YYYY HH:mm').format('D MMMM YYYY, HH:mm')}</h5>
                      <p className="card-text">Customer Name: {appointment.customers?.[0]?.name || 'N/A'}</p>
                      <p className="card-text">Customer Phone: {appointment.customers?.[0]?.phone || 'N/A'}</p>
                      <p className="card-text">Information: {appointment.information}</p>
                      <p className="card-text">Type: {appointment.type}</p>
                      <div className="text-center mt-3">
                        <Link to={`/appointments/${appointment.id}`} className="btn btn-primary me-2">Edit</Link>
                        <button onClick={() => onDelete(appointment)} className="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyAppointments;
