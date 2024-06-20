import ModuleIndex from "../../components/moduleTemplate/ModuleIndex.jsx";
import {Link} from "react-router-dom";

export default function products() {
  const filters = [
    { label: "New Customer", value: "new_customer" },
    { label: "Fitting", value: "fitting" },
    { label: "Last Fitting", value: "last_fitting" }
  ];
  return (
    <>
      <div>
        <ModuleIndex
          endpoint="/products"
          columns={[
            { key: "id", label: "ID" },
            { key: "type", label: "Type" },
          ]}
          renderActions={(product, onDeleteClick) => (
            <>
              <Link className="btn btn-success" to={`/products/${product.id}`}>Edit</Link>
              &nbsp;
              <button className="btn btn-danger" onClick={() => onDeleteClick(product)}>Delete</button>
            </>
          )}
          onDeleteMessage="Are you sure you want to delete this appointment?"
          entityName="Products"
          foreignEntity="kebayas"
          filters={filters}
          filterKey="type"
        />
      </div>
    </>
  );
}
