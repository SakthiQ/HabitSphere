/**
 * App.jsx - Main Application Component
 * 
 * This is the root component that handles:
 * - Global state management for the wellness hub
 * - Route-like navigation between different sections
 * - Overall app layout and theme
 * - Initialization of API connections
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const navigate = useNavigate();

  // Redirect if no logged-in Google user found
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 🟢 Initialize Tawk.to live chat
  useEffect(() => {
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/6910aa371c1717195b8413a6/1j9khhr6l"; // ✅ your actual Tawk.to widget link
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  // Global app state management
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userPreferences, setUserPreferences] = useState({
    location: 'New York',
    workoutPreference: 'bodyweight',
    dietaryRestrictions: [],
    moodTrackingEnabled: true
  });

  // App initialization effect
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedPreferences = localStorage.getItem('wellnessHubPreferences');
        if (savedPreferences) {
          setUserPreferences(JSON.parse(savedPreferences));
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Save user preferences whenever they change
  useEffect(() => {
    localStorage.setItem('wellnessHubPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Loading screen component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <h2 className="mt-6 text-2xl font-semibold text-gray-700">
            Initializing Your Wellness Hub
          </h2>
          <p className="mt-2 text-gray-500">
            Setting up your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  const googleUser = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* App Header - Navigation and user controls */}
      <Header 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        userPreferences={userPreferences}
        onPreferencesChange={setUserPreferences}
      />

      {/* Display user info + logout */}
      {googleUser && (
        <div className="flex justify-end items-center px-8 py-2 gap-3">
          <img src={googleUser.picture} alt="user" className="w-8 h-8 rounded-full" />
          <span className="font-medium">{googleUser.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <Dashboard 
          currentSection={currentSection}
          userPreferences={userPreferences}
          onPreferencesChange={setUserPreferences}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white/20 backdrop-blur-sm border-t border-white/20 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Your Personal Wellness & Productivity Hub</p>
          <p className="text-sm mt-1">Powered by multiple wellness APIs</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
