import ModuleIndex from "../../components/moduleTemplate/ModuleIndex.jsx";
import {Link} from "react-router-dom";

export default function Users() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "created_at", label: "Create Date" }
  ];

  const renderActions = (user, onDeleteClick) => (
    <>
      <Link className="btn btn-success" to={`/users/${user.id}`}>Edit</Link>
      &nbsp;
      <button className="btn btn-danger" onClick={() => onDeleteClick(user)}>Delete</button>

    </>
  );

  return (
    <ModuleIndex
      endpoint="/users"
      columns={columns}
      renderActions={renderActions}
      onDeleteMessage="Are you sure you want to delete this user?"
      entityName="Users"
    />
  );
}
