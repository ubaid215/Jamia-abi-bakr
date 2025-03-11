/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const MigrationHistory = ({ studentId }) => {
  const [migrationHistory, setMigrationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Display loading or error messages
  if (loading) {
    return <p className="text-center">Loading migration history...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Display migration history
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Migration History</h3>
      {migrationHistory.length === 0 ? (
        <p>No migration history found for this student.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">From Class</th>
              <th className="p-2 border">To Class</th>
              <th className="p-2 border">Migrated By</th>
            </tr>
          </thead>
          <tbody>
            {migrationHistory.map((migration, index) => (
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
      )}
    </div>
  );
};

export default MigrationHistory;