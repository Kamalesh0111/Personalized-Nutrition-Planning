# ml_model/predict.py
import sys
import json
import pandas as pd
import joblib
import os  # <-- IMPORTANT: Import the 'os' module

# --- 1. DETAILED PLAN DATABASE ---
# This dictionary acts as our source of truth for all recommendation plans.
PLANS_DATABASE = {
    0: {
        "title": "General Fitness & Endurance Plan",
        "description": "Designed for individuals looking to build a solid aerobic base and improve overall cardiovascular health.",
        "diet_plan": { "focus": "Balanced macronutrients...", "breakfast": "Oatmeal...", "lunch": "Grilled chicken...", "dinner": "Baked salmon...", "snacks": "Greek yogurt..." },
        "exercise_plan": { "split": "3-4 sessions of cardio...", "workouts": ["Cardio: 45-60 minutes...", "Strength Day 1...", "Strength Day 2..."], "notes": "Focus on maintaining..." }
    },
    1: {
        "title": "Active Lifestyle & Weight Management Plan",
        "description": "Aimed at active individuals who want to manage their weight effectively by preserving muscle while reducing body fat.",
        "diet_plan": { "focus": "Slight calorie deficit...", "breakfast": "Scrambled eggs...", "lunch": "Lentil soup...", "dinner": "Lean ground turkey...", "snacks": "Cottage cheese..." },
        "exercise_plan": { "split": "A mix of 3 strength...", "workouts": ["Strength (Push Day)...", "Strength (Pull Day)...", "Strength (Leg Day)...", "Cardio: 30-40 minutes..."], "notes": "Consistency is key..." }
    },
    2: {
        "title": "Foundational Health & Mobility Plan",
        "description": "Perfect for beginners or those returning to exercise, focusing on building a solid foundation of strength and mobility safely.",
        "diet_plan": { "focus": "Whole foods...", "breakfast": "Greek yogurt...", "lunch": "Tuna salad sandwich...", "dinner": "Rotisserie chicken...", "snacks": "A handful of walnuts..." },
        "exercise_plan": { "split": "3 days of full-body...", "workouts": ["Strength Session...", "Light Activity..."], "notes": "Prioritize learning proper form..." }
    },
    3: {
        "title": "High-Intensity & Performance Plan",
        "description": "For experienced and highly active individuals looking to maximize performance, strength, and athletic conditioning.",
        "diet_plan": { "focus": "Calorie surplus...", "breakfast": "Large bowl of oatmeal...", "lunch": "Beef and vegetable skewers...", "dinner": "Pasta with lean meat sauce...", "snacks": "Protein shake post-workout..." },
        "exercise_plan": { "split": "2 HIIT sessions...", "workouts": ["HIIT Day...", "Push Day...", "Pull Day...", "Leg Day..."], "notes": "Ensure you are getting 7-9 hours of sleep..." }
    },
    4: {
        "title": "Balanced Wellness & Body Toning Plan",
        "description": "A well-rounded approach focusing on building lean muscle, improving body composition, and promoting overall wellness.",
        "diet_plan": { "focus": "Nutrient-dense foods...", "breakfast": "Smoothie with spinach...", "lunch": "Chicken or shrimp wrap...", "dinner": "Lean steak...", "snacks": "Avocado toast..." },
        "exercise_plan": { "split": "3 days of full-body...", "workouts": ["Full Body Strength...", "Flexible Activity..."], "notes": "Listen to your body..." }
    }
}
# Note: I have truncated the plan text for brevity, but you should use your full text.


# --- 2. HELPER FUNCTION TO FORMAT THE PLAN ---
def format_plan_for_display(plan_data):
    """Takes a plan dictionary and formats it into a readable string."""
    title = f"### {plan_data['title']} ###\n\n"
    description = f"**Description:** {plan_data['description']}\n\n"
    diet = plan_data['diet_plan']
    diet_section = (f"**Diet Plan:**\n"
                    f"- **Focus:** {diet['focus']}\n"
                    f"- **Breakfast:** {diet['breakfast']}\n"
                    f"- **Lunch:** {diet['lunch']}\n"
                    f"- **Dinner:** {diet['dinner']}\n"
                    f"- **Snacks:** {diet['snacks']}\n\n")
    exercise = plan_data['exercise_plan']
    exercise_section = f"**Exercise Plan:**\n- **Split:** {exercise['split']}\n"
    for workout in exercise['workouts']:
        exercise_section += f"- {workout}\n"
    exercise_section += f"- **Notes:** {exercise['notes']}\n"
    return title + description + diet_section + exercise_section


# --- 3. CORE SCRIPT LOGIC ---
if __name__ == "__main__":
    
    # --- THIS IS THE FIX ---
    # Get the absolute path of the directory where this predict.py script is located.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Join this directory path with the model filename to get the full, correct path.
    model_path = os.path.join(script_dir, 'diet_plan_model.pkl')
    # Load the model using the absolute path.
    model = joblib.load(model_path)
    # --- END OF FIX ---

    # Read input data from Node.js
    input_data = json.loads(sys.stdin.read())

    # Map frontend inputs to model features
    activity_map = {"sedentary": 20, "active": 60}
    duration = activity_map.get(input_data['activity_level'], 30)
    gender = 0  # Placeholder

    # Create a DataFrame for prediction
    user_df = pd.DataFrame({
        'Age': [int(input_data['age'])],
        'Height': [float(input_data['height'])],
        'Weight': [float(input_data['weight'])],
        'Gender': [gender],
        'Duration': [duration]
    })

    # Make a prediction
    predicted_plan_id = model.predict(user_df)[0]

    # Fetch the detailed plan from our database
    plan_details_data = PLANS_DATABASE.get(predicted_plan_id, PLANS_DATABASE[0])
    
    # Format the plan data into a nice string
    formatted_plan = format_plan_for_display(plan_details_data)

    # Output the result as a JSON string so Node.js can read it
    result = {'plan': formatted_plan}
    print(json.dumps(result))