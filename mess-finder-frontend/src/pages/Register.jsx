// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "owner", // can also be "admin"
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Register </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />{" "}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="owner">Mess Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default Register;
