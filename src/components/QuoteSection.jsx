/**
 * QuoteSection.jsx - Daily Inspiration & Quotes
 * 
 * Features:
 * - Fetches daily motivational quotes from Quotable API
 * - Beautiful typography and quote presentation
 * - Quote sharing functionality
 * - Quote categories and filtering
 * - Save favorite quotes locally
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart, Share2, BookOpen } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const QuoteSection = ({ isPreview = false }) => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [quoteCategory, setQuoteCategory] = useState('motivational');

  // Quote categories available
  const categories = [
    { id: 'motivational', label: 'Motivational', tags: 'motivational,success,perseverance' },
    { id: 'wisdom', label: 'Wisdom', tags: 'wisdom,life,philosophy' },
    { id: 'happiness', label: 'Happiness', tags: 'happiness,joy,positive' },
    { id: 'success', label: 'Success', tags: 'success,achievement,goals' }
  ];

  // Load favorite quotes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('wellnessHub_favoriteQuotes');
    if (saved) {
      setFavoriteQuotes(JSON.parse(saved));
    }
  }, []);

  // Fetch quote from Quotable API
 const fetchQuote = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // Pick a random category
    const categoryOptions = ['success', 'wisdom', 'inspirational'];
    const categoryTags = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];

    const response = await fetch(
      `https://api.api-ninjas.com/v2/randomquotes?category=${categoryTags}`,
      {
        headers: {
          'X-Api-Key': 'jmobJgprZH8RQ4ogIUMpSQ==lJAccYXB0kSI5hRg',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quoteData = await response.json();
    const quote = quoteData[0];

    setCurrentQuote({
      _id: Date.now().toString(),
      content: quote.quote,
      author: quote.author || 'Unknown',
      tags: [categoryTags],
    });

  } catch (err) {
    setError('Unable to load inspirational quote. Please try again.');
    console.error('Quote fetch error:', err);
  } finally {
    setIsLoading(false);
  }
};




  // Initial quote fetch
  useEffect(() => {
    fetchQuote();
  }, [quoteCategory]);

  // Toggle favorite quote
  const toggleFavorite = (quote) => {
    const isAlreadyFavorite = favoriteQuotes.some(fav => fav._id === quote._id);
    let updatedFavorites;
    
    if (isAlreadyFavorite) {
      updatedFavorites = favoriteQuotes.filter(fav => fav._id !== quote._id);
    } else {
      updatedFavorites = [...favoriteQuotes, quote];
    }
    
    setFavoriteQuotes(updatedFavorites);
    localStorage.setItem('wellnessHub_favoriteQuotes', JSON.stringify(updatedFavorites));
  };

  // Share quote functionality
  const shareQuote = async (quote) => {
    const shareText = `"${quote.content}" - ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspirational Quote',
          text: shareText
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      // You could add a toast notification here
    }
  };

  // Preview version for dashboard
  if (isPreview) {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    
    return (
      <div className="text-center">
        <div className="text-2xl mb-4">💫</div>
        <h3 className="font-semibold text-gray-800 mb-3">Daily Inspiration</h3>
        {currentQuote && (
          <div>
            <blockquote className="text-sm text-gray-700 italic mb-2 line-clamp-3">
              "{currentQuote.content}"
            </blockquote>
            <cite className="text-xs text-gray-500">- {currentQuote.author}</cite>
          </div>
        )}
        <button 
          onClick={() => fetchQuote()}
          className="mt-3 text-xs text-emerald-600 hover:text-emerald-700"
        >
          New Quote
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Inspiration</h2>
        <p className="text-gray-600">Find motivation and wisdom for your day</p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setQuoteCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              quoteCategory === category.id
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white/20 text-gray-700 hover:bg-white/30'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Main Quote Display */}
      <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Loading inspiration...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">❌</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchQuote()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : currentQuote ? (
          <div className="text-center">
            {/* Quote Icon */}
            <BookOpen className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            
            {/* Quote Content */}
            <blockquote className="text-xl md:text-2xl text-gray-800 font-light leading-relaxed mb-6 max-w-4xl mx-auto">
              "{currentQuote.content}"
            </blockquote>
            
            {/* Author */}
            <cite className="text-lg text-gray-600 font-medium">
              — {currentQuote.author}
            </cite>
            
            {/* Quote Tags */}
            {currentQuote.tags && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {currentQuote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/20 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => fetchQuote()}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Quote</span>
              </button>
              
              <button
                onClick={() => toggleFavorite(currentQuote)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors shadow-lg ${
                  favoriteQuotes.some(fav => fav._id === currentQuote._id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/20 text-gray-700 hover:bg-white/30'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>
                  {favoriteQuotes.some(fav => fav._id === currentQuote._id) ? 'Favorited' : 'Favorite'}
                </span>
              </button>
              
              <button
                onClick={() => shareQuote(currentQuote)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Favorite Quotes Section */}
      {favoriteQuotes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Favorite Quotes</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {favoriteQuotes.slice(0, 4).map((quote) => (
              <div
                key={quote._id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <blockquote className="text-sm text-gray-700 italic mb-2">
                  "{quote.content}"
                </blockquote>
                <cite className="text-xs text-gray-500">— {quote.author}</cite>
                <button
                  onClick={() => toggleFavorite(quote)}
                  className="mt-2 text-red-500 hover:text-red-600"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteSection;