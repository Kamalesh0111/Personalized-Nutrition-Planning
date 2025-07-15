<div align="center">

#  AI Powered Personalized Nutrition Planner

**A personalized diet and exercise recommendation platform powered by machine learning.**

</div>

This full-stack application provides users with customized wellness plans based on their unique biometrics, activity levels, and personal goals. It uses a React frontend, a Node.js/Express backend, and a Python-powered machine learning engine to deliver a seamless and intelligent user experience.

---

## ✨ Core Features

-   **🔒 Secure User Authentication**: Robust registration and login system using JWT for secure, session-based authentication and `bcrypt` for password hashing.
-   **📝 Personalized Data Input**: An intuitive form for users to input their age, weight, height, activity level, dietary preferences, and wellness goals.
-   **🧠 ML-Powered Recommendations**: A Scikit-learn model, trained on a large dataset, analyzes user input to generate a detailed, scientifically-backed diet and exercise plan.
-   **💾 Persistent User History**: All generated plans are saved to the user's profile in a MySQL database, allowing them to track their progress and review past recommendations.
-   **🖥️ Interactive Dashboard**: A clean and modern user interface built with React and Vite, featuring dynamic components for a fast and responsive experience.

---

## 🚀 Tech Stack

This project uses a combination of modern technologies to create a robust and scalable application.

| Category             | Technology / Library                                                               |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Frontend**         | `React`, `Vite`, `Tailwind CSS`, `Axios`, `React Markdown`                           |
| **Backend**          | `Node.js`, `Express.js`                                                            |
| **Database**         | `MySQL` (hosted on `AWS RDS`)                                                      |
| **Machine Learning** | `Python`, `Scikit-learn`, `Pandas`, `Joblib`                                       |
| **Environment**      | `dotenv` for secure secret management                                              |

---

## 🔧 How It Works

The application follows a simple but powerful architectural flow:

> 1.  The user registers/logs in on the **React frontend**.
> 2.  The **Node.js/Express backend** handles the request, verifies credentials against the MySQL database, and returns a JWT.
> 3.  Once logged in, the user submits their wellness data via a form.
> 4.  The backend receives this data and invokes the **Python `predict.py` script** as a child process, passing the user data as input.
> 5.  The Python script loads the pre-trained `diet_plan_model.pkl` file, makes a prediction to determine the user's plan ID, and formats a detailed recommendation string.
> 6.  The backend receives the formatted plan, saves it to the database, and sends it back to the frontend.
> 7.  The React frontend displays the personalized plan in a beautifully formatted component.

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or newer)
-   Python (v3.9 or newer)
-   Git
-   An AWS Account (for the RDS database)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add your secret credentials (see below)
```

**`.env` File Configuration**

Create a file named `.env` in the `/backend` directory and populate it with your credentials.

> **Note:** This file contains sensitive information and is ignored by Git. Never commit it to a public repository.

```ini
# Database Configuration - Replace with your AWS RDS details
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=your-master-username
DB_PASSWORD=your-super-secret-password
DB_NAME=wellness_db

# JWT Secret - Use a long, random, and secure string
JWT_SECRET=this_is_a_very_long_and_secure_secret_for_your_app
```

### 3. Machine Learning Model Setup

This step only needs to be performed once to generate the model file.

```bash
# Navigate to the ml_model directory
cd ml_model

# Download the required dataset from Kaggle:
# https://www.kaggle.com/datasets/fmendes/exercise-and-calories-dataset
# Place both exercise.csv and calories.csv into this folder.

# Install Python dependencies
pip install scikit-learn pandas joblib

# Go back to the project root to run the training script
cd ..
python ml_model/train.py
```
This will create a `diet_plan_model.pkl` file in the `/ml_model` directory.

### 4. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### 5. Running the Application

You will need **two separate terminals** running at the same time.

1️⃣ **Start the Backend Server:**
```bash
# In your first terminal
cd backend
node server.js
# Server will be running on http://localhost:5000
```

2️⃣ **Start the Frontend Client:**```bash
# In your second terminal
cd frontend
npm run dev
# Vite will open your browser to http://localhost:5173 (or a similar port)


## API Endpoints

All API routes are prefixed with `/api`.

| Method | Route             | Description                        | Auth Required |
| :----: | :---------------- | :--------------------------------- | :-----------: |
| `POST` | `/register`       | Creates a new user account.        |      No       |
| `POST` | `/login`          | Logs in a user and returns a JWT.  |      No       |
| `POST` | `/recommendation` | Generates and saves a new plan.    |      Yes      |
| `GET`  | `/history`        | Fetches all past plans for a user. |      Yes      |

