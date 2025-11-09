/**
 * TodoSection.jsx - Productivity & Task Management
 * 
 * Features:
 * - Task creation and management
 * - Priority levels and categories
 * - Habit tracking with streaks
 * - Productivity insights and analytics
 * - Goal setting and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Star, Target, TrendingUp, Calendar } from 'lucide-react';

const TodoSection = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');
  const [activeTab, setActiveTab] = useState('tasks');
  const [completedToday, setCompletedToday] = useState(0);

  // Priority levels
  const priorities = [
    { id: 'low', label: 'Low', color: 'text-gray-500', bgColor: 'bg-gray-100' },
    { id: 'medium', label: 'Medium', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { id: 'high', label: 'High', color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { id: 'urgent', label: 'Urgent', color: 'text-red-500', bgColor: 'bg-red-100' }
  ];

  // Task categories
  const categories = [
    { id: 'personal', label: 'Personal', emoji: '👤', color: 'text-purple-500' },
    { id: 'work', label: 'Work', emoji: '💼', color: 'text-blue-500' },
    { id: 'health', label: 'Health', emoji: '🏥', color: 'text-green-500' },
    { id: 'learning', label: 'Learning', emoji: '📚', color: 'text-orange-500' },
    { id: 'social', label: 'Social', emoji: '👥', color: 'text-pink-500' }
  ];

  // Default habits
  const defaultHabits = [
    { id: 1, name: 'Drink 8 glasses of water', category: 'health', streak: 0, completed: false },
    { id: 2, name: 'Exercise for 30 minutes', category: 'health', streak: 0, completed: false },
    { id: 3, name: 'Read for 20 minutes', category: 'learning', streak: 0, completed: false },
    { id: 4, name: 'Practice gratitude', category: 'personal', streak: 0, completed: false },
    { id: 5, name: 'Meditate for 10 minutes', category: 'personal', streak: 0, completed: false }
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('wellnessHub_tasks');
    const savedHabits = localStorage.getItem('wellnessHub_habits');
    const savedCompleted = localStorage.getItem('wellnessHub_completedToday');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Initialize with default habits
      setHabits(defaultHabits);
      localStorage.setItem('wellnessHub_habits', JSON.stringify(defaultHabits));
    }

    if (savedCompleted) {
      const data = JSON.parse(savedCompleted);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCompletedToday(data.count);
      } else {
        setCompletedToday(0);
        localStorage.setItem('wellnessHub_completedToday', JSON.stringify({ date: today, count: 0 }));
      }
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('wellnessHub_tasks', JSON.stringify(updatedTasks));
  };

  // Save habits to localStorage
  const saveHabits = (updatedHabits) => {
    setHabits(updatedHabits);
    localStorage.setItem('wellnessHub_habits', JSON.stringify(updatedHabits));
  };

  // Add new task
  const addTask = () => {
    if (newTaskText.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      priority: newTaskPriority,
      category: newTaskCategory,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    saveTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null
        };
        
        // Update daily completion count
        if (!task.completed) {
          const newCount = completedToday + 1;
          setCompletedToday(newCount);
          const today = new Date().toDateString();
          localStorage.setItem('wellnessHub_completedToday', JSON.stringify({ date: today, count: newCount }));
        }
        
        return updatedTask;
      }
      return task;
    });
    
    saveTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  // Toggle habit completion
  const toggleHabit = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completed;
        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  // Get priority object
  const getPriority = (priorityId) => {
    return priorities.find(p => p.id === priorityId) || priorities[1];
  };

  // Get category object
  const getCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  // Calculate productivity stats
  const getProductivityStats = () => {
    const today = new Date().toDateString();
    const todaysTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === today
    );
    const completedTasks = todaysTasks.filter(task => task.completed);
    const completedHabits = habits.filter(habit => habit.completed);
    
    return {
      totalTasks: todaysTasks.length,
      completedTasks: completedTasks.length,
      completedHabits: completedHabits.length,
      totalHabits: habits.length,
      completionRate: todaysTasks.length > 0 ? Math.round((completedTasks.length / todaysTasks.length) * 100) : 0
    };
  };

  const productivityStats = getProductivityStats();

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Productivity Hub</h2>
        <p className="text-gray-600">Manage tasks, build habits, and track your progress</p>
      </div>

      {/* Productivity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Tasks Done</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {productivityStats.completedTasks}/{productivityStats.totalTasks}
          </div>
          <div className="text-sm text-gray-600">Today</div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-6 h-6 text-green-500" />
            <h3 className="font-semibold text-gray-800">Habits</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {productivityStats.completedHabits}/{productivityStats.totalHabits}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Success Rate</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {productivityStats.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Today</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Streak</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {Math.max(...habits.map(h => h.streak), 0)}
          </div>
          <div className="text-sm text-gray-600">Days</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-white/20 text-gray-800 shadow-sm'
              : 'text-gray-600 hover:bg-white/10'
          }`}
        >
          📋 Tasks
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-colors ${
            activeTab === 'habits'
              ? 'bg-white/20 text-gray-800 shadow-sm'
              : 'text-gray-600 hover:bg-white/10'
          }`}
        >
          🎯 Habits
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Add New Task */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.label} Priority
                    </option>
                  ))}
                </select>
                
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.emoji} {category.label}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={addTask}
                  disabled={newTaskText.trim() === ''}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tasks ({tasks.filter(t => !t.completed).length} active)
            </h3>
            
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600">No tasks yet. Add your first task above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Active Tasks */}
                {tasks.filter(task => !task.completed).map(task => {
                  const priority = getPriority(task.priority);
                  const category = getCategory(task.category);
                  
                  return (
                    <div
                      key={task.id}
                      className="flex items-center space-x-4 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <Circle className="w-6 h-6" />
                      </button>
                      
                      <div className="flex-1">
                        <div className="text-gray-800 font-medium">{task.text}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${priority.bgColor} ${priority.color}`}>
                            {priority.label}
                          </span>
                          <span className={`text-xs ${category.color}`}>
                            {category.emoji} {category.label}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}

                {/* Completed Tasks */}
                {tasks.filter(task => task.completed).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Completed ({tasks.filter(task => task.completed).length})
                    </h4>
                    {tasks.filter(task => task.completed).map(task => {
                      const category = getCategory(task.category);
                      
                      return (
                        <div
                          key={task.id}
                          className="flex items-center space-x-4 p-3 bg-green-50/50 rounded-lg opacity-75"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <div className="flex-1">
                            <div className="text-gray-600 line-through">{task.text}</div>
                            <div className="text-xs text-gray-500">
                              {category.emoji} {category.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Habits Tab */}
      {activeTab === 'habits' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Habits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map(habit => {
              const category = getCategory(habit.category);
              
              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    habit.completed
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`transition-colors ${
                          habit.completed
                            ? 'text-green-500'
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                      >
                        {habit.completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                      <span className={`font-medium ${
                        habit.completed ? 'text-green-700' : 'text-gray-800'
                      }`}>
                        {habit.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {habit.streak}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${category.color}`}>
                      {category.emoji} {category.label}
                    </span>
                    <span className="text-gray-500">
                      {habit.streak} day streak
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoSection;