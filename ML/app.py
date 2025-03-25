from flask import Flask, request, jsonify
import numpy as np
import joblib
from sklearn.preprocessing import OneHotEncoder
from tensorflow.keras.models import load_model
from tensorflow.keras.saving import register_keras_serializable
from tensorflow.keras.losses import MeanSquaredError
from flask_cors import CORS
from sklearn.preprocessing import LabelEncoder

@register_keras_serializable()
class CustomMSE(MeanSquaredError):
    pass

app = Flask(__name__)
CORS(app)

# Load model and preprocessors
try:
    model = load_model('C:\\Users\\arunk\\Desktop\\cyp\\ML\\crop_yield_model.h5', custom_objects={"CustomMSE": CustomMSE()})
    scaler = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\scaler.pkl')
    season_encoder = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\season_encoder.pkl')
    crop_encoder = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\crop_encoder.pkl')
    print("All models and preprocessors loaded successfully.")
except Exception as e:
    print(f"Error loading dependencies: {e}")
    exit(1)  # Stop execution if models are not loaded properly

# Add the new fertilizer endpoints to existing app.py
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Ensure required keys exist
        required_keys = {'ph', 'rainfall', 'temperature', 'season'}
        if not required_keys.issubset(data.keys()):
            return jsonify({'error': f'Missing keys in input data. Required keys: {required_keys}'}), 400

        # Ensure temperature is a list of 5 values
        if not isinstance(data['temperature'], list) or len(data['temperature']) != 5:
            return jsonify({'error': 'Temperature must be a list of 5 values'}), 400
        
        # Prepare input values
        user_ph = data['ph']
        user_rainfall = data['rainfall']
        avg_temperature = np.mean(data['temperature'])  # Take average of 5 temperature values

        # Ensure the feature order matches the scaler training data (4 features)
        input_data = np.array([[user_ph, avg_temperature, user_rainfall, 0]])  # Add a dummy 4th feature

        # Scale the input data
        scaled_features = scaler.transform(input_data)  # This now has 4 features
        user_ph_scaled = scaled_features[:, 0:1]
        user_temp_scaled = scaled_features[:, 1:2]  # Scaled temperature
        user_rainfall_scaled = scaled_features[:, 2:3]

        # Encode season
        user_season = season_encoder.transform([[data['season']]])  # Shape (1, encoded_dim)

        # Convert temperature sequence to numpy array
        user_temperature_seq = np.array(data['temperature']).reshape(1, 5, 1)  # Shape (1,5,1) for LSTM

        # Debug prints
        print("Processed inputs:")
        print(f"pH (scaled): {user_ph_scaled}")
        print(f"Temperature (scaled): {user_temp_scaled}")
        print(f"Rainfall (scaled): {user_rainfall_scaled}")
        print(f"Temperature sequence: {user_temperature_seq}")
        print(f"Season encoded: {user_season}")

        # Make prediction
        predicted_yields = model.predict(
            [user_ph_scaled, user_rainfall_scaled, user_temperature_seq, user_season],
            verbose=0
        )[0]

        # Get top 3 crops
        top_3_crop_indices = np.argsort(predicted_yields)[-3:][::-1]
        top_3_crops = crop_encoder.categories_[0][top_3_crop_indices]

        # Prepare response
        response = {
            "top_3_crops": [
                {
                    "crop": crop,
                    "yield": float(predicted_yields[idx])
                }
                for idx, crop in zip(top_3_crop_indices, top_3_crops)
            ]
        }

        print("Prediction results:", response)
        return jsonify(response)

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

# Add these new model loads after your existing ones
# After your existing imports, add:
try:
    fertilizer_model = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_model.pkl')
    fertilizer_scaler = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_scaler.pkl')
    fertilizer_crop_encoder = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_crop_encoder.pkl')
    fertilizer_season_encoder = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_season_encoder.pkl')
    fertilizer_output_encoder = joblib.load('C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_output_encoder.pkl')
    print("Fertilizer model and encoders loaded successfully.")
except Exception as e:
    print(f"Error loading fertilizer model: {e}")

@app.route('/fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print

        # Prepare input data
        numeric_data = np.array([[
            float(data['ph']),
            float(data['rainfall']),
            float(data['temperature'])
        ]])
        
        # Scale numeric features
        numeric_scaled = fertilizer_scaler.transform(numeric_data)
        
        # Encode categorical features
        crop_encoded = fertilizer_crop_encoder.transform([data['crop']])
        season_encoded = fertilizer_season_encoder.transform([data['season']])
        
        # Combine features
        X = np.column_stack([numeric_scaled, crop_encoded, season_encoded])
        
        # Make prediction
        fertilizer_pred = fertilizer_model.predict(X)
        fertilizer_name = fertilizer_output_encoder.inverse_transform(fertilizer_pred)[0]
        
        response = {
            'fertilizer': fertilizer_name,
            'application_rate': '200-250 kg/ha',
            'timing': 'Apply in split doses: 50% at sowing, 25% at vegetative stage, 25% at reproductive stage',
            'notes': f'Ensure proper soil moisture before application. For {data["crop"]}, monitor soil pH regularly.'
        }
        
        print("Response:", response)  # Debug print
        return jsonify(response)

    except Exception as e:
        print(f"Error during fertilizer prediction: {e}")  # Debug print
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
