import ModuleForm from "../../components/moduleTemplate/ModuleForm.jsx";

export default function productForm() {
  const productFields = [

    {
      key: "type",
      label: "Type",
      type: "select",
      placeholder: "Select Product Type",
      options: [
        { value: "kebaya", label: "Kebaya" },
        { value: "beskap", label: "Beskap" },
        { value: "gaun", label: "Gaun" },
      ],
    },
    { key: "colour", label: "Colour", placeholder: "Colour" },
    { key: "length", label: "Length", placeholder: "Length" },
  ];
  return (
    <ModuleForm
      endpoint="/products"
      entityName="Product"
      fields={productFields}
    />
  );
}
