// src/pages/OwnerDashboard.jsx
function OwnerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Mess Owner Dashboard</h1>
      <p className="mt-4 text-gray-700">
        You can add or update your mess info here.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default OwnerDashboard;
