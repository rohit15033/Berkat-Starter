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
    adat: "",
    length: "",
    images: [],
  });
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const kebayaAttributes = {
    colour: "",
    length: "",
  };

  const gaunAttributes = {
    colour: "",
    length: "",
  };

  const beskapAttributes = {
    colour: "",
    adat: "",
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("type", product.type);

    if (product.type === "beskap") {
      formData.append("adat", product.adat);
      formData.append("colour", product.colour);
    } else if (product.type === "kebaya" || product.type === "gaun") {
      formData.append("colour", product.colour);
      formData.append("length", product.length);
    }

    for (let i = 0; i < product.images.length; i++) {
      formData.append(`images[${i}]`, product.images[i]);
    }

    const requestMethod = product.id
      ? axiosClient.put(`/products/${product.id}`, formData)
      : axiosClient.post(`/products`, formData);

    setLoading(true);
    requestMethod
      .then(() => {
        const message = product.id
          ? "Product has been updated successfully"
          : "Product has been created successfully";
        setNotification(message);
        navigate("/products");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProduct({
            id: data.id,
            type: data.type,
            colour: data.attributes.colour,
            length: data.attributes.length,
            adat: data.attributes.adat,
            images: [],
          });
          setImagePreviews(
            data.images.map(
              (image) => `${import.meta.env.VITE_API_BASE_URL}/storage/${image}`
            )
          );
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);

    if (selectedImageIndex !== null) {
      const updatedImages = [...product.images];
      updatedImages[selectedImageIndex] = filesArray[0];
      setProduct({ ...product, images: updatedImages });

      const updatedPreviews = [...imagePreviews];
      updatedPreviews[selectedImageIndex] = URL.createObjectURL(filesArray[0]);
      setImagePreviews(updatedPreviews);
      setSelectedImageIndex(null);
    } else {
      setProduct({ ...product, images: [...product.images, ...filesArray] });
      setImagePreviews([
        ...imagePreviews,
        ...filesArray.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const renderFormFields = () => {
    let attributes = {};
    if (product.type === "kebaya") {
      attributes = kebayaAttributes;
    } else if (product.type === "gaun") {
      attributes = gaunAttributes;
    } else if (product.type === "beskap") {
      attributes = beskapAttributes;
    }

    return Object.keys(attributes).map((key) => (
      <div className="mb-3" key={key}>
        <label htmlFor={key} className="form-label">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        <input
          type="text"
          id={key}
          name={key}
          value={product[key]}
          onChange={(ev) => setProduct({ ...product, [key]: ev.target.value })}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          className="form-control"
          required
        />
      </div>
    ));
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    document.getElementById("image").click();
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct({ ...product, images: updatedImages });

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">{product.id ? "Edit Product" : "Add Product"}</h1>
          {errors && (
            <div className="alert alert-danger">
              {Object.values(errors).map((error, idx) => (
                <p key={idx}>{error}</p>
              ))}
            </div>
          )}
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={product.type}
                  onChange={(ev) =>
                    setProduct({ ...product, type: ev.target.value })
                  }
                  className="form-select"
                  required
                >
                  <option value="" disabled>
                    Select Product Type
                  </option>
                  <option value="kebaya">Kebaya</option>
                  <option value="beskap">Beskap</option>
                  <option value="gaun">Gaun</option>
                </select>
              </div>

              {product.type && renderFormFields()}

              <div className="mb-3">
                <label htmlFor="image" className="form-label link-primary">
                  Add Images
                </label>
                <input
                  type="file"
                  id="image"
                  name="img"
                  onChange={handleFileChange}
                  className="form-control"
                  multiple
                  style={{ display: "none" }}
                  required={!product.id}
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="mb-3">
                  <h5>Image Previews:</h5>
                  <div className="d-flex flex-wrap">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="img-thumbnail m-1"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(index)}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => handleImageRemove(index)}
                          style={{ borderRadius: "50%", padding: "0.25rem" }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
