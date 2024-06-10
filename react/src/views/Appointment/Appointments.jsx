import { useState } from 'react';
import ModuleIndex from "../../components/moduleTemplate/ModuleIndex.jsx";
import DailyAppointments from "./DailyAppointments.jsx";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Appointments() {
  const [currentView, setCurrentView] = useState('dailyAppointments'); // Set default view to dailyAppointments
  const [filters, setFilters] = useState([]);

  return (
    <div>
      {/* Switch to toggle between views */}
      <div className="d-flex align-items-center mb-3">
        <span>Daily Appointments</span>
        <div className="form-check form-switch mx-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="viewSwitch"
            checked={currentView === 'moduleIndex'}
            onChange={() => setCurrentView(currentView === 'moduleIndex' ? 'dailyAppointments' : 'moduleIndex')}
          />
        </div>
        <span>Table View</span>
      </div>

      {/* Conditionally render components based on currentView state */}
      {currentView === 'moduleIndex' ? (
        <div>
          <ModuleIndex
            endpoint="/appointments"
            columns={[
              { key: "id", label: "ID" },
              { key: "customers.name", label: "Customer Name" },
              { key: "customers.phone", label: "Customer Phone" },
              { key: "time", label: "Time" },
              { key: "information", label: "Information" },
              { key: "type", label: "Type" },
            ]}
            renderActions={(appointment, onDeleteClick) => (
              <>
                <Link className="btn btn-success" to={`/appointments/${appointment.id}`}>Edit</Link>
                &nbsp;
                <button className="btn btn-danger" onClick={() => onDeleteClick(appointment)}>Delete</button>
              </>
            )}
            onDeleteMessage="Are you sure you want to delete this appointment?"
            entityName="Appointments"
            foreignEntity="customers"
            filters={[
              { label: "New Customer", value: "new_customer" },
              { label: "Fitting", value: "fitting" },
              { label: "Last Fitting", value: "last_fitting" }
            ]}
          />
        </div>
      ) : (
        <div className="overflow-auto" style={{ maxHeight: '100vh' }}>
          <DailyAppointments />
        </div>
      )}
    </div>
  );
}
