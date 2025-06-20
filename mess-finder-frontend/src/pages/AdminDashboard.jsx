import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    messes: [],
    owners: [],
    users: [],
    stats: {
      totalMesses: 0,
      totalOwners: 0,
      totalUsers: 0,
      topAreas: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "overview":
          await fetchOverviewData();
          break;
        case "messes":
          await fetchMesses();
          break;
        case "owners":
          await fetchOwners();
          break;
        case "users":
          await fetchUsers();
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error fetching data");
    }
    setLoading(false);
  };

  const fetchOverviewData = async () => {
    const [messesRes, ownersRes] = await Promise.all([
      axios.get("http://localhost:5000/api/mess/all"),
      axios.get("http://localhost:5000/api/users?role=owner", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const messes = messesRes.data;
    const owners = ownersRes.data;

    // Calculate stats
    const areaCount = {};
    messes.forEach((mess) => {
      areaCount[mess.area] = (areaCount[mess.area] || 0) + 1;
    });

    const topAreas = Object.entries(areaCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }));

    setData((prev) => ({
      ...prev,
      messes,
      owners,
      stats: {
        totalMesses: messes.length,
        totalOwners: owners.length,
        totalUsers: owners.length, // For now, same as owners
        topAreas,
      },
    }));
  };

  const fetchMesses = async () => {
    const response = await axios.get("http://localhost:5000/api/mess/all");
    setData((prev) => ({ ...prev, messes: response.data }));
  };

  const fetchOwners = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/users?role=owner",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setData((prev) => ({ ...prev, owners: response.data }));
  };

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData((prev) => ({ ...prev, users: response.data }));
  };

  const deleteMess = async (messId) => {
    if (!window.confirm("Are you sure you want to delete this mess?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/mess/${messId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Mess deleted successfully");
      fetchMesses();
    } catch (error) {
      setMessage("Error deleting mess");
    }
  };

  const deactivateUser = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;

    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/deactivate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("User deactivated successfully");
      fetchData();
    } catch (error) {
      setMessage("Error deactivating user");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const tabs = [
    { id: "overview", name: "📊 Overview", icon: "📊" },
    { id: "messes", name: "🍽️ Messes", icon: "🍽️" },
    { id: "owners", name: "👥 Owners", icon: "👥" },
    { id: "users", name: "👤 Users", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🛠️ Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your mess finder platform
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
            {message}
            <button
              onClick={() => setMessage("")}
              className="float-right text-blue-700 hover:text-blue-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && !loading && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Messes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.totalMesses}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Owners
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.totalOwners}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.totalUsers}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Areas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📍 Top Areas by Mess Count
              </h3>
              <div className="space-y-3">
                {data.stats.topAreas.map((area, index) => (
                  <div
                    key={area.area}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {area.area}
                      </span>
                    </div>
                    <span className="text-gray-600">{area.count} messes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messes Tab */}
        {activeTab === "messes" && !loading && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                All Mess Listings
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mess Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.messes.map((mess) => (
                    <tr key={mess.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {mess.image_url && (
                            <img
                              className="h-10 w-10 rounded-full object-cover mr-3"
                              src={`http://localhost:5000${mess.image_url}`}
                              alt={mess.name}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {mess.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {mess.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mess.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{mess.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            mess.delivery
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mess.delivery ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteMess(mess.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Owners Tab */}
        {activeTab === "owners" && !loading && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Registered Owners
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.owners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {owner.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {owner.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {owner.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {owner.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deactivateUser(owner.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && !loading && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => deactivateUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
