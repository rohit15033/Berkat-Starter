import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { setNotification } = useStateContext();

  const [loading, setLoading] = useState(false);a
  const [invoice, setInvoice] = useState({
    date: "",
    detail: "",
    marketing: "",
    status: "pending",
    discount: 0,
    customer_id: "",
    orders: [],
  });
  const [errors, setErrors] = useState(null);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post("/invoices", invoice);
      setNotification(response.data.message);
      navigate("/invoices");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleOrderChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOrders = [...invoice.orders];
    updatedOrders[index][name] = value;
    setInvoice({ ...invoice, orders: updatedOrders });
  };

  const handleProductChange = (orderIndex, productIndex, e) => {
    const { name, value } = e.target;
    const updatedOrders = [...invoice.orders];
    updatedOrders[orderIndex].products[productIndex][name] = value;
    setInvoice({ ...invoice, orders: updatedOrders });
  };

  const addOrder = () => {
    setInvoice({
      ...invoice,
      orders: [
        ...invoice.orders,
        {
          event_date: "",
          event_type: "",
          price: 0,
          discount: 0,
          details: "",
          products: [],
        },
      ],
    });
  };

  const removeOrder = (index) => {
    const updatedOrders = invoice.orders.filter((_, i) => i !== index);
    setInvoice({ ...invoice, orders: updatedOrders });
  };

  const addProduct = (orderIndex) => {
    const updatedOrders = [...invoice.orders];
    updatedOrders[orderIndex].products = [
      ...updatedOrders[orderIndex].products,
      { product_id: "", price: 0, discount: 0 },
    ];
    setInvoice({ ...invoice, orders: updatedOrders });
  };

  const removeProduct = (orderIndex, productIndex) => {
    const updatedOrders = [...invoice.orders];
    updatedOrders[orderIndex].products = updatedOrders[orderIndex].products.filter(
      (_, i) => i !== productIndex
    );
    setInvoice({ ...invoice, orders: updatedOrders });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Add Invoice</h1>
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
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={invoice.date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="detail" className="form-label">
                  Detail
                </label>
                <textarea
                  id="detail"
                  name="detail"
                  value={invoice.detail}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="marketing" className="form-label">
                  Marketing
                </label>
                <input
                  type="text"
                  id="marketing"
                  name="marketing"
                  value={invoice.marketing}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={invoice.status}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="discount" className="form-label">
                  Discount
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={invoice.discount}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="customer_id" className="form-label">
                  Customer ID
                </label>
                <input
                  type="number"
                  id="customer_id"
                  name="customer_id"
                  value={invoice.customer_id}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              {invoice.orders.map((order, orderIndex) => (
                <div key={orderIndex} className="mb-3 border rounded p-3">
                  <h5>Order {orderIndex + 1}</h5>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mb-3"
                    onClick={() => removeOrder(orderIndex)}
                  >
                    Remove Order
                  </button>
                  <div className="mb-3">
                    <label
                      htmlFor={`order-event_date-${orderIndex}`}
                      className="form-label"
                    >
                      Event Date
                    </label>
                    <input
                      type="date"
                      id={`order-event_date-${orderIndex}`}
                      name="event_date"
                      value={order.event_date}
                      onChange={(e) => handleOrderChange(orderIndex, e)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`order-event_type-${orderIndex}`}
                      className="form-label"
                    >
                      Event Type
                    </label>
                    <input
                      type="text"
                      id={`order-event_type-${orderIndex}`}
                      name="event_type"
                      value={order.event_type}
                      onChange={(e) => handleOrderChange(orderIndex, e)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`order-price-${orderIndex}`}
                      className="form-label"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id={`order-price-${orderIndex}`}
                      name="price"
                      value={order.price}
                      onChange={(e) => handleOrderChange(orderIndex, e)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`order-discount-${orderIndex}`}
                      className="form-label"
                    >
                      Discount
                    </label>
                    <input
                      type="number"
                      id={`order-discount-${orderIndex}`}
                      name="discount"
                      value={order.discount}
                      onChange={(e) => handleOrderChange(orderIndex, e)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`order-details-${orderIndex}`}
                      className="form-label"
                    >
                      Details
                    </label>
                    <textarea
                      id={`order-details-${orderIndex}`}
                      name="details"
                      value={order.details}
                      onChange={(e) => handleOrderChange(orderIndex, e)}
                      className="form-control"
                      required
                    ></textarea>
                  </div>
                  <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.products.map((product, productIndex) => (
                      <tr key={productIndex}>
                        <td>
                          <input
                            type="text"
                            name="product_id"
                            value={product.product_id}
                            onChange={(e) =>
                              handleProductChange(orderIndex, productIndex, e)
                            }
                            className="form-control"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(e) =>
                              handleProductChange(orderIndex, productIndex, e)
                            }
                            className="form-control"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="discount"
                            value={product.discount}
                            onChange={(e) =>
                              handleProductChange(orderIndex, productIndex, e)
                            }
                            className="form-control"
                            required
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeProduct(orderIndex, productIndex)}
                          >
                            Remove Product
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addProduct(orderIndex)}
                  >
                    Add Product
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addOrder}
              >
                Add Order
              </button>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
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
};

export default InvoiceForm;

