import ModuleIndex from "../../components/ModuleIndex.jsx";
import {Link} from "react-router-dom";

export default function Customers() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "customers.name", label: "Customer Name" },
    { key: "customers.phone", label: "Customer Phone" },
    { key: "time", label: "Time" },
    { key: "information", label: "Information" },
    { key: "type", label: "Type" },
  ];


  const renderActions = (appointment, onDeleteClick) => (
    <>
      <Link className="btn-edit" to={`/appointments/${appointment.id}`}>Edit</Link>
      &nbsp;
      <button className="btn-delete" onClick={() => onDeleteClick(appointment)}>Delete</button>
    </>
  );

  return (
    <ModuleIndex
      endpoint="/appointments"
      columns={columns}
      renderActions={renderActions}
      onDeleteMessage="Are you sure you want to delete this appointment?"
      entityName="Appointments"
      foreignEntity = "customers" //lower case*
    />
  );
}
