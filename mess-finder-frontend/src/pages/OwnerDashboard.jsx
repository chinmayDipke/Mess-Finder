import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("messes");
  const [myMesses, setMyMesses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingMess, setEditingMess] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", phone: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      fetchMyMesses(payload.id);
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  }, [navigate, token]);

  const fetchMyMesses = async (ownerId) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/mess/all");
      const ownerMesses = response.data.filter(
        (mess) => mess.owner_id === ownerId
      );
      setMyMesses(ownerMesses);
    } catch (error) {
      console.error("Error fetching messes:", error);
      setMessage("Error loading your messes");
    } finally {
      setLoading(false);
    }
  };

  const deleteMess = async (messId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this mess? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/mess/${messId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Mess deleted successfully!");
      fetchMyMesses(user.id);
    } catch (error) {
      console.error("Error deleting mess:", error);
      setMessage("Error deleting mess. Please try again.");
    }
  };

  const handleEditMess = async (messId, formData) => {
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          form.append(key, formData[key]);
        }
      });

      await axios.put(`http://localhost:5000/api/mess/${messId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Mess updated successfully!");
      setEditingMess(null);
      fetchMyMesses(user.id);
    } catch (error) {
      console.error("Error updating mess:", error);
      setMessage("Error updating mess. Please try again.");
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Profile updated successfully!");
      setShowProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    { id: "messes", name: "🍽️ My Messes", icon: "🍽️" },
    { id: "analytics", name: "📊 Analytics", icon: "📊" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                👤 Owner Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name || "Owner"}!
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowProfile(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/upload-mess"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center"
            >
              ➕ Upload New Mess
            </Link>
            <Link
              to="/messes"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
            >
              👁️ View All Messes
            </Link>
          </div>
        </div>

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

        {/* My Messes Tab */}
        {activeTab === "messes" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Messes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myMesses.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      With Delivery
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myMesses.filter((mess) => mess.delivery).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Price
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹
                      {myMesses.length > 0
                        ? Math.round(
                            myMesses.reduce(
                              (sum, mess) => sum + mess.price,
                              0
                            ) / myMesses.length
                          )
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messes List */}
            {myMesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No messes uploaded yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by uploading your first mess to attract customers
                </p>
                <Link
                  to="/upload-mess"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium inline-block"
                >
                  Upload Your First Mess
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myMesses.map((mess) => (
                  <div
                    key={mess.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Image */}
                    {mess.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`http://localhost:5000${mess.image_url}`}
                          alt={mess.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {mess.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span>📍</span>
                          <span className="ml-2">{mess.area}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>💰</span>
                          <span className="ml-2">₹{mess.price}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span>{mess.delivery ? "🚚" : "🏪"}</span>
                          <span className="ml-2 text-gray-600">
                            {mess.delivery
                              ? "Delivery Available"
                              : "Pickup Only"}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingMess(mess)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMess(mess.id)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Your Business Analytics
            </h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Analytics Coming Soon
              </h4>
              <p className="text-gray-600">
                Track views, clicks, and performance metrics for your messes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Mess Modal */}
      {editingMess && (
        <EditMessModal
          mess={editingMess}
          onClose={() => setEditingMess(null)}
          onSave={handleEditMess}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          profileData={profileData}
          setProfileData={setProfileData}
          onClose={() => setShowProfile(false)}
          onSave={updateProfile}
          user={user}
        />
      )}
    </div>
  );
}

// Edit Mess Modal Component
const EditMessModal = ({ mess, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: mess.name,
    area: mess.area,
    price: mess.price,
    delivery: mess.delivery.toString(),
    menu: Array.isArray(mess.menu) ? mess.menu.join(", ") : mess.menu,
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(mess.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Edit Mess</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Mess Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.delivery}
            onChange={(e) =>
              setFormData({ ...formData, delivery: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="true">Delivery Available</option>
            <option value="false">No Delivery</option>
          </select>
          <input
            type="text"
            placeholder="Menu (comma separated)"
            value={formData.menu}
            onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({
  profileData,
  setProfileData,
  onClose,
  onSave,
  user,
}) => {
  useEffect(() => {
    setProfileData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user, setProfileData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-3">
            <button
              onClick={onSave}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
