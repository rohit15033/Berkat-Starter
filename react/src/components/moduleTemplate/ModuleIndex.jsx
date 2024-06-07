// ModuleIndex.jsx

import { useCallback, useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { debounce } from "lodash";
import Pagination from "../Pagination.jsx";
import SearchBar from "../SearchBar.jsx";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function ModuleIndex({ endpoint, columns, renderActions, entityName, foreignEntity }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
        getData();
      });
  };

  const debouncedGet = useCallback(
    debounce((page, query) => {
      setLoading(true);
      axiosClient.get(endpoint, { params: { page, search: query } })
        .then(({ data }) => {
          setLoading(false);
          setData(data.data);
          console.log(data)
          setLastPage(data.meta.last_page);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 500),
    []
  );

  useEffect(() => {
    debouncedGet(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const dataMapper = (item) => {
    const mappedItem = { ...item };
    if (foreignEntity && item[foreignEntity] && item[foreignEntity].length > 0) {
      mappedItem[`${foreignEntity}.name`] = item[foreignEntity][0].name;
      mappedItem[`${foreignEntity}.phone`] = item[foreignEntity][0].phone;
    }
    return mappedItem;
  };

  const mappedData = data.map(dataMapper);
  // console.log(mappedData);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>{entityName}</h1>
        <Link className="btn-add" to={`${endpoint}/new`}>Add new</Link>
      </div>
      {currentPage === 1 && <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />}
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
          </thead>
          {loading && (
            <tbody>
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          )}
          {!loading && data.length > 0 && (
            <tbody>
            {mappedData.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>{item[col.key]}</td>
                ))}
                <td>{renderActions(dataMapper(item), onDeleteClick)}</td>
              </tr>
            ))}
            </tbody>
          )}
          {!loading && data.length === 0 && (
            <tbody>
            <tr>
              <td colSpan={columns.length + 1} className="text-center">No {entityName.toLowerCase()} found.</td>
            </tr>
            </tbody>
          )}
        </table>
      </div>
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={handlePageChange} />
    </div>
  );
}
