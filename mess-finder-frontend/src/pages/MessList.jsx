// src/pages/MessList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MessList = () => {
  const [messes, setMesses] = useState([]);
  const [filteredMesses, setFilteredMesses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    delivery: "all",
    priceRange: "all",
    area: "all",
  });

  // Get unique areas for filter dropdown
  const uniqueAreas = [...new Set(messes.map((mess) => mess.area))];

  useEffect(() => {
    fetch("http://localhost:5000/api/mess/all")
      .then((res) => res.json())
      .then((data) => {
        setMesses(data);
        setFilteredMesses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messes:", err);
        setError("Failed to load messes");
        setLoading(false);
      });
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = messes.filter((mess) => {
      const matchesSearch =
        mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mess.area.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDelivery =
        filters.delivery === "all" ||
        (filters.delivery === "yes" && mess.delivery) ||
        (filters.delivery === "no" && !mess.delivery);

      const matchesArea = filters.area === "all" || mess.area === filters.area;

      const matchesPrice =
        filters.priceRange === "all" ||
        (filters.priceRange === "low" && mess.price <= 100) ||
        (filters.priceRange === "medium" &&
          mess.price > 100 &&
          mess.price <= 200) ||
        (filters.priceRange === "high" && mess.price > 200);

      return matchesSearch && matchesDelivery && matchesArea && matchesPrice;
    });

    setFilteredMesses(filtered);
  }, [searchTerm, filters, messes]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      delivery: "all",
      priceRange: "all",
      area: "all",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {" "}
                🍽️ Available Messes
              </h1>
              <p className="text-gray-600 mt-1">
                Discover delicious meal options near you
              </p>
            </div>
            <Link
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search Messes
              </label>
              <input
                type="text"
                placeholder="Search by name or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Delivery Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🚚 Delivery
              </label>
              <select
                value={filters.delivery}
                onChange={(e) => handleFilterChange("delivery", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="low">₹0 - ₹100</option>
                <option value="medium">₹101 - ₹200</option>
                <option value="high">₹200+</option>
              </select>
            </div>

            {/* Area Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Area
              </label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange("area", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Areas</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Clear All Filters
            </button>
            <p className="text-gray-600">
              Showing {filteredMesses.length} of {messes.length} messes
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {filteredMesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No messes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMesses.map((mess) => (
              <div
                key={mess.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Image */}
                {mess.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`http://localhost:5000${mess.image_url}`}
                      alt={mess.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Mess Name */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {mess.name}
                  </h2>

                  {/* Location */}
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="text-sm">📍</span>
                    <span className="ml-2 text-sm">{mess.area}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center text-green-600 font-semibold mb-3">
                    <span className="text-lg">₹{mess.price}</span>
                    <span className="text-sm text-gray-500 ml-1">per meal</span>
                  </div>

                  {/* Delivery Badge */}
                  <div className="mb-3">
                    {mess.delivery ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🚚 Delivery Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        🏪 Pickup Only
                      </span>
                    )}
                  </div>

                  {/* Menu */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Menu:
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {Array.isArray(mess.menu)
                        ? mess.menu.join(", ")
                        : mess.menu}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/messes/${mess.id}`}
                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessList;
