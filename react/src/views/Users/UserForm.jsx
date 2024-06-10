import ModuleForm from "../../components/moduleTemplate/ModuleForm.jsx";

export default function UserForm() {
  const userFields = [
    { key: "name", label: "Name", placeholder: "Name" },
    { key: "email", label: "Email", placeholder: "Email" },
    { key: "password", label: "Password", type: "password", placeholder: "Password" },
    { key: "password_confirmation", label: "Password Confirmation", type: "password", placeholder: "Password Confirmation" },
  ];

  return (
    <ModuleForm
      endpoint="/users"
      entityName="User"
      fields={userFields}
    />
  );
}
