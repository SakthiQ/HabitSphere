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
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  // Global app state management
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userPreferences, setUserPreferences] = useState({
    location: 'New York', // Default location for weather
    workoutPreference: 'bodyweight', // Default workout type
    dietaryRestrictions: [], // User dietary preferences
    moodTrackingEnabled: true
  });

  // App initialization effect
  useEffect(() => {
    // Simulate app initialization and API warmup
    const initializeApp = async () => {
      try {
        // Load user preferences from localStorage if available
        const savedPreferences = localStorage.getItem('wellnessHubPreferences');
        if (savedPreferences) {
          setUserPreferences(JSON.parse(savedPreferences));
        }
        
        // Simulate initialization delay
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* App Header - Navigation and user controls */}
      <Header 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        userPreferences={userPreferences}
        onPreferencesChange={setUserPreferences}
      />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <Dashboard 
          currentSection={currentSection}
          userPreferences={userPreferences}
          onPreferencesChange={setUserPreferences}
        />
      </main>
      
      {/* Footer with app info */}
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