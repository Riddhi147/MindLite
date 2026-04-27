import joblib
import pickle
import numpy as np
import os
import warnings
warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))

# ── Model A: 6-feature model (src/ml/saved_model.pkl) ────────────────────────
model_a_path = os.path.join(BASE_DIR, "saved_model.pkl")
model_a = None

try:
    model_a = joblib.load(model_a_path)
except Exception as e:
    print(f"Warning: Could not load model A from {model_a_path}: {e}")

def predict_score(data):
    """Original 6-feature prediction (age, memory_score, attention_score, language_score, sleep_hours, activity_level)."""
    if model_a is None:
        raise ValueError("Model A is not loaded")
    
    try:
        features = np.array([[
            data["age"],
            data["memory_score"],
            data["attention_score"],
            data["language_score"],
            data["sleep_hours"],
            data["activity_level"]
        ]])

        score = model_a.predict(features)[0]

        if score > 80:
            risk = "Normal"
        elif score > 60:
            risk = "Mild"
        elif score > 40:
            risk = "Moderate"
        else:
            risk = "Severe"

        return {"score": round(score, 2), "risk": risk}
    except Exception as e:
        print(f"Error in predict_score: {e}")
        raise


# ── Model B: 5-feature model (ml/model.pkl) ──────────────────────────────────
model_b_path = os.path.join(PROJECT_ROOT, "ml", "model.pkl")
model_b = None

try:
    with open(model_b_path, "rb") as f:
        model_b = pickle.load(f)
except Exception as e:
    print(f"Warning: Could not load model B from {model_b_path}: {e}")

def predict_from_games(data):
    """5-feature prediction using game scores: memory_match, word_recall, pattern_recognition, face_recognition, reaction_time."""
    if model_b is None:
        raise ValueError("Model B is not loaded")
    
    try:
        rt = float(data["reaction_time"])
        # If reaction time is excessively small (< 50), it was likely entered in seconds rather than ms
        if rt < 50:
            rt *= 1000

        features = np.array([[
            data["memory_match"],
            data["word_recall"],
            data["pattern_recognition"],
            data["face_recognition"],
            rt
        ]])

        score = float(model_b.predict(features)[0])

        if score > 80:
            risk = "Normal"
        elif score > 60:
            risk = "Mild"
        elif score > 40:
            risk = "Moderate"
        else:
            risk = "Severe"

        return {"cognitive_score": round(score, 2), "risk": risk}
    except Exception as e:
        print(f"Error in predict_from_games: {e}")
        raise