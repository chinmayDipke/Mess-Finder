import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MessDetail = () => {
  const { id } = useParams();
  const [mess, setMess] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/messes/${id}`)
      .then((response) => setMess(response.data))
      .catch((error) => console.error("Error fetching mess detail:", error));
  }, [id]);

  if (!mess) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{mess.name}</h2>
      <p className="mb-2">📍 Location: {mess.area}</p>
      <p className="mb-2">💸 Price: ₹{mess.price}/month</p>
      <p className="mb-2">🚚 Delivery: {mess.delivery ? "Yes" : "No"}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Menu:</h3>
        <ul className="list-disc ml-6">
          {mess.menu.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessDetail;
