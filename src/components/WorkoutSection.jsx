/**
 * WorkoutSection.jsx - Fitness & Exercise Recommendations
 * 
 * Features:
 * - Exercise suggestions from ExerciseDB API
 * - Filter by body part, equipment, and difficulty
 * - Workout timer and tracking
 * - Exercise instruction display
 * - Personal workout history
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target, Clock, Zap } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const WorkoutSection = ({ workoutPreference = 'bodyweight' }) => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('chest');
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);

  // Body parts available for filtering
  const bodyParts = [
    { id: 'chest', label: 'Chest', emoji: '💪' },
    { id: 'back', label: 'Back', emoji: '🏋️' },
    { id: 'shoulders', label: 'Shoulders', emoji: '🤸‍♀️' },
    { id: 'legs', label: 'Legs', emoji: '🦵' },
    { id: 'arms', label: 'Arms', emoji: '💪' },
    { id: 'core', label: 'Core', emoji: '🎯' }
  ];

  // Mock exercise data (replace with real API in production)
  const mockExercises = {
    chest: [
      {
        id: 1,
        name: 'Push-ups',
        bodyPart: 'chest',
        equipment: 'body weight',
        instructions: [
          'Start in a plank position with arms extended',
          'Lower your body until chest nearly touches floor',
          'Push back up to starting position',
          'Keep your body straight throughout the movement'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/4ade80/ffffff?text=Push-ups',
        target: 'pectorals'
      },
      {
        id: 2,
        name: 'Chest Dips',
        bodyPart: 'chest',
        equipment: 'body weight',
        instructions: [
          'Position yourself between parallel bars',
          'Lower your body by bending your arms',
          'Push back up to starting position',
          'Keep slight forward lean for chest focus'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Chest+Dips',
        target: 'pectorals'
      }
    ],
    back: [
      {
        id: 3,
        name: 'Pull-ups',
        bodyPart: 'back',
        equipment: 'body weight',
        instructions: [
          'Hang from a pull-up bar with palms facing away',
          'Pull your body up until chin clears the bar',
          'Lower yourself back to starting position',
          'Keep core engaged throughout'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/f97316/ffffff?text=Pull-ups',
        target: 'lats'
      }
    ],
    shoulders: [
      {
        id: 4,
        name: 'Pike Push-ups',
        bodyPart: 'shoulders',
        equipment: 'body weight',
        instructions: [
          'Start in downward dog position',
          'Lower your head towards the ground',
          'Push back up to starting position',
          'Keep legs straight and core tight'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Pike+Push-ups',
        target: 'shoulders'
      }
    ],
    legs: [
      {
        id: 5,
        name: 'Squats',
        bodyPart: 'legs',
        equipment: 'body weight',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body as if sitting back into a chair',
          'Keep chest up and knees behind toes',
          'Push through heels to return to standing'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Squats',
        target: 'quadriceps'
      }
    ],
    arms: [
      {
        id: 6,
        name: 'Tricep Dips',
        bodyPart: 'arms',
        equipment: 'body weight',
        instructions: [
          'Sit on edge of chair or bench',
          'Place hands on edge beside your hips',
          'Slide off edge and lower your body',
          'Push back up to starting position'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Tricep+Dips',
        target: 'triceps'
      }
    ],
    core: [
      {
        id: 7,
        name: 'Plank',
        bodyPart: 'core',
        equipment: 'body weight',
        instructions: [
          'Start in push-up position',
          'Rest on forearms instead of hands',
          'Keep body straight from head to heels',
          'Hold position while breathing normally'
        ],
        gifUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Plank',
        target: 'abs'
      }
    ]
  };

  // Fetch exercises based on selected body part
  const fetchExercises = async (bodyPart) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, use real ExerciseDB API:
      // const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, {
      //   headers: {
      //     'X-RapidAPI-Key': 'YOUR_API_KEY',
      //     'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      //   }
      // });
      
      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const exerciseData = mockExercises[bodyPart] || [];
      
      setExercises(exerciseData);
      setCurrentExercise(exerciseData[0] || null);
    } catch (err) {
      setError('Unable to load exercises. Please try again.');
      console.error('Exercise fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchExercises(selectedBodyPart);
  }, [selectedBodyPart]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mark exercise as completed
  const completeExercise = (exercise) => {
    const completed = {
      ...exercise,
      completedAt: new Date().toISOString(),
      duration: workoutTimer
    };
    setCompletedExercises(prev => [...prev, completed]);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Fitness & Exercise</h2>
        <p className="text-gray-600">Get personalized workout recommendations</p>
      </div>

      {/* Workout Timer */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Workout Timer</h3>
              <p className="text-gray-600">Track your exercise session</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-gray-800">
              {formatTime(workoutTimer)}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-3 rounded-xl transition-colors ${
                  isTimerRunning 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  setWorkoutTimer(0);
                  setIsTimerRunning(false);
                }}
                className="p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body Part Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Target Muscle Group</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {bodyParts.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedBodyPart(part.id)}
              className={`p-4 rounded-xl text-center transition-colors ${
                selectedBodyPart === part.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white/20 text-gray-700 hover:bg-white/30'
              }`}
            >
              <div className="text-2xl mb-2">{part.emoji}</div>
              <div className="text-sm font-medium">{part.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading exercises...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">💪❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchExercises(selectedBodyPart)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : currentExercise ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exercise Image/GIF */}
            <div className="text-center">
              <img
                src={currentExercise.gifUrl}
                alt={currentExercise.name}
                className="w-full max-w-md mx-auto rounded-xl shadow-lg bg-gray-100"
              />
            </div>

            {/* Exercise Details */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-orange-500" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentExercise.name}
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600 bg-white/20 px-3 py-1 rounded-full">
                    🎯 {currentExercise.target}
                  </span>
                  <span className="text-sm font-medium text-gray-600 bg-white/20 px-3 py-1 rounded-full">
                    🏋️ {currentExercise.equipment}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
                  <ol className="space-y-2">
                    {currentExercise.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => completeExercise(currentExercise)}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-colors font-medium"
                >
                  ✅ Mark Complete
                </button>
                <button
                  onClick={() => {
                    const currentIndex = exercises.findIndex(ex => ex.id === currentExercise.id);
                    const nextIndex = (currentIndex + 1) % exercises.length;
                    setCurrentExercise(exercises[nextIndex]);
                  }}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors font-medium"
                >
                  ⏭️ Next Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Exercise List */}
      {exercises.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Available Exercises ({exercises.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setCurrentExercise(exercise)}
                className={`text-left p-4 rounded-xl transition-colors ${
                  currentExercise?.id === exercise.id
                    ? 'bg-orange-500/20 border border-orange-500/30'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-1">{exercise.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{exercise.target}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-gray-500">{exercise.equipment}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completed Exercises Today */}
      {completedExercises.length > 0 && (
        <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💪 Completed Today ({completedExercises.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedExercises.slice(-4).map((exercise, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-3">
                <div className="font-medium text-gray-800">{exercise.name}</div>
                <div className="text-xs text-gray-600">
                  Completed at {new Date(exercise.completedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSection;