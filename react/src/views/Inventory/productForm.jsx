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
    adat: "", // Adjusted for 'beskap' type
    img: null, // Changed to 'img' to match backend's expected field name
  });
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  // Function to handle form submission
  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("type", product.type);
    formData.append("colour", product.colour);
    formData.append("adat", product.adat); // Adjusted for 'beskap' type
    formData.append("img", product.img); // Changed to 'img' to match backend's expected field name

    // Determine whether to send a POST or PUT request based on whether product has an ID
    const requestMethod = product.id
      ? axiosClient.put(`/products/${product.id}`, formData)
      : axiosClient.post(`/products`, formData);

    // Make the API request
    requestMethod
      .then(() => {
        const message = product.id
          ? "Product has been updated successfully"
          : "Product has been created successfully";
        setNotification(message);
        navigate('/products');
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Fetch product details if editing an existing product
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProduct(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Function to handle file input change
  const handleFileChange = (e) => {
    setProduct({ ...product, img: e.target.files[0] });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">{product.id ? "Edit Product" : "Add Product"}</h1>
          {errors && errors.img && (
            <div className="alert alert-danger">{errors.img[0]}</div>
          )}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="type" className="form-label">Type</label>
                <select
                  id="type"
                  name="type"
                  value={product.type}
                  onChange={(ev) => setProduct({ ...product, type: ev.target.value })}
                  className="form-select"
                  required
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
                  onChange={(ev) => setProduct({ ...product, colour: ev.target.value })}
                  placeholder="Colour"
                  className="form-control"
                  required
                />
              </div>
              {product.type === 'beskap' && (
                <div className="mb-3">
                  <label htmlFor="adat" className="form-label">Adat</label>
                  <input
                    type="text"
                    id="adat"
                    name="adat"
                    value={product.adat}
                    onChange={(ev) => setProduct({ ...product, adat: ev.target.value })}
                    placeholder="Adat"
                    className="form-control"
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image</label>
                <input
                  type="file"
                  id="image"
                  name="img"
                  onChange={handleFileChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
