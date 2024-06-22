import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function ModuleForm({ endpoint, entityName, fields, foreignEntity }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`${endpoint}/${id}`)
        .then(({ data }) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setErrors(error.response ? error.response.data : { message: "An error occurred" });
        });
    }
  }, [id, endpoint]);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null); // Clear previous errors
    const submitData = { ...data };

    if (id) {
      delete submitData[foreignEntity];
      axiosClient.put(`${endpoint}/${id}`, submitData)
        .then(() => {
          setNotification(`${entityName} was successfully updated`);
          navigate(`/${entityName.toLowerCase()}s`); // Redirect to pluralized entity name
        })
        .catch((error) => {
          setLoading(false);
          setErrors(error.response ? error.response.data : { message: "An error occurred" });
        });
    } else {
      axiosClient.post(endpoint, submitData)
        .then(() => {
          setNotification(`${entityName} was successfully created`);
          navigate(`/${entityName.toLowerCase()}s`); // Redirect to pluralized entity name
        })
        .catch((error) => {
          setLoading(false);
          setErrors(error.response ? error.response.data : { message: "An error occurred" });
        });
    }
  };

  const toDateTimeLocal = (dateTimeString) => {
    const [date, time] = dateTimeString.split(' ');
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}T${time}`;
  };

  const toOriginalFormat = (dateTimeLocalString) => {
    const [date, time] = dateTimeLocalString.split('T');
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year} ${time}`;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setData(prevData => {
      // If the field type is datetime-local, convert the value to the original format
      const newValue = type === "datetime-local" ? toOriginalFormat(value) : value;
      return { ...prevData, [name]: newValue };
    });
  };

  const dataMapper = (item) => {
    const mappedItem = { ...item };
    if (foreignEntity && item[foreignEntity] && item[foreignEntity].length > 0) {
      mappedItem["customer_name"] = item[foreignEntity][0].name; // Update field name
      mappedItem["customer_phone"] = item[foreignEntity][0].phone; // Update field name
    }

    // Convert datetime fields to datetime-local format
    fields.forEach(field => {
      if (field.type === "datetime-local" && mappedItem[field.key]) {
        mappedItem[field.key] = toDateTimeLocal(mappedItem[field.key]);
      }
    });

    return mappedItem;
  };

  const mappedData = dataMapper(data);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">{id ? `Edit ${entityName}` : `Add ${entityName}`}</h1>
          {errors && errors.errors && (
            <div className="alert alert-danger">
              <ul>
                {Object.entries(errors.errors).map(([key, messages]) => (
                  <li key={key}>
                    {messages.map((message) => (
                      <span key={message}>{message}</span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form onSubmit={onSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="mb-3">
                <label htmlFor={field.key} className="form-label">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    id={field.key}
                    name={field.key}
                    value={mappedData[field.key] || ""}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    id={field.key}
                    name={field.key}
                    value={mappedData[field.key] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="form-control"
                    disabled={id && field.key.startsWith(foreignEntity)}
                  />
                )}
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
