// src/pages/MessUpload.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MessUpload() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    price: "",
    delivery: "false",
    menu: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Check user authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ ...payload, token });
      setLoading(false);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Only mess owners can access
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user || user.role !== "owner") {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600 text-center">
          Access denied. Only mess owners can upload mess data.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/mess/upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessage(res.data.message);

      // Auto-clear form after successful submission
      setFormData({
        name: "",
        area: "",
        price: "",
        delivery: "false",
        menu: "",
        image: null,
      });
      setPreview(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      // Redirect to owner dashboard after success
      setTimeout(() => {
        navigate("/owner");
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage(
        err.response?.data?.error || "Upload failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Mess Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Mess Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="area"
          type="text"
          placeholder="Area/Location"
          value={formData.area}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="delivery"
          value={formData.delivery}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="true">Delivery Available</option>
          <option value="false">No Delivery</option>
        </select>

        <input
          name="menu"
          type="text"
          placeholder="Menu items (comma separated)"
          value={formData.menu}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-full object-cover rounded border"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Upload Mess
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
