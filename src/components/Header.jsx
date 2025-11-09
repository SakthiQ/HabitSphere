/**
 * Header.jsx - Application Header Component
 * 
 * Handles:
 * - App branding and logo
 * - Navigation between different sections
 * - User preferences quick access
 * - Responsive mobile navigation
 */

import React, { useState } from 'react';
import { Heart, Menu, Settings, X } from 'lucide-react';

const Header = ({ currentSection, onSectionChange, userPreferences, onPreferencesChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Navigation items for the header
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'quotes', label: 'Inspiration', icon: '💫' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'workout', label: 'Fitness', icon: '💪' },
    { id: 'meals', label: 'Nutrition', icon: '🥗' },
    { id: 'mood', label: 'Mood', icon: '😊' },
    { id: 'todos', label: 'Tasks', icon: '✅' }
  ];

  return (
    <>
      {/* Main Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">WellnessHub</h1>
                <p className="text-xs text-gray-500">Your Daily Companion</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentSection === item.id
                      ? 'bg-white/20 text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              {/* Settings Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-6 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors flex items-center space-x-3 ${
                    currentSection === item.id
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Settings Modal - Simple version for demo */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-96 max-w-[90vw]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Location
                  </label>
                  <input
                    type="text"
                    value={userPreferences.location}
                    onChange={(e) => onPreferencesChange({
                      ...userPreferences,
                      location: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your city"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  More settings coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;