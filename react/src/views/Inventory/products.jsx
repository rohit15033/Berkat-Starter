import { useCallback, useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { debounce } from "lodash";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const onDeleteClick = (item) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    axiosClient.delete(`/products/${item.id}`)
      .then(() => {
        setNotification("Product was successfully deleted");
        debouncedGet(currentPage, searchQuery, selectedFilter);
      });
  };

  const debouncedGet = useCallback(
    debounce((page, query, filter) => {
      setLoading(true);
      axiosClient.get('/products', { params: { page, search: query, type: filter } })
        .then(({ data }) => {
          setLoading(false);
          setData(data.data);
          setLastPage(data.meta.last_page);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 500),
    []
  );

  useEffect(() => {
    debouncedGet(currentPage, searchQuery, selectedFilter);
  }, [currentPage, searchQuery, selectedFilter, debouncedGet]);

  return (
    <div className="row">
      <div className="col-12">
        <h1 className="mb-3">Products</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link className="btn btn-primary" to="/products/new">Add new</Link>
          <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearchQueryChange} onSearch={() => debouncedGet(1, searchQuery, selectedFilter)} />
        </div>
        <div className="d-flex justify-content-end align-items-center mb-3">
          <select value={selectedFilter} onChange={(e) => handleFilterChange(e.target.value)} className="form-select">
            <option value="">All</option>
            <option value="kebaya">Kebaya</option>
            <option value="beskap">Beskap</option>
            <option value="gaun">Gaun</option>
          </select>
        </div>
        {loading && (
          <div className="text-center mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && data.length === 0 && <p>No products found.</p>}
        {!loading && data.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
              <tr>
                <th>Product Id</th>
                <th>Type</th>
                <th>Attributes</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>
                    {Object.keys(item.attributes).length > 0 && (
                      <ul>
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}: </strong>{value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    {item.images.length > 0 ? (
                      <div className="d-flex flex-wrap">
                        {item.images.map((image, index) => (
                          <img key={index} src={`${import.meta.env.VITE_API_BASE_URL}/storage/${image}`} alt={`Product Image ${index}`} style={{ maxWidth: "100px", maxHeight: "100px", margin: "5px" }} />
                        ))}
                      </div>
                    ) : (
                      "No images"
                    )}
                  </td>
                  <td>
                    <Link className="btn btn-success" to={`/products/${item.id}`}>Edit</Link>
                    &nbsp;
                    <button className="btn btn-danger" onClick={() => onDeleteClick(item)}>Delete</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
