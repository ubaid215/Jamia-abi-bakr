/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const MigrationHistory = ({ studentId }) => {
  const [migrationHistory, setMigrationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch migration history for the student
  const fetchMigrationHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${studentId}/migration-history`
      );
      if (response.data && response.data.success) {
        setMigrationHistory(response.data.migrationHistory);
      } else {
        setError("No migration history found");
      }
    } catch (error) {
      setError("Error fetching migration history: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch migration history when the component mounts
  useEffect(() => {
    fetchMigrationHistory();
  }, [studentId]);

  // Sort migration history
  const sortedMigrationHistory = [...migrationHistory].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMigrationHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Display loading or error messages
  if (loading) {
    return (
      <div className="text-center">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
        <p>Loading migration history...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Migration History</h3>
      <button
        onClick={fetchMigrationHistory}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Refresh
      </button>
      {migrationHistory.length === 0 ? (
        <p className="text-center text-gray-500">No migration history found for this student.</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">
                  <button onClick={() => requestSort("date")}>Date</button>
                </th>
                <th className="p-2 border">
                  <button onClick={() => requestSort("fromClass")}>From Class</button>
                </th>
                <th className="p-2 border">
                  <button onClick={() => requestSort("toClass")}>To Class</button>
                </th>
                <th className="p-2 border">
                  <button onClick={() => requestSort("migratedBy")}>Migrated By</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((migration, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {new Date(migration.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{migration.fromClass}</td>
                  <td className="p-2 border">{migration.toClass}</td>
                  <td className="p-2 border">{migration.migratedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={migrationHistory.length}
            paginate={paginate}
          />
        </>
      )}
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MigrationHistory;