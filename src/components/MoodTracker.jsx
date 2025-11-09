/**
 * MoodTracker.jsx - Mood Tracking & Emotional Wellness
 * 
 * Features:
 * - Daily mood logging with emotional scale
 * - Journal prompts for reflection
 * - Mood analytics and trends
 * - Mindfulness and wellness tips
 * - Emotional well-being insights
 */

import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Heart, TrendingUp, Calendar, BookOpen } from 'lucide-react';

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showJournalModal, setShowJournalModal] = useState(false);

  // Mood options with emojis and values
  const moodOptions = [
    { id: 1, label: 'Terrible', emoji: '😢', color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 2, label: 'Bad', emoji: '😞', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { id: 3, label: 'Okay', emoji: '😐', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { id: 4, label: 'Good', emoji: '🙂', color: 'text-lime-500', bgColor: 'bg-lime-500' },
    { id: 5, label: 'Great', emoji: '😊', color: 'text-green-500', bgColor: 'bg-green-500' },
    { id: 6, label: 'Amazing', emoji: '😄', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
    { id: 7, label: 'Euphoric', emoji: '🤩', color: 'text-purple-500', bgColor: 'bg-purple-500' }
  ];

  // Journal prompts for reflection
  const journalPrompts = [
    "What made you smile today?",
    "What are three things you're grateful for right now?",
    "How did you handle stress today?",
    "What would you tell a friend who felt the way you do today?",
    "What small win can you celebrate today?",
    "What emotion dominated your day and why?",
    "How did you take care of yourself today?",
    "What challenge did you overcome today?",
    "What made you feel most peaceful today?",
    "How did you show kindness today?"
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('wellnessHub_moodHistory');
    const savedJournalEntries = localStorage.getItem('wellnessHub_journalEntries');
    
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory));
    }
    
    if (savedJournalEntries) {
      setJournalEntries(JSON.parse(savedJournalEntries));
    }

    // Set random prompt for the day
    const today = new Date().toDateString();
    const promptIndex = new Date().getDate() % journalPrompts.length;
    setCurrentPrompt(journalPrompts[promptIndex]);
  }, []);

  // Save mood entry
  const saveMoodEntry = (mood) => {
    const moodEntry = {
      id: Date.now(),
      mood: mood,
      date: new Date().toISOString(),
      dateString: new Date().toDateString()
    };

    // Check if mood already exists for today
    const today = new Date().toDateString();
    const updatedHistory = moodHistory.filter(entry => entry.dateString !== today);
    updatedHistory.push(moodEntry);
    
    setMoodHistory(updatedHistory);
    setCurrentMood(mood);
    localStorage.setItem('wellnessHub_moodHistory', JSON.stringify(updatedHistory));
  };

  // Save journal entry
  const saveJournalEntry = () => {
    if (journalEntry.trim() === '') return;

    const entry = {
      id: Date.now(),
      content: journalEntry,
      prompt: currentPrompt,
      date: new Date().toISOString(),
      dateString: new Date().toDateString(),
      mood: currentMood
    };

    const updatedEntries = [entry, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem('wellnessHub_journalEntries', JSON.stringify(updatedEntries));
    
    setJournalEntry('');
    setShowJournalModal(false);
  };

  // Get today's mood
  const getTodaysMood = () => {
    const today = new Date().toDateString();
    return moodHistory.find(entry => entry.dateString === today);
  };

  // Calculate mood statistics
  const getMoodStats = () => {
    if (moodHistory.length === 0) return { average: 0, trend: 'neutral' };

    const recentMoods = moodHistory.slice(-7); // Last 7 days
    const average = recentMoods.reduce((sum, entry) => sum + entry.mood.id, 0) / recentMoods.length;
    
    let trend = 'neutral';
    if (recentMoods.length > 1) {
      const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
      const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood.id, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood.id, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 0.5) trend = 'improving';
      else if (secondAvg < firstAvg - 0.5) trend = 'declining';
    }

    return { average: Math.round(average), trend };
  };

  const todaysMood = getTodaysMood();
  const moodStats = getMoodStats();

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Mood & Wellness Tracker</h2>
        <p className="text-gray-600">Track your emotional journey and practice mindfulness</p>
      </div>

      {/* Today's Mood Check-in */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
        <div className="text-center mb-6">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            How are you feeling today?
          </h3>
          {todaysMood ? (
            <div className="text-lg text-gray-600">
              You're feeling{' '}
              <span className={`font-semibold ${todaysMood.mood.color}`}>
                {todaysMood.mood.label.toLowerCase()} {todaysMood.mood.emoji}
              </span>
            </div>
          ) : (
            <p className="text-gray-600">Take a moment to check in with yourself</p>
          )}
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => saveMoodEntry(mood)}
              className={`p-4 rounded-2xl text-center transition-all duration-200 transform hover:scale-105 ${
                todaysMood?.mood.id === mood.id
                  ? `${mood.bgColor} text-white shadow-lg scale-105`
                  : 'bg-white/20 hover:bg-white/30 text-gray-700'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Weekly Average</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {moodStats.average > 0 ? moodOptions[moodStats.average - 1]?.emoji : '😐'}
            </div>
            <div className="text-sm text-gray-600">
              {moodStats.average > 0 ? moodOptions[moodStats.average - 1]?.label : 'No data yet'}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-green-500" />
            <h3 className="font-semibold text-gray-800">Tracking Days</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {moodHistory.length}
            </div>
            <div className="text-sm text-gray-600">Days logged</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Trend</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">
              {moodStats.trend === 'improving' ? '📈' : 
               moodStats.trend === 'declining' ? '📉' : '➡️'}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {moodStats.trend}
            </div>
          </div>
        </div>
      </div>

      {/* Journal Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-semibold text-gray-800">Reflection Journal</h3>
          </div>
          <button
            onClick={() => setShowJournalModal(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Write Entry
          </button>
        </div>

        {/* Today's Prompt */}
        <div className="bg-indigo-500/10 rounded-xl p-4 mb-6">
          <h4 className="font-medium text-indigo-800 mb-2">Today's Reflection Prompt:</h4>
          <p className="text-indigo-700 italic">"{currentPrompt}"</p>
        </div>

        {/* Recent Journal Entries */}
        {journalEntries.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Recent Entries</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {journalEntries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white/20 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    {entry.mood && (
                      <div className="text-sm">
                        {entry.mood.emoji} {entry.mood.label}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mood History Chart */}
      {moodHistory.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood History</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {moodHistory.slice(-7).map((entry, index) => (
              <div key={entry.id} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white ${entry.mood.bgColor}`}
                >
                  {entry.mood.emoji}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowJournalModal(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Journal Entry</h3>
              
              {/* Current Prompt */}
              <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                <p className="text-indigo-700 text-sm italic">"{currentPrompt}"</p>
              </div>
              
              {/* Text Area */}
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Share your thoughts and feelings..."
                className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveJournalEntry}
                  disabled={journalEntry.trim() === ''}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;