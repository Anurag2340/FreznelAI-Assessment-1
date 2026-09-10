# ModelHub — AI Model Selection Utility

A modern AI Model Selection Utility built for the **Binaire Private Limited JavaScript Developer Assessment**.

ModelHub allows users to discover, search, filter, sort, inspect, select, favorite, and download AI model information from the official Binaire model catalog.

---

## 🚀 Features

### 🔐 Authentication
- Firebase Email/Password Authentication
- User Registration
- Login
- Logout
- Forgot Password
- Persistent Authentication Session
- Protected Application Routes
- User Profile

### 🤖 Model Discovery
- Live model catalog from the Binaire API
- Model Details
- Model Selection
- Favorites
- Recently Viewed Models
- Model JSON Download

### 🔎 Search
- Search by Model Name
- Search by Model Family
- Case-insensitive search
- Partial / substring matching
- Clear search
- Search history

### 🎛️ Filters
- Pipeline Tags
- Family Tags
- Architecture Tags
- Weight Format
- Safetensor Minimum
- Safetensor Maximum
- Multiple filters simultaneously
- Clear all filters

### ↕️ Sorting
- Model Name: A → Z
- Model Name: Z → A
- Safetensor Count: Low → High
- Safetensor Count: High → Low

### 🌐 Offline Support
- Online/Offline detection
- IndexedDB model caching
- Offline model browsing
- Offline search
- Offline filtering
- Offline sorting
- Offline model details
- Automatic refresh when connection returns

### 🎨 UI/UX
- Adobe Spectrum / React Spectrum
- Responsive design
- Smooth transitions
- Loading states
- Error states
- Empty states
- Toast notifications
- Accessible controls

---

# 🔗 Official API

The application uses the official Binaire model API:

**https://binaire.app/hf-models-api.json**

The API provides information including:

- Model ID
- Model Name
- Model Family
- Architecture
- Use Case
- Weight Format
- Safetensor File Count
- Hugging Face Repository
- Pipeline Tags
- Framework
- License
- Quantization
- Modality
- Application
- Safety Information
- Inference Information

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- React Spectrum
- CSS
- IndexedDB

## Backend

- Node.js
- Express.js

## Authentication

- Firebase Authentication

## Storage

- IndexedDB
- Local Storage

---

# 📁 Project Structure

```text
ModelHub/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── models/
│   │   │   ├── filters/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Models.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Recent.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── cache/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── services/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
