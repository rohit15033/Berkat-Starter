import ModuleIndex from "../../components/moduleTemplate/ModuleIndex.jsx";
import {Link} from "react-router-dom";

export default function Customers() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "time", label: "Time" },
    { key: "information", label: "Information" },
    { key: "type", label: "Type" },
  ];


  const renderActions = (invoice, onDeleteClick, onPrintClick) => (
    <>
      <Link className="btn-edit" to={`/invoices/${invoice.id}`}>Edit</Link>
      &nbsp;
      <button className="btn-delete" onClick={() => onDeleteClick(invoice)}>Delete</button>
      <button className="btn-print" onClick={() => onPrintClick(invoice)}>Print</button>
    </>
  );

  return (
    <ModuleIndex
      endpoint="/invoices"
      columns={columns}
      renderActions={renderActions}
      onDeleteMessage="Are you sure you want to delete this invoice?"
      entityName="Invoices"
    />
  );
}
