import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users, Zap, Search, BookOpen, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

const SimpleLoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

const MealSection = ({ dietaryRestrictions = [] }) => {
  // ============= STATE =============
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('healthy');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [userFoodInput, setUserFoodInput] = useState('');
  const [isProcessingFood, setIsProcessingFood] = useState(false);
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });

  const [healthInsights, setHealthInsights] = useState(null);

  // ============= CONSTANTS =============
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', emoji: '🥞' },
    { id: 'lunch', label: 'Lunch', emoji: '🥗' },
    { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
    { id: 'snack', label: 'Snacks', emoji: '🥜' }
  ];

  const DAILY_RECOMMENDATIONS = {
    calories: { min: 1800, max: 2200, unit: 'kcal' },
    protein: { min: 50, max: 100, unit: 'g' },
    carbs: { min: 225, max: 325, unit: 'g' },
    fat: { min: 44, max: 78, unit: 'g' },
    fiber: { min: 25, max: 38, unit: 'g' },
    sugar: { max: 50, unit: 'g' },
    sodium: { max: 2300, unit: 'mg' }
  };

  // ============= MOCK RECIPES =============
  const mockRecipes = {
    breakfast: [
      {
        id: 1,
        label: 'Avocado Toast with Eggs',
        image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Healthy Meals',
        yield: 2,
        dietLabels: ['High-Fiber', 'Vegetarian'],
        healthLabels: ['Vegetarian', 'Gluten-Free-Option'],
        totalTime: 15,
        calories: 320,
        totalNutrients: {
          ENERC_KCAL: { quantity: 320, unit: 'kcal' },
          PROCNT: { quantity: 18, unit: 'g' },
          CHOCDF: { quantity: 25, unit: 'g' },
          FAT: { quantity: 20, unit: 'g' },
          FIBTG: { quantity: 8, unit: 'g' },
          SUGAR: { quantity: 2, unit: 'g' },
          NA: { quantity: 400, unit: 'mg' }
        },
        ingredients: [
          { text: '2 slices whole grain bread' },
          { text: '1 ripe avocado' },
          { text: '2 eggs' },
          { text: 'Salt and pepper to taste' },
        ]
      },
      {
        id: 2,
        label: 'Greek Yogurt Berry Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Nutrition Plus',
        yield: 1,
        dietLabels: ['High-Protein', 'Low-Fat'],
        healthLabels: ['Vegetarian', 'Gluten-Free'],
        totalTime: 5,
        calories: 280,
        totalNutrients: {
          ENERC_KCAL: { quantity: 280, unit: 'kcal' },
          PROCNT: { quantity: 20, unit: 'g' },
          CHOCDF: { quantity: 35, unit: 'g' },
          FAT: { quantity: 8, unit: 'g' },
          FIBTG: { quantity: 5, unit: 'g' },
          SUGAR: { quantity: 15, unit: 'g' },
          NA: { quantity: 50, unit: 'mg' }
        },
        ingredients: [
          { text: '1 cup Greek yogurt' },
          { text: '1/2 cup mixed berries' },
          { text: '2 tbsp granola' },
          { text: '1 tbsp honey' },
        ]
      }
    ],
    lunch: [
      {
        id: 3,
        label: 'Quinoa Buddha Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Plant Based',
        yield: 2,
        dietLabels: ['High-Fiber', 'Vegan'],
        healthLabels: ['Vegan', 'Gluten-Free'],
        totalTime: 30,
        calories: 420,
        totalNutrients: {
          ENERC_KCAL: { quantity: 420, unit: 'kcal' },
          PROCNT: { quantity: 15, unit: 'g' },
          CHOCDF: { quantity: 65, unit: 'g' },
          FAT: { quantity: 12, unit: 'g' },
          FIBTG: { quantity: 12, unit: 'g' },
          SUGAR: { quantity: 5, unit: 'g' },
          NA: { quantity: 300, unit: 'mg' }
        },
        ingredients: [
          { text: '1 cup cooked quinoa' },
          { text: '1 cup roasted vegetables' },
          { text: '1/2 avocado' },
          { text: '2 tbsp hummus' },
        ]
      }
    ],
    dinner: [
      {
        id: 4,
        label: 'Grilled Salmon with Vegetables',
        image: 'https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Healthy Kitchen',
        yield: 2,
        dietLabels: ['High-Protein', 'Low-Carb'],
        healthLabels: ['Pescatarian', 'Gluten-Free', 'Dairy-Free'],
        totalTime: 25,
        calories: 380,
        totalNutrients: {
          ENERC_KCAL: { quantity: 380, unit: 'kcal' },
          PROCNT: { quantity: 35, unit: 'g' },
          CHOCDF: { quantity: 15, unit: 'g' },
          FAT: { quantity: 22, unit: 'g' },
          FIBTG: { quantity: 3, unit: 'g' },
          SUGAR: { quantity: 1, unit: 'g' },
          NA: { quantity: 600, unit: 'mg' }
        },
        ingredients: [
          { text: '6 oz salmon fillet' },
          { text: '2 cups mixed vegetables' },
          { text: '1 tbsp olive oil' },
          { text: 'Herbs and spices' },
        ]
      }
    ],
    snack: [
      {
        id: 5,
        label: 'Energy Balls',
        image: 'https://images.pexels.com/photos/1435740/pexels-photo-1435740.jpeg?auto=compress&cs=tinysrgb&w=400',
        source: 'Snack Time',
        yield: 12,
        dietLabels: ['High-Fiber', 'Vegan'],
        healthLabels: ['Vegan', 'Gluten-Free'],
        totalTime: 15,
        calories: 95,
        totalNutrients: {
          ENERC_KCAL: { quantity: 95, unit: 'kcal' },
          PROCNT: { quantity: 3, unit: 'g' },
          CHOCDF: { quantity: 12, unit: 'g' },
          FAT: { quantity: 5, unit: 'g' },
          FIBTG: { quantity: 2, unit: 'g' },
          SUGAR: { quantity: 8, unit: 'g' },
          NA: { quantity: 10, unit: 'mg' }
        },
        ingredients: [
          { text: '1 cup dates, pitted' },
          { text: '1/2 cup almonds' },
          { text: '2 tbsp chia seeds' },
          { text: '1 tbsp cocoa powder' },
        ]
      }
    ]
  };

  // ============= EFFECTS =============
  useEffect(() => {
    const saved = localStorage.getItem('wellnessHub_favoriteRecipes');
    if (saved) setFavoriteRecipes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setCurrentRecipe(mockRecipes[selectedMealType]?.[0] || null);
    setRecipes(mockRecipes[selectedMealType] || []);
  }, [selectedMealType]);

  useEffect(() => {
    setHealthInsights(analyzeHealthInsights());
    localStorage.setItem('wellnessHub_dailyNutrition', JSON.stringify(dailyNutrition));
  }, [dailyNutrition]);

  // ============= API FUNCTIONS =============
  const parseFoodInput = (input) => {
    return input
      .split(/,|and|&/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

 const searchFood = async (foodName) => {
  try {
    console.log('🔍 Searching for:', foodName);
    
    const response = await fetch('http://localhost:5000/api/fatsecret/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: foodName })
    });

    if (!response.ok) {
      console.error('Search failed:', response.status);
      throw new Error('Search failed');
    }

    const data = await response.json();
    
    // ✅ DETAILED DEBUGGING
    console.log('\n📊 Full response:', JSON.stringify(data, null, 2));
    console.log('\n📊 Response keys:', Object.keys(data));
    console.log('📊 data.foods:', data.foods);
    console.log('📊 data.foods.food:', data.foods?.food);
    console.log('📊 Is array?:', Array.isArray(data.foods?.food));
    
    let foodArray = [];
    if (Array.isArray(data.foods?.food)) {
      foodArray = data.foods.food;
      console.log('✅ Found array at: data.foods.food, length:', foodArray.length);
    } else if (Array.isArray(data.foods)) {
      foodArray = data.foods;
      console.log('✅ Found array at: data.foods');
    } else if (Array.isArray(data)) {
      foodArray = data;
      console.log('✅ Found array at: data');
    } else {
      console.error('❌ No array found in response!');
      console.log('📊 What we got:', typeof data, data);
    }
    
    console.log('\n🔍 Returning', foodArray.length, 'foods');
    
    if (foodArray.length > 0) {
      console.log('✅ First food item:', foodArray);
      console.log('   - food_name:', foodArray.food_name);
      console.log('   - food_id:', foodArray.food_id);
    }
    
    return foodArray;
  } catch (err) {
    console.error('❌ Search error:', err);
    return [];
  }
};


  const getFoodDetails = async (foodId) => {
    try {
      console.log('📋 Getting details for food ID:', foodId);
      
      const response = await fetch('http://localhost:5000/api/fatsecret/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food_id: foodId })
      });

      if (!response.ok) {
        console.error('Food details failed:', response.status);
        throw new Error('Failed to get food details');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('❌ Food details error:', err);
      return null;
    }
  };

  // ============= HELPER FUNCTIONS =============
  const analyzeHealthInsights = () => {
    const insights = {
      overall: 'good',
      warnings: [],
      recommendations: [],
      risks: []
    };

    if (dailyNutrition.calories > DAILY_RECOMMENDATIONS.calories.max * 1.2) {
      insights.warnings.push('High calorie intake may lead to weight gain');
      insights.risks.push('obesity');
      insights.overall = 'caution';
    }
    if (dailyNutrition.protein > DAILY_RECOMMENDATIONS.protein.max) {
      insights.warnings.push('High protein in your body u will die');
      insights.risks.push('Death');
      insights.overall = 'caution';
    }
    if (dailyNutrition.sugar > DAILY_RECOMMENDATIONS.sugar.max) {
      insights.warnings.push('Excessive sugar consumption');
      insights.risks.push('diabetes');
      insights.recommendations.push('Reduce sugary foods and beverages');
      insights.overall = 'caution';
    }

    if (dailyNutrition.sodium > DAILY_RECOMMENDATIONS.sodium.max) {
      insights.warnings.push('High sodium intake');
      insights.risks.push('hypertension');
      insights.recommendations.push('Limit processed foods and added salt');
      insights.overall = 'warning';
    }

    if (insights.warnings.length === 0 && dailyNutrition.calories > 0) {
      insights.recommendations.push('Great job! Your nutrition is well-balanced');
      insights.overall = 'excellent';
    }

    return insights;
  };

  const getNutritionStatus = (value, nutrient) => {
    const rec = DAILY_RECOMMENDATIONS[nutrient];
    if (!rec) return 'normal';
    if (rec.max && value > rec.max) return 'high';
    if (rec.min && value < rec.min) return 'low';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'text-red-500';
      case 'low': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const toggleFavorite = (recipe) => {
    const isAlreadyFavorite = favoriteRecipes.some(fav => fav.id === recipe.id);
    const updatedFavorites = isAlreadyFavorite
      ? favoriteRecipes.filter(fav => fav.id !== recipe.id)
      : [...favoriteRecipes, recipe];
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('wellnessHub_favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  const addToNutrition = (recipe) => {
    const perServing = {
      calories: Math.round(recipe.calories / recipe.yield),
      protein: Math.round(recipe.totalNutrients.PROCNT.quantity / recipe.yield),
      carbs: Math.round(recipe.totalNutrients.CHOCDF.quantity / recipe.yield),
      fat: Math.round(recipe.totalNutrients.FAT.quantity / recipe.yield),
      fiber: Math.round(recipe.totalNutrients.FIBTG?.quantity / recipe.yield || 0),
      sugar: Math.round(recipe.totalNutrients.SUGAR?.quantity / recipe.yield || 0),
      sodium: Math.round(recipe.totalNutrients.NA?.quantity / recipe.yield || 0)
    };

    setDailyNutrition(prev => ({
      calories: prev.calories + perServing.calories,
      protein: prev.protein + perServing.protein,
      carbs: prev.carbs + perServing.carbs,
      fat: prev.fat + perServing.fat,
      fiber: prev.fiber + perServing.fiber,
      sugar: prev.sugar + perServing.sugar,
      sodium: prev.sodium + perServing.sodium
    }));
  };

  // ============= MAIN HANDLER =============
  const handleLogFood = async () => {
    if (!userFoodInput.trim()) return;

    setIsProcessingFood(true);
    setError(null);

    try {
      const foodNames = parseFoodInput(userFoodInput);
      console.log('📝 Parsed foods:', foodNames);

      const newFoods = [];

      for (const foodName of foodNames) {
        console.log('\n🔄 Processing:', foodName);
        
        const searchResults = await searchFood(foodName);
        console.log('Found', searchResults.length, 'results');
        
        if (!searchResults || searchResults.length === 0) {
          console.warn('⚠️ No results for:', foodName);
          continue;
        }

        const firstFood = searchResults[0]; 
        console.log('✅ Selected food:', firstFood.food_name, 'ID:', firstFood.food_id);
        
        if (!firstFood.food_id) {
          console.warn('⚠️ No food ID');
          continue;
        }
        
        const foodDetails = await getFoodDetails(firstFood.food_id);
        
        if (!foodDetails || !foodDetails.food || !foodDetails.food.servings) {
          console.warn('⚠️ No servings data');
          continue;
        }

        const serving = Array.isArray(foodDetails.food.servings.serving)
          ? foodDetails.food.servings.serving[0]
          : foodDetails.food.servings.serving;

        if (!serving) {
          console.warn('⚠️ No serving object');
          continue;
        }

        console.log('📊 Serving:', serving);

        newFoods.push({
          id: Date.now() + Math.random(),
          food_id: firstFood.food_id,
          food_name: firstFood.food_name,
          food_brand: firstFood.food_brand || '',
          serving_description: serving.serving_description || '1 serving',
          nutrition: {
            calories: parseFloat(serving.calories || 0),
            protein: parseFloat(serving.protein || 0),
            carbs: parseFloat(serving.carbohydrate || 0),
            fat: parseFloat(serving.fat || 0),
            fiber: parseFloat(serving.fiber || 0),
            sugar: parseFloat(serving.sugar || 0),
            sodium: parseFloat(serving.sodium || 0)
          }
        });
      }

      if (newFoods.length === 0) {
        setError('❌ No foods found. Try: "egg", "apple", "coffee"');
        setIsProcessingFood(false);
        return;
      }

      let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      };

      newFoods.forEach(food => {
        totalNutrition.calories += food.nutrition.calories || 0;
        totalNutrition.protein += food.nutrition.protein || 0;
        totalNutrition.carbs += food.nutrition.carbs || 0;
        totalNutrition.fat += food.nutrition.fat || 0;
        totalNutrition.fiber += food.nutrition.fiber || 0;
        totalNutrition.sugar += food.nutrition.sugar || 0;
        totalNutrition.sodium += food.nutrition.sodium || 0;
      });

      console.log('📊 Total nutrition:', totalNutrition);

      setLoggedFoods(prev => [...prev, ...newFoods]);
      
      setDailyNutrition(prev => ({
        calories: prev.calories + totalNutrition.calories,
        protein: prev.protein + totalNutrition.protein,
        carbs: prev.carbs + totalNutrition.carbs,
        fat: prev.fat + totalNutrition.fat,
        fiber: prev.fiber + totalNutrition.fiber,
        sugar: prev.sugar + totalNutrition.sugar,
        sodium: prev.sodium + totalNutrition.sodium
      }));

      setUserFoodInput('');
      console.log('✅ Successfully logged', newFoods.length, 'foods');
    } catch (err) {
      console.error('❌ Error logging food:', err);
      setError('Failed to log food. Check console for details.');
    } finally {
      setIsProcessingFood(false);
    }
  };

  const removeLoggedFood = (foodId) => {
    const foodToRemove = loggedFoods.find(f => f.id === foodId);
    if (!foodToRemove) return;

    setLoggedFoods(prev => prev.filter(f => f.id !== foodId));
    setDailyNutrition(prev => ({
      calories: Math.max(0, prev.calories - foodToRemove.nutrition.calories),
      protein: Math.max(0, prev.protein - foodToRemove.nutrition.protein),
      carbs: Math.max(0, prev.carbs - foodToRemove.nutrition.carbs),
      fat: Math.max(0, prev.fat - foodToRemove.nutrition.fat),
      fiber: Math.max(0, prev.fiber - foodToRemove.nutrition.fiber),
      sugar: Math.max(0, prev.sugar - foodToRemove.nutrition.sugar),
      sodium: Math.max(0, prev.sodium - foodToRemove.nutrition.sodium)
    }));
  };

  // ============= RENDER =============
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nutrition & Meals</h2>
        <p className="text-gray-600">Discover healthy recipes and track your nutrition</p>
      </div>

      {/* Health Insights */}
      {healthInsights && (healthInsights.warnings.length > 0 || healthInsights.recommendations.length > 0) && (
        <div className={`rounded-2xl p-6 border ${
          healthInsights.overall === 'excellent' 
            ? 'bg-green-500/10 border-green-500/20' 
            : healthInsights.overall === 'caution'
            ? 'bg-yellow-500/10 border-yellow-500/20'
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <div className="flex items-start space-x-3">
            {healthInsights.overall === 'excellent' ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {healthInsights.overall === 'excellent' ? '✅ Health Insights' : '⚠️ Health Insights'}
              </h3>
              
              {healthInsights.warnings.length > 0 && (
                <div className="mb-3">
                  {healthInsights.warnings.map((warning, idx) => (
                    <p key={idx} className="text-sm text-gray-600 mb-1">⚠️ {warning}</p>
                  ))}
                </div>
              )}
              
              {healthInsights.recommendations.map((rec, idx) => (
                <p key={idx} className="text-sm text-gray-600 mb-1">💡 {rec}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily Nutrition Tracker */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Today's Nutrition</h3>
          <button
            onClick={() => setShowFoodLogger(!showFoodLogger)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Food</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(getNutritionStatus(dailyNutrition.calories, 'calories'))}`}>
              {Math.round(dailyNutrition.calories)}
            </div>
            <div className="text-xs text-gray-600">Calories</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(getNutritionStatus(dailyNutrition.protein, 'protein'))}`}>
              {Math.round(dailyNutrition.protein)}g
            </div>
            <div className="text-xs text-gray-600">Protein</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(getNutritionStatus(dailyNutrition.carbs, 'carbs'))}`}>
              {Math.round(dailyNutrition.carbs)}g
            </div>
            <div className="text-xs text-gray-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(getNutritionStatus(dailyNutrition.fat, 'fat'))}`}>
              {Math.round(dailyNutrition.fat)}g
            </div>
            <div className="text-xs text-gray-600">Fat</div>
          </div>
        </div>
      </div>

      {/* Food Logger */}
      {showFoodLogger && (
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Log Your Food</h3>
          
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={userFoodInput}
              onChange={(e) => setUserFoodInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogFood()}
              placeholder="e.g., egg, apple, coffee"
              className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleLogFood}
              disabled={!userFoodInput.trim() || isProcessingFood}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isProcessingFood ? 'Processing...' : 'Add'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {loggedFoods.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Today's Foods:</h4>
              {loggedFoods.map((food) => (
                <div key={food.id} className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{food.food_name}</p>
                    <div className="flex space-x-4 mt-1 text-xs text-gray-600">
                      <span>{Math.round(food.nutrition.calories)} cal</span>
                      <span>{Math.round(food.nutrition.protein)}g protein</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeLoggedFood(food.id)}
                    className="text-red-500 hover:text-red-600 text-sm ml-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Meal Type Selection */}
      <div className="flex flex-wrap gap-2">
        {mealTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedMealType(type.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedMealType === type.id
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white/20 text-gray-700 hover:bg-white/30'
            }`}
          >
            <span>{type.emoji}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Current Recipe */}
      {currentRecipe && (
        <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              <img
                src={currentRecipe.image}
                alt={currentRecipe.label}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">{currentRecipe.totalTime} min</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">{currentRecipe.yield} servings</div>
                </div>
                <div className="text-center">
                  <Zap className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">{Math.round(currentRecipe.calories / currentRecipe.yield)} cal</div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentRecipe.label}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {currentRecipe.dietLabels.map((label, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-700 text-xs rounded-full">
                    {label}
                  </span>
                ))}
              </div>

              <div className="bg-white/20 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Nutrition per serving</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-lg font-bold text-orange-500">
                      {Math.round(currentRecipe.calories / currentRecipe.yield)}
                    </div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-500">
                      {Math.round(currentRecipe.totalNutrients.PROCNT.quantity / currentRecipe.yield)}g
                    </div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-500">
                      {Math.round(currentRecipe.totalNutrients.CHOCDF.quantity / currentRecipe.yield)}g
                    </div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {Math.round(currentRecipe.totalNutrients.FAT.quantity / currentRecipe.yield)}g
                    </div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Ingredients</h4>
                <ul className="space-y-1">
                  {currentRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {ingredient.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => toggleFavorite(currentRecipe)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    favoriteRecipes.some(fav => fav.id === currentRecipe.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>
                    {favoriteRecipes.some(fav => fav.id === currentRecipe.id) ? 'Favorited' : 'Favorite'}
                  </span>
                </button>
                
                <button
                  onClick={() => addToNutrition(currentRecipe)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Add to Today</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe List */}
      {recipes.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            More {mealTypes.find(t => t.id === selectedMealType)?.label} Ideas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.filter(recipe => recipe.id !== currentRecipe?.id).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setCurrentRecipe(recipe)}
                className="text-left bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors border border-white/20"
              >
                <img
                  src={recipe.image}
                  alt={recipe.label}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                  {recipe.label}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{Math.round(recipe.calories / recipe.yield)} cal</span>
                  <span>{recipe.totalTime} min</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSection;
