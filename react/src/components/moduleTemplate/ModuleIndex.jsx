import { useCallback, useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { debounce } from "lodash";
import Pagination from "../Pagination.jsx";
import SearchBar from "../SearchBar.jsx";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function ModuleIndex({ endpoint, columns, renderActions, entityName, foreignEntity, filters }) {
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

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const onDeleteClick = (item) => {
    if (!window.confirm(`${item} was successfully deleted`)) {
      return;
    }
    axiosClient.delete(`${endpoint}/${item.id}`)
      .then(() => {
        setNotification(`${entityName} was successfully deleted`);
        debouncedGet();
      });
  };

  const debouncedGet = useCallback(
    debounce((page, query, filter) => {
      setLoading(true);
      axiosClient.get(endpoint, { params: { page, search: query, filter } })
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
  }, [currentPage, searchQuery, selectedFilter]);

  const dataMapper = (item) => {
    const mappedItem = { ...item };
    if (foreignEntity && item[foreignEntity] && item[foreignEntity].length > 0) {
      mappedItem[`${foreignEntity}.name`] = item[foreignEntity][0].name;
      mappedItem[`${foreignEntity}.phone`] = item[foreignEntity][0].phone;
    }
    return mappedItem;
  };

  const mappedData = data.map(dataMapper);

  return (
    <div className="overflow-">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-3">{entityName}</h1>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link className="btn btn-primary" to={`${endpoint}/new`}>Add new</Link>
            {currentPage === 1 && (
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
            )}
          </div>
          {filters && filters.length > 0 && (
            <div className="d-flex justify-content-end align-items-center mb-3">
              <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} className="form-select">
                <option value="">All</option>
                {filters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>
          )}
          {loading && <p>Loading {entityName}...</p>}
          {!loading && data.length === 0 && <p>No {entityName.toLowerCase()} found.</p>}
          {!loading && data.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {mappedData.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col.key}>{item[col.key]}</td>
                    ))}
                    <td>
                      {renderActions(item, onDeleteClick)}
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
    </div>
  );
}
