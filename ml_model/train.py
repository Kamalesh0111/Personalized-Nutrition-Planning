import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib

print("Starting model training process...")

# --- 1. LOAD AND MERGE THE DATASET ---
try:
    exercise_df = pd.read_csv('ml_model/exercise.csv')
    calories_df = pd.read_csv('ml_model/calories.csv')
    df = pd.merge(exercise_df, calories_df, on='User_ID')
    print("Successfully loaded and merged datasets.")
except FileNotFoundError:
    print("\nERROR: Make sure 'exercise.csv' and 'calories.csv' are in the 'ml_model' directory.")
    exit()

# --- 2. DATA CLEANING AND PREPROCESSING ---
df = df.drop('User_ID', axis=1)
df['Gender'] = df['Gender'].map({'male': 0, 'female': 1})
print("Data cleaned and preprocessed.")

# --- 3. FEATURE ENGINEERING WITH K-MEANS CLUSTERING ---
features_for_clustering = ['Age', 'Height', 'Weight', 'Duration', 'Heart_Rate', 'Body_Temp']
X_cluster = df[features_for_clustering]
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df['plan_id'] = kmeans.fit_predict(X_cluster)
print(f"Created {df['plan_id'].nunique()} user segments (plans) using K-Means clustering.")

# --- 4. TRAIN THE PREDICTION MODEL (DECISION TREE) ---
features_for_prediction = ['Age', 'Height', 'Weight', 'Gender', 'Duration']
X = df[features_for_prediction]
y = df['plan_id']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Decision Tree Classifier trained. Accuracy: {accuracy:.2f}")

# --- 5. SAVE THE TRAINED MODEL ---
joblib.dump(model, 'ml_model/diet_plan_model.pkl')
print("\n✅ Model training complete! 'diet_plan_model.pkl' saved.")