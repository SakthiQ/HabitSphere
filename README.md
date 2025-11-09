# 🌟 Habit Sphere - Personal Wellness & Productivity Dashboard

A beautiful, modern web application that helps you manage your daily wellness, productivity, and personal development. Built with React and designed with a stunning glassmorphism interface.

![WellnessHub Dashboard](https://img.shields.io/badge/Status-Ready%20to%20Run-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF)

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Running

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to `http://localhost:5173`
   - Enjoy your WellnessHub! 🎉

## �� What You'll See

When you run the app, you'll experience:

- **Beautiful Loading Screen** - "Initializing Your Wellness Hub"
- **Modern Dashboard** - Glassmorphism design with gradient backgrounds
- **Navigation Menu** - Easy switching between different sections
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🎯 Features

### 🏠 **Dashboard Overview**
- Quick stats cards showing all available features
- Preview widgets for quotes and weather
- Beautiful welcome section with app description

### 💫 **Daily Inspiration**
- Fetches motivational quotes from Quotable API
- Multiple categories: Motivational, Wisdom, Happiness, Success
- Save favorite quotes locally
- Share quotes with friends
- Beautiful typography and presentation

### 🌤️ **Weather & Activity Guide**
- Weather data integration (OpenWeatherMap API ready)
- Activity recommendations based on weather conditions
- 5-day weather forecast
- Weather-based clothing and activity suggestions
- Currently uses demo data (API key needed for real data)

### 💪 **Fitness Tracker**
- Exercise database integration (ExerciseDB API ready)
- Filter by body parts: Chest, Back, Shoulders, Legs, Arms, Core
- Workout timer functionality
- Exercise instructions and tracking
- Personal workout history
- Currently uses demo data (API key needed for real data)

### 😊 **Mood Tracking**
- 7-point mood scale with emojis
- Daily mood logging with history
- Journal prompts for reflection
- Mood analytics and trends
- Mindfulness tips and insights

### ✅ **Task Management**
- Create and manage tasks with priorities
- Habit tracking with streak counters
- Multiple categories: Personal, Work, Health, Learning, Social
- Productivity analytics
- Goal setting and progress tracking

### 🥗 **Nutrition Planning**
- Meal suggestions and planning
- Dietary restriction support
- Nutrition tracking capabilities

## 🛠️ Technology Stack

- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.2
- **Styling:** Tailwind CSS 3.4.1
- **Icons:** Lucide React
- **Database:** Supabase (configured)
- **Language:** JavaScript (JSX)


## 🎨 Design Features

- **Glassmorphism Design** - Translucent cards with backdrop blur effects
- **Gradient Backgrounds** - Beautiful emerald-to-blue-to-purple gradients
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Hover effects and transitions
- **Consistent Iconography** - Lucide React icons
- **Modern Typography** - Clean, readable fonts

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code quality
npm run lint
```

## 🌐 API Integrations

The app is ready to integrate with these APIs (API keys needed):

- **Quotable API** - For inspirational quotes ✅ (Working)
- **OpenWeatherMap API** - For weather data (Demo data currently)
- **ExerciseDB API** - For fitness exercises (Demo data currently)
- **Supabase** - Database integration (Configured but not used)

## 💾 Data Storage

- **Local Storage** - User preferences, favorites, and history
- **No Database Required** - Everything works offline
- **Persistent Data** - Your data stays between sessions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
1. **Upload `dist/` folder** to any web server
2. **Static hosting services:**
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Any web server

## 🎯 How It Works (Simple Explanation)

Think of this like a **single-page website** that changes content without reloading:

1. **`index.html`** - Your main HTML file
2. **`main.jsx`** - Starts the React app
3. **`App.jsx`** - Controls what shows on the page
4. **Components** - Like separate HTML files for different sections
5. **Navigation** - JavaScript changes which component shows

## 🔄 State Management

- **React Hooks** - `useState` and `useEffect` for managing data
- **Local Storage** - Saves your preferences and data
- **No External Libraries** - Pure React state management

## �� Customization

### Changing Colors
Edit `tailwind.config.js` to customize the color scheme.

### Adding New Sections
1. Create a new component in `src/components/`
2. Add it to the navigation in `Header.jsx`
3. Add it to the router in `Dashboard.jsx`

### Modifying Styles
- Global styles: `src/index.css`
- Component styles: Use Tailwind classes in components

## �� Troubleshooting

### Common Issues

**App won't start:**
```bash
# Make sure dependencies are installed
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
# Check for syntax errors
npm run lint

# Try building again
npm run build
```

**Styling issues:**
- Make sure Tailwind CSS is properly configured
- Check that classes are spelled correctly

## �� License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help:

1. Check the troubleshooting section above
2. Look at the component files for examples
3. Create an issue in the project repository

## 🎉 Enjoy Your HabitSphere!

This app is designed to help you stay motivated, organized, and healthy. Use it daily to track your mood, manage tasks, get inspired, and plan your activities based on the weather.

**Happy wellness tracking! ��**

---

*Built with ❤️ using React, Tailwind CSS, and modern web technologies.*
