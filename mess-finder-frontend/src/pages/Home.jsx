import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to Mess Finder</h1>
      <p>Find messes based on your area and budget!</p>
      <Link to="/messes" className="text-blue-600 underline">
        View Messes
      </Link>
    </div>
  );
};

export default Home;
