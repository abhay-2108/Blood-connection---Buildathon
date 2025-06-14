# models/predict.py

import sys
import json
import numpy as np
import pickle

# Load trained logistic regression model
with open("models/blood_donation_rf.pkl", "rb") as f:
    model = pickle.load(f)

# Parse input JSON from Node.js
input_json = sys.argv[1]
input_data = json.loads(input_json)

try:
    # Extract features in correct order
    recency = input_data["recency"]
    frequency = input_data["frequency"]
    monetary = input_data["monetary"]
    time = input_data["time"]

    # Apply log transformation to monetary as done during training
    monetary_log = np.log(monetary)

    # Build input vector with the same feature names/columns used during training
    input_vector = np.array([[recency, frequency, time, monetary_log]])

    # Predict
    prediction = model.predict(input_vector)[0]
    probability = model.predict_proba(input_vector)[0][1]

    # Return prediction
    print(json.dumps({
        "prediction": int(prediction),
        "probability": round(probability, 4)
    }))

except Exception as e:
    print(json.dumps({
        "error": str(e)
    }))
