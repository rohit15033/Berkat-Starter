import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { getEntityById, updateEntity, createEntity } from "../api.js";
import DSLogo from "../../assets/DSLogo.jpg";
import { useRef } from "react";

export default function ModuleForm({ endpoint, entityName, fields, foreignEntity }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getEntityById(endpoint, id)
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          setErrors(error);
        });
    }
  }, [id, endpoint]);

  const validateForm = () => {
    const errors = {};
    fields.forEach(field => {
      if (!data[field.key]) {
        errors[field.key] = `${field.label} is required`;
      }
    });
    return errors;
  };

  const onSubmit = ev => {
    ev.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    const submitData = { ...data };
    if (id) {
      delete submitData[foreignEntity];
      updateEntity(endpoint, id, submitData)
        .then(() => {
          navigate(`/${entityName.toLowerCase()}s`);
        })
        .catch(error => {
          setLoading(false);
          setErrors(error);
        });
    } else {
      createEntity(endpoint, submitData)
        .then(() => {
          navigate(`/${entityName.toLowerCase()}s`);
        })
        .catch(error => {
          setLoading(false);
          setErrors(error);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="container">
      <main className="form-signin">
        <form onSubmit={onSubmit} className="p-4 border rounded">
          <img className="mb-4" src={DSLogo} alt="" width="72" height="57"/>
          <h1 className="h3 mb-3 fw-normal">{id ? `Edit ${entityName}` : `Add ${entityName}`}</h1>
          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger">
              {Object.values(errors).map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          {fields.map((field) => (
            <div key={field.key} className="form-floating mb-3">
              {field.type === "select" ? (
                <select
                  id={field.key}
                  name={field.key}
                  value={data[field.key] || ""}
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
                  value={data[field.key] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="form-control"
                  disabled={id && field.key.startsWith(foreignEntity)}
                />
              )}
            </div>
          ))}
          <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </main>
    </div>
  );
}
