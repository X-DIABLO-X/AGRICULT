
# 🌱 AGRICULT Project

## 🌍 Project Overview

The AGRICULT project is designed to revolutionize the agricultural industry by integrating technology to improve efficiency, sustainability, and productivity. 🌾 This solution provides a seamless interface for users to interact with various tools and features tailored to the needs of modern farming and agricultural management.

## ✨ Features

- 🌟 **Smart Crop Management**: Real-time insights and recommendations for crop health.
- 🌦️ **Weather Integration**: Weather forecasts and climate analysis for planning.
- 📊 **Market Analytics**: Data-driven insights into agricultural markets.
- 🖥️ **User-friendly Interface**: Intuitive design for seamless navigation.
- 🔧 **Scalable Backend**: High-performance server-side infrastructure to support diverse functionalities.

## 🛠️ Technology Stack

- **Frontend**: React Native
- **Backend**: Node.js with Express.js
- **Database**: Supabase
- **Other Tools**: REST APIs, Docker (for containerization)

## 🚀 Setup Instructions

Follow these steps to set up and run the project:

### 📋 Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- Supabase (configured account)

### 🔙 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     SUPABASE_URL=<your_supabase_url>
     SUPABASE_KEY=<your_supabase_key>
     PORT=5000
     ```
4. Start the server:
   ```bash
   npm start
   ```

### 📱 Frontend Setup

1. Navigate to the frontendnative directory:
   ```bash
   cd frontendnative
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React Native development server:
   ```bash
   npm start
   ```
4. Use an emulator or a real device to test the application.

## 🎯 Usage Instructions

1. Launch the backend and frontend servers as described in the setup instructions.
2. Access the application on your mobile device or emulator.
3. Explore features like crop recommendations, weather analysis, and market trends.
4. Provide input as required, and receive data-driven outputs tailored to agricultural practices.

## 📂 Project Structure

```
AGRICULT-main/
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- models/
|   |   |-- routes/
|   |-- .env.example
|   |-- package.json
|-- frontendnative/
|   |-- src/
|   |   |-- components/
|   |   |-- screens/
|   |-- package.json
|-- README.md
```

- **backend/**: Contains server-side logic, routes, and database models.
- **frontendnative/**: Contains React Native components and UI screens.
- **README.md**: Documentation for the project.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

For any queries or contributions, feel free to open an issue or contact the project maintainers. 🌟
