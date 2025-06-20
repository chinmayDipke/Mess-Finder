// src/pages/MessUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const MessUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    price: "",
    delivery: "false",
    menu: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("area", formData.area);
    data.append("price", formData.price);
    data.append("delivery", formData.delivery);
    data.append("menu", formData.menu); // comma separated string
    data.append("image", formData.image);

    try {
      const token = localStorage.getItem("token"); // make sure token is stored on login
      const response = await axios.post(
        "http://localhost:5000/api/mess/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Mess uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("Failed to upload mess");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Mess Info</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          type="text"
          placeholder="Mess Name"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          name="area"
          type="text"
          placeholder="Area"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          name="price"
          type="text"
          placeholder="Price"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <select
          name="delivery"
          onChange={handleChange}
          required
          className="w-full border p-2"
        >
          <option value="false">No Delivery</option>
          <option value="true">Delivery Available</option>
        </select>
        <input
          name="menu"
          type="text"
          placeholder="Menu (comma-separated)"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MessUpload;
