// src/pages/MessList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MessList = () => {
  const [messes, setMesses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/messes")
      .then((res) => setMesses(res.data))
      .catch((err) => console.error("Error fetching messes:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Messes</h1>
      <div className="grid gap-4">
        {messes.map((mess) => (
          <div
            key={mess.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold">{mess.name}</h2>
            <p>
              <strong>Area:</strong> {mess.area}
            </p>
            <p>
              <strong>Price:</strong> ₹{mess.price}/month
            </p>
            <p>
              <strong>Delivery:</strong> {mess.delivery ? "Yes" : "No"}
            </p>
            <p>
              <strong>Menu:</strong> {mess.menu.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessList;
