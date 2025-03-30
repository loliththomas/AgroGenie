from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
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
    model = load_model('F:\\Study\\S8\\cyp\\ML\\crop-yield\\crop_yield_model.h5', custom_objects={"CustomMSE": CustomMSE()})
    scaler = joblib.load('F:\\Study\\S8\\cyp\\ML\\crop-yield\\scaler.pkl')
    season_encoder = joblib.load('F:\\Study\\S8\\cyp\\ML\\crop-yield\\season_encoder.pkl')
    crop_encoder = joblib.load('F:\\Study\\S8\\cyp\\ML\\crop-yield\\crop_encoder.pkl')
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

        # Ensure required keys exist and validate temperature
        required_keys = {'ph', 'rainfall', 'temperature', 'season'}
        if not required_keys.issubset(data.keys()):
            return jsonify({'error': f'Missing keys in input data. Required keys: {required_keys}'}), 400
        if not isinstance(data['temperature'], list) or len(data['temperature']) != 5:
            return jsonify({'error': 'Temperature must be a list of 5 values'}), 400
        
        # Prepare input values
        user_ph = data['ph']
        user_rainfall = data['rainfall']

        # Scale numerical features (ph, rainfall, season)
        other_features = scaler.transform([[user_ph, user_rainfall, 0]])  # Add dummy for scaling
        
        # Encode season
        season_encoded = season_encoder.transform([data['season']])
        
        # Create final feature array
        other_features_final = np.column_stack([other_features[:, :2], season_encoded])

        # Prepare temperature sequence for LSTM
        temp_seq = np.array(data['temperature']).reshape(1, 5, 1)

        # Make prediction
        predicted_yields = model.predict(
            [temp_seq, other_features_final],
            verbose=0
        )[0]

        # Get top 3 crops
        top_3_indices = np.argsort(predicted_yields)[-3:][::-1]
        top_3_crops = crop_encoder[top_3_indices]

        # Prepare response
        response = {
            "top_3_crops": [
                {
                    "crop": crop,
                    "yield": float(predicted_yields[idx])
                }
                for idx, crop in zip(top_3_indices, top_3_crops)
            ]
        }

        print("Prediction results:", response)
        return jsonify(response)

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

# Update model loading section
try:
    fertilizer_model = joblib.load('f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\fertilizer_model.joblib')
    fertilizer_scaler = joblib.load('f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\fertilizer_scaler.joblib')
    fertilizer_crop_encoder = joblib.load('f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\crop_encoder.joblib')
    fertilizer_soil_encoder = joblib.load('f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\soil_encoder.joblib')
    fertilizer_encoder = joblib.load('f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\fertilizer_encoder.joblib')
    fertilizer_recommendations = joblib.load('f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\fertilizer_recommendations.joblib')
    print("Fertilizer model and preprocessors loaded successfully.")
except Exception as e:
    print(f"Error loading fertilizer model: {e}")
    exit(1)  # Stop execution if models aren't loaded properly

@app.route('/fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Create input data dictionary with case-insensitive key handling
        input_data = {
            'Temperature': float(data.get('Temperature', data.get('temperature', 0))),
            'Moisture': float(data.get('Moisture', data.get('moisture', 0))),
            'Rainfall': float(data.get('Rainfall', data.get('rainfall', 0))),
            'PH': float(data.get('PH', data.get('ph', 0))),
            'Soil': data.get('Soil', data.get('soil', '')),
            'Crop': data.get('Crop', data.get('crop', ''))
        }

        # Create DataFrame
        sample_df = pd.DataFrame([input_data])
        
        # Encode categorical variables
        try:
            sample_df['Crop'] = fertilizer_crop_encoder.transform(sample_df[['Crop']].values.ravel())
            sample_df['Soil'] = fertilizer_soil_encoder.transform(sample_df[['Soil']].values.ravel())
        except ValueError as e:
            return jsonify({'error': f'Invalid crop or soil type: {str(e)}'}), 400
        
        # Scale numerical features
        numerical_features = ['Temperature', 'Moisture', 'Rainfall', 'PH']  # Added moisture
        numerical_sample = fertilizer_scaler.transform(sample_df[numerical_features])
        categorical_sample = sample_df[['Crop', 'Soil']].values  # Changed from season to soil
        
        # Combine features
        sample_final = np.hstack((numerical_sample, categorical_sample))
        
        # Make prediction and get recommendations
        prediction = fertilizer_model.predict(sample_final)
        fertilizer_name = fertilizer_encoder.inverse_transform(prediction)[0]
        
        # Get fertilizer-specific recommendations
        # Update the fertilizer details reference to use input_data instead of data
        fertilizer_details = fertilizer_recommendations.get(fertilizer_name, {
            'application_rate': 'Standard application rate of 200-250 kg/ha',
            'timing': 'Apply as per local agricultural guidelines',
            'notes': f'Consult local agricultural expert for specific recommendations for {input_data["Crop"]}'
        })
        
        response = {
            'fertilizer': fertilizer_name,
            'application_rate': fertilizer_details['application_rate'],
            'timing': fertilizer_details['timing'],
            'notes': fertilizer_details['notes']
        }
        
        print("Response:", response)
        return jsonify(response)

    except Exception as e:
        print(f"Error during fertilizer prediction: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
