import ModuleIndex from "../../components/moduleTemplate/ModuleIndex.jsx";
import {Link} from "react-router-dom";

export default function Customers() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "instagram", label: "Instagram" },
    { key: "phone", label: "Phone Number" },
    { key: "status", label: "Status " }
  ];

  const renderActions = (customer, onDeleteClick) => (
    <>
      <Link className="btn btn-success" to={`/customers/${customer.id}`}>Edit</Link>
      &nbsp;
      <button className="btn btn-danger" onClick={() => onDeleteClick(customer)}>Delete</button>
    </>
  );

  return (
    <ModuleIndex
      endpoint="/customers"
      columns={columns}
      renderActions={renderActions}
      onDeleteMessage="Are you sure you want to delete this customer?"
      entityName="Customers"
    />
  );
}
