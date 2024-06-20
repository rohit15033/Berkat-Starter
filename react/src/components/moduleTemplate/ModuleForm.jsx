import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    id: null,
    type: "",
    colour: "",
    length: ""
  });
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (product.id) {
      axiosClient.put(`/products/${product.id}`, product)
        .then(() => {
          setNotification("Product has been updated successfully");
          navigate('/products');
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post(`/products`, product)
        .then(() => {
          setNotification("Product has been created successfully");
          navigate('/products');
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProduct(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">{product.id ? "Edit Product" : "Add Product"}</h1>
          {errors && (
            <div className="alert alert-danger">
              <ul>
                {Object.keys(errors).map((key) => (
                  <li key={key}>{errors[key][0]}</li>
                ))}
              </ul>
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">Type</label>
              <select
                id="type"
                name="type"
                value={product.type}
                onChange={ev => setProduct({ ...product, type: ev.target.value })}
                className="form-select"
              >
                <option value="" disabled>Select Product Type</option>
                <option value="kebaya">Kebaya</option>
                <option value="beskap">Beskap</option>
                <option value="gaun">Gaun</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="colour" className="form-label">Colour</label>
              <input
                type="text"
                id="colour"
                name="colour"
                value={product.colour}
                onChange={ev => setProduct({ ...product, colour: ev.target.value })}
                placeholder="Colour"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="length" className="form-label">Length</label>
              <input
                type="text"
                id="length"
                name="length"
                value={product.length}
                onChange={ev => setProduct({ ...product, length: ev.target.value })}
                placeholder="Length"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
