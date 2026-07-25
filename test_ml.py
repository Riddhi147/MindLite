import sys
import os
import warnings
warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.ml.predict import predict_from_games

inputs_good = {
    "memory_match": 100.0,
    "word_recall": 100.0,
    "pattern_recognition": 100.0,
    "face_recognition": 100.0,
    "reaction_time": 200.0
}

inputs_bad = {
    "memory_match": 10.0,
    "word_recall": 10.0,
    "pattern_recognition": 10.0,
    "face_recognition": 10.0,
    "reaction_time": 2000.0
}

inputs_bad2 = {
    "memory_match": 0.0,
    "word_recall": 0.0,
    "pattern_recognition": 0.0,
    "face_recognition": 0.0,
    "reaction_time": 10000.0
}

print("Good Inputs:", predict_from_games(inputs_good))
print("Bad Inputs:", predict_from_games(inputs_bad))
print("Bad Inputs 2:", predict_from_games(inputs_bad2))

import joblib
model_b_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml", "model.pkl")
model_b = joblib.load(model_b_path)
print("Model B features:", getattr(model_b, "feature_names_in_", "Not found"))

