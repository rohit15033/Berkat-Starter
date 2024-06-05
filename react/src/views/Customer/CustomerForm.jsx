import ModuleForm from "../../components/ModuleForm.jsx";

export default function CustomerForm() {
  const customerFields = [
    { key: "name", label: "Name", placeholder: "Name" },
    { key: "phone", label: "Phone Number", placeholder: "Phone Number" },
    { key: "instagram", label: "Instagram", placeholder: "Instagram" },
    {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "Set Customer Status",
      options: [
        { value: "chat", label: "Chat" },
        { value: "visit", label: "Visit" },
        { value: "Reschedule", label: "Reschedule" },
        { value: "deal", label: "Deal" },
        { value: "followed up", label: "Followed Up" },
      ],
    },
  ];

  return (
    <ModuleForm
      endpoint="/customers"
      entityName="Customer"
      fields={customerFields}
    />
  );
}
