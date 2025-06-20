import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            🍽️ Mess Finder
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Find and manage mess services in your area
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Mess Finder
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover delicious mess services, manage your business, or explore
            meal options in your neighborhood.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Login as Owner Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Mess Owner
              </h3>
              <p className="text-gray-600 mb-6">
                Manage your mess business, upload details, and connect with
                customers.
              </p>
              <Link
                to="/login"
                state={{ userType: "owner" }}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 inline-block text-center font-medium"
              >
                Login as Owner
              </Link>
            </div>
          </div>

          {/* Login as Admin Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Administrator
              </h3>
              <p className="text-gray-600 mb-6">
                Oversee platform operations, manage users, and maintain system
                quality.
              </p>
              <Link
                to="/login"
                state={{ userType: "admin" }}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block text-center font-medium"
              >
                Login as Admin
              </Link>
            </div>
          </div>

          {/* View Mess List Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👁️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Browse Messes
              </h3>
              <p className="text-gray-600 mb-6">
                Explore available mess services, view menus, and find your
                perfect meal plan.
              </p>
              <Link
                to="/messes"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 inline-block text-center font-medium"
              >
                View Mess List
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Why Choose Mess Finder?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🍳</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Find Nearby Mess
              </h4>
              <p className="text-gray-600 text-sm">
                Discover mess services with delicious, homemade-style meals
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Search Deliverable Options
              </h4>
              <p className="text-gray-600 text-sm">
                Many mess services offer convenient delivery to your location
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Make Your Own Choice
              </h4>
              <p className="text-gray-600 text-sm">
                Find budget-friendly meal options that fit your lifestyle
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2025 Mess Finder. Connecting you with great food.
          </p>
        </div>
      </footer>
    </div>
  );
}
