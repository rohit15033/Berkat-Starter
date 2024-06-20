import { Link } from "react-router-dom";
import ModuleIndex from "../../../components/moduleTemplate/ModuleIndex.jsx";
import { useState } from "react";

export default function Kebayas() {
  const columns = [
    { key: "id", label: "Product Id" },
    { key: "type", label: "Type" },
  ];

  const filters = [
    { label: "Kebaya", value: "kebaya" },
    { label: "Beskap", value: "beskap" },
    { label: "Gaun", value: "gaun" }
  ];

  const renderActions = (customer, onDeleteClick) => (
    <>
      <Link className="btn btn-success" to={`/customers/${customer.id}`}>Edit</Link>
      &nbsp;
      <button className="btn btn-danger" onClick={() => onDeleteClick(customer)}>Delete</button>
    </>
  );

  return (
    <>
      <ModuleIndex
        endpoint="/customers"
        columns={columns}
        renderActions={renderActions}
        onDeleteMessage="Are you sure you want to delete this customer?"
        entityName="Customers"
        filters={filters}
        filterKey="status"
      />
    </>
  );
}
