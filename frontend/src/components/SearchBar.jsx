import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon

// eslint-disable-next-line react/prop-types
const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm); // Pass the search term to the parent component
    };

    return (
        <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by name, father's name, address, or phone number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;