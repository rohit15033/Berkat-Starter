import { useEffect, useState, useCallback } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import Pagination from "../components/Pagination.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { debounce } from "lodash";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getCustomers();
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    debouncedGetCustomers(currentPage, searchQuery, statusFilter);
  }, [currentPage, searchQuery, statusFilter]);

  const getCustomers = useCallback((page, query, status) => {
    setLoading(true);
    axiosClient.get('/customers', { params: { page, search: query, status } })
      .then(({ data }) => {
        setLoading(false);
        setCustomers(data.data);
        setLastPage(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const onDelete = (customer) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    axiosClient.delete(`/customers/${customer.id}`)
      .then(() => {
        setNotification("Customer has been deleted successfully");
        getCustomers(currentPage, searchQuery, statusFilter);
      });
  }

  const debouncedGetCustomers = useCallback(
    debounce((page, query, status) => {
      getCustomers(page, query, status);
    }, 500),
    [getCustomers]
  );

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn-add">Add New Customer</Link>
      </div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
        <select onChange={handleStatusFilterChange} value={statusFilter}>
          <option value="">All</option>
          <option value="chat">Chat</option>
          <option value="visit">Visit</option>
          <option value="dealing">Dealing</option>
          <option value="reschedule">Reschedule</option>
        </select>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Instagram</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          {loading && (
            <tbody>
            <tr>
              <td colSpan="6" className={"text-center"}>Loading...</td>
            </tr>
            </tbody>
          )}
          {!loading && customers.length > 0 && (
            <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.instagram}</td>
                <td>{customer.status}</td>
                <td>
                  <Link to={'/customers/' + customer.id} className="btn-edit">Edit</Link>
                  &nbsp;
                  <button onClick={ev => onDelete(customer)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          )}
          {!loading && customers.length === 0 && (
            <tbody>
            <tr>
              <td colSpan="6" className="text-center">No customers found.</td>
            </tr>
            </tbody>
          )}
        </table>
      </div>
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={handlePageChange} />
    </div>
  )
}
