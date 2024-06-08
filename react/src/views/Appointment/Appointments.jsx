import { useState } from 'react';
import ModuleIndex from "../../components/moduleTemplate/ModuleIndex.jsx";
import DailyAppointments from "./DailyAppointments.jsx";
import { Link } from "react-router-dom";

export default function Appointments() {
  const [filters, setFilters] = useState([]);

  return (
    <div>
      {/* Show ModuleIndex on large screens */}
      <div className="d-none d-lg-block">
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
          foreignEntity="customers" //lower case*
          filters={[
            { label: "All", value: "" },
            { label: "New Customer", value: "new_customer" },
            { label: "Fitting", value: "fitting" },
            { label: "Last Fitting", value: "last_fitting" }]}
        />
      </div>
      {/* Show DailyAppointments on medium screens */}
      <div className="d-lg-none overflow-auto" style={{ maxHeight: '100vh' }}>
        <DailyAppointments />
      </div>
    </div>
  );
}
