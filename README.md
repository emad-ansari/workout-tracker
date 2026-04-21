# FitNova - Professional Workout Tracker 🏋️‍♂️

FitNova is a premium, feature-rich workout tracking application built with **React Native** and **Expo**. It empowers users to plan, track, and analyze their fitness journey with a sleek, modern interface.

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)

---

## 📱 App Screenshots

| Home Dashboard | Exercise Library | Exercise Details |
| :-: | :-: | :-: |
| ![Home Screen](assets/screen-images/home-screen.png) | ![Exercise Library](assets/screen-images/exercise-library-screen.png) | ![Exercise Details](assets/screen-images/exercise-details-screen.png) |

| Plan Workout | Active Tracking | User Profile |
| :-: | :-: | :-: |
| ![Plan Workout](assets/screen-images/plan-workout-screen.png) | ![Workout History](assets/screen-images/workout-history-screen.png) | ![User Profile](assets/screen-images/user-profile-screen.png) |

---

## ✨ Key Features

- **🏠 Comprehensive Dashboard**: Stay on top of your fitness goals with a dynamic home screen showing your latest progress and upcoming workouts.
- **📚 Extensive Exercise Library**: Browse a vast collection of exercises with detailed instructions and high-quality images powered by Sanity CMS.
- **⏱️ Real-time Workout Tracking**: Log your sets, reps, and weights in real-time with an intuitive active workout interface.
- **📅 Workout Planning**: Schedule and plan your workout routines ahead of time to stay consistent.
- **📈 Progress History**: Review your past workouts and track your performance trends over time.
- **🔐 Secure Authentication**: Seamless and secure login/sign-up experience powered by Clerk.
- **🎨 Premium UI/UX**: Beautifully designed with NativeWind (Tailwind CSS) for a modern, responsive feel.

---

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Animations**: React Native Reanimated
- **Authentication**: Clerk
- **Backend/CMS**: Sanity.io (for exercise content)
- **Icons**: Lucide React Native (via Expo Symbols/Vector Icons)
- **Persistence**: Expo Secure Store & Async Storage

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device or an Emulator/Simulator

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/workout-tracker.git
   cd workout-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Clerk and Sanity credentials:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   EXPO_PUBLIC_SANITY_PROJECT_ID=your_sanity_id
   EXPO_PUBLIC_SANITY_DATASET=production
   ```

4. **Start the development server:**
   ```bash
   npm run start
   ```

5. **Open the app:**
   - Scan the QR code with your phone (Expo Go).
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.

---

## 📂 Project Structure

```text
├── app/                  # Expo Router - File-based routing
│   ├── (app)/            # Authenticated application routes
│   │   ├── (tabs)/       # Tab-based navigation (Home, Exercises, etc.)
│   │   └── _layout.tsx   # Authenticated layout
│   ├── sign-in.tsx       # Authentication screens
│   └── _layout.tsx       # Root layout
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Reusable UI components
├── constants/            # Application constants and configuration
├── hooks/                # Custom React hooks
├── lib/                  # Third-party library configurations (Sanity, etc.)
├── store/                # Zustand state management
├── sanity/               # Sanity CMS configuration and schemas
└── tailwind.config.js    # Tailwind CSS configuration
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by [Your Name/Company]
