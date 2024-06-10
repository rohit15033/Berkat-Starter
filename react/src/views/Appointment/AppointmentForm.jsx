import ModuleForm from "../../components/moduleTemplate/ModuleForm.jsx";

export default function UserForm() {
  const appointmentFields = [
    { key: "customer_name", label: "Customer Name", placeholder: "Name" },
    { key: "customer_phone", label: "Customer Phone", placeholder: "Phone Number" },
    { key: "time", type:"datetime-local", label: "Time", placeholder: "Time" },
    { key: "information", label: "Information", placeholder: "Notes" },
    {
      key: "type",
      label: "Appointment Type",
      type: "select",
      placeholder: "Select Appointment Type",
      options: [
        { value: "last_fitting", label: "Last Fitting" },
        { value: "fitting", label: "Fitting" },
        { value: "new_customer", label: "New Customer" },
      ],
    },
  ];

  return (
    <ModuleForm
      endpoint="/appointments"
      entityName="Appointment"
      fields={appointmentFields}
      foreignEntity="customers"
    />
  );
}
