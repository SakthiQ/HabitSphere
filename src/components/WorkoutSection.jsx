/**
 * WorkoutSection.jsx - Personalized Fitness & Exercise Recommendations (Mark Complete Highlight)
 */

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Target, Clock, Zap } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const WorkoutSection = ({ workoutPreference = "bodyweight" }) => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState("chest");
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [answers, setAnswers] = useState({
    goal: "",
    experience: "",
    equipment: "",
    duration: "",
    focus: "",
  });

  const bodyParts = [
    { id: "chest", label: "Chest", emoji: "💪" },
    { id: "back", label: "Back", emoji: "🏋️" },
    { id: "shoulders", label: "Shoulders", emoji: "🤸‍♀️" },
    { id: "legs", label: "Legs", emoji: "🦵" },
    { id: "arms", label: "Arms", emoji: "💪" },
    { id: "core", label: "Core", emoji: "🎯" },
  ];

  // ✅ Fetch exercises (API + fallback)
  const fetchExercises = async (bodyPart) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();

      let formatted = data.map((ex) => ({
        id: ex.id,
        name: ex.name,
        bodyPart: ex.bodyPart,
        equipment: ex.equipment,
        gifUrl: ex.gifUrl,
        target: ex.target,
        instructions: [
          "Get into proper starting position.",
          "Perform the movement as intended.",
          "Keep steady breathing and good posture.",
          "Repeat for desired reps.",
        ],
      }));

      if (userProfile) {
        if (userProfile.equipment === "bodyweight") {
          formatted = formatted.filter((ex) =>
            ex.equipment.toLowerCase().includes("body")
          );
        } else if (userProfile.equipment === "dumbbells") {
          formatted = formatted.filter((ex) =>
            ex.equipment.toLowerCase().includes("dumbbell")
          );
        }

        if (userProfile.focus === "core") {
          formatted = formatted.filter(
            (ex) => ex.bodyPart === "waist" || ex.target.includes("abs")
          );
        } else if (userProfile.focus === "upper body") {
          formatted = formatted.filter((ex) =>
            ["chest", "back", "shoulders", "upper arms"].includes(
              ex.bodyPart.toLowerCase()
            )
          );
        } else if (userProfile.focus === "lower body") {
          formatted = formatted.filter((ex) =>
            ["upper legs", "lower legs", "glutes"].includes(
              ex.bodyPart.toLowerCase()
            )
          );
        }

        let limit = 6;
        if (userProfile.duration.includes("10")) limit = 3;
        else if (userProfile.duration.includes("20")) limit = 5;
        else if (userProfile.duration.includes("30")) limit = 8;
        formatted = formatted.slice(0, limit);
      }

      setExercises(formatted);
      setCurrentExercise(formatted[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) fetchExercises(selectedBodyPart);
  }, [selectedBodyPart, userProfile]);

  // ⏱️ Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning)
      interval = setInterval(() => setWorkoutTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  // ✅ Mark exercise complete → highlight in available section
  const markExerciseComplete = (exercise) => {
    if (!completedExercises.includes(exercise.id)) {
      setCompletedExercises((prev) => [...prev, exercise.id]);
    }
  };

  if (!userProfile) {
    return (
      <div className="p-6 space-y-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Let's Personalize Your Workout 💪
        </h2>
        <p className="text-gray-600">
          Answer a few quick questions to tailor your workout plan
        </p>

        <div className="max-w-lg mx-auto text-left space-y-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
          {[
            {
              label: "🏆 Your Goal",
              key: "goal",
              options: ["Fat Loss", "Strength", "Endurance", "Flexibility"],
            },
            {
              label: "⚡ Experience Level",
              key: "experience",
              options: ["Beginner", "Intermediate", "Advanced"],
            },
            {
              label: "🏋️ Equipment Available",
              key: "equipment",
              options: ["Bodyweight", "Dumbbells", "Machines"],
            },
            {
              label: "🕒 Duration (Daily)",
              key: "duration",
              options: ["10 min", "20 min", "30+ min"],
            },
            {
              label: "🎯 Focus Area",
              key: "focus",
              options: ["Full Body", "Upper Body", "Lower Body", "Core"],
            },
          ].map((q) => (
            <div key={q.key}>
              <label className="block font-medium mb-1">{q.label}</label>
              <select
                className="w-full p-2 rounded-lg bg-white/30"
                onChange={(e) =>
                  setAnswers({ ...answers, [q.key]: e.target.value.toLowerCase() })
                }
              >
                <option value="">Select</option>
                {q.options.map((o) => (
                  <option key={o} value={o.toLowerCase()}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            onClick={() => {
              if (Object.values(answers).some((a) => !a)) {
                alert("Please answer all questions!");
                return;
              }
              setUserProfile(answers);
              setTimeout(() => fetchExercises(selectedBodyPart), 500);
            }}
          >
            Generate My Workout 💥
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Personalized Workout Plan 💥
        </h2>
        <p className="text-gray-600">Based on your preferences and goals</p>
      </div>

      {/* Timer */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Workout Timer
              </h3>
              <p className="text-gray-600">Track your session</p>
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
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isTimerRunning ? <Pause /> : <Play />}
              </button>
              <button
                onClick={() => {
                  setWorkoutTimer(0);
                  setIsTimerRunning(false);
                }}
                className="p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                <RotateCcw />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Centered Exercise Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading exercises...</p>
        </div>
      ) : currentExercise ? (
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl w-full text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-orange-500" />
                <h3 className="text-2xl font-bold text-gray-800 capitalize">
                  {currentExercise.name}
                </h3>
              </div>

              <div className="flex flex-wrap justify-center space-x-2">
                <span className="text-sm font-medium text-gray-600 bg-white/20 px-3 py-1 rounded-full">
                  🎯 {currentExercise.target}
                </span>
                <span className="text-sm font-medium text-gray-600 bg-white/20 px-3 py-1 rounded-full">
                  🏋️ {currentExercise.equipment}
                </span>
              </div>

              <div className="text-left w-full max-w-lg mx-auto mt-4">
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

              <div className="flex space-x-3 justify-center w-full pt-4">
                <button
                  onClick={() => markExerciseComplete(currentExercise)}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-colors font-medium max-w-xs"
                >
                  ✅ Mark Complete
                </button>
                <button
                  onClick={() => {
                    const i = exercises.findIndex(
                      (ex) => ex.id === currentExercise.id
                    );
                    const next = (i + 1) % exercises.length;
                    setCurrentExercise(exercises[next]);
                  }}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors font-medium max-w-xs"
                >
                  ⏭️ Next Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">
          No exercises found for your preferences.
        </p>
      )}

      {/* ✅ Available Exercises Section */}
      {exercises.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Available Workouts ({exercises.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => {
              const isCompleted = completedExercises.includes(exercise.id);
              return (
                <button
                  key={exercise.id}
                  onClick={() => setCurrentExercise(exercise)}
                  className={`text-left p-4 rounded-xl transition-all duration-200 ${
                    isCompleted
                      ? "bg-green-500/20 border border-green-500/50 shadow-md"
                      : currentExercise?.id === exercise.id
                      ? "bg-orange-500/20 border border-orange-500/30 shadow-md"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <h4 className="font-semibold text-gray-800 mb-1 capitalize">
                    {exercise.name}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {exercise.target}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Zap
                      className={`w-4 h-4 ${
                        isCompleted ? "text-green-500" : "text-orange-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isCompleted ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {exercise.equipment}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSection;
