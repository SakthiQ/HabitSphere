/**
 * Dashboard.jsx - Main Dashboard Component
 * 
 * This component:
 * - Manages the main content area routing
 * - Renders different sections based on current selection
 * - Provides the main dashboard view with all widgets
 * - Handles section-specific state management
 */

import React from 'react';
import QuoteSection from './QuoteSection';
import WeatherSection from './WeatherSection';
import WorkoutSection from './WorkoutSection';
import MealSection from './MealSection';
import MoodTracker from './MoodTracker';
import TodoSection from './TodoSection';

const Dashboard = ({ currentSection, userPreferences, onPreferencesChange }) => {

  // Main dashboard view with all widgets
  const DashboardOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Your Wellness Hub
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personalized dashboard for health, productivity, and daily inspiration. 
          Everything you need to stay motivated and organized in one beautiful place.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="text-center">
            <div className="text-3xl mb-2">💫</div>
            <h3 className="font-semibold text-gray-800">Daily Inspiration</h3>
            <p className="text-sm text-gray-600 mt-1">Motivational quotes</p>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="text-center">
            <div className="text-3xl mb-2">🌤️</div>
            <h3 className="font-semibold text-gray-800">Weather Insights</h3>
            <p className="text-sm text-gray-600 mt-1">Activity recommendations</p>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="text-center">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="font-semibold text-gray-800">Fitness Tracker</h3>
            <p className="text-sm text-gray-600 mt-1">Workout suggestions</p>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="text-center">
            <div className="text-3xl mb-2">😊</div>
            <h3 className="font-semibold text-gray-800">Mood Tracking</h3>
            <p className="text-sm text-gray-600 mt-1">Emotional wellness</p>
          </div>
        </div>
      </div>

      {/* Featured Sections Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mini Quote Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <QuoteSection isPreview={true} />
        </div>
        
        {/* Mini Weather Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <WeatherSection 
            isPreview={true} 
            location={userPreferences.location}
          />
        </div>
      </div>
    </div>
  );

  // Section router - determines which component to render
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'quotes':
        return <QuoteSection />;
      case 'weather':
        return <WeatherSection location={userPreferences.location} />;
      case 'workout':
        return <WorkoutSection workoutPreference={userPreferences.workoutPreference} />;
      case 'meals':
        return <MealSection dietaryRestrictions={userPreferences.dietaryRestrictions} />;
      case 'mood':
        return <MoodTracker />;
      case 'todos':
        return <TodoSection />;
      case 'dashboard':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {renderCurrentSection()}
    </div>
  );
};

export default Dashboard;