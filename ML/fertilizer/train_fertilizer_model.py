import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

# Create a synthetic dataset for fertilizer recommendations
np.random.seed(42)

# Generate synthetic data
n_samples = 1000
# Updated crop and fertilizer options
crops = [
    'Wheat', 'Rice', 'Maize', 'Potatoes', 'Soybeans', 'Sorghum', 
    'Cotton', 'Sugarcane', 'Tomatoes', 'Onions', 'Groundnut',
    'Chickpeas', 'Mustard', 'Turmeric', 'Garlic', 'Carrots',
    'Cabbage', 'Cauliflower', 'Peas', 'Beans'
]

seasons = ['Winter', 'Summer', 'Rainy', 'Spring']

fertilizers = [
    'NPK 10-26-26', 'NPK 14-35-14', 'NPK 17-17-17', 'NPK 20-20-0',
    'NPK 28-28-0', 'Urea', 'DAP', 'MOP', 'SSP', 'Ammonium Sulphate',
    'Calcium Nitrate', 'Zinc Sulphate', 'Borax', 'NPK 12-32-16',
    'NPK 19-19-19', 'NPK 15-15-15', 'Potassium Nitrate',
    'Magnesium Sulphate', 'NPK 13-0-45', 'Bone Meal',
    'Blood Meal', 'Fish Meal', 'Neem Cake', 'Vermicompost'
]

# Generate data without constraints
data = {
    'pH': np.random.uniform(0, 14, n_samples),  # Full pH scale
    'rainfall': np.random.uniform(0, 5000, n_samples),  # Wide rainfall range
    'temperature': np.random.uniform(-20, 50, n_samples),  # Wide temperature range
    'crop': np.random.choice(crops, n_samples),
    'season': np.random.choice(seasons, n_samples),
    'recommended_fertilizer': []
}

# Updated fertilizer recommendation logic
for i in range(n_samples):
    ph = data['pH'][i]
    rainfall = data['rainfall'][i]
    temp = data['temperature'][i]
    crop = data['crop'][i]
    
    if ph < 5.5:
        fertilizer = np.random.choice(['Calcium Nitrate', 'NPK 14-35-14', 'SSP'])
    elif ph > 7.5:
        fertilizer = np.random.choice(['Ammonium Sulphate', 'Zinc Sulphate', 'NPK 17-17-17'])
    elif rainfall < 500:
        fertilizer = np.random.choice(['DAP', 'NPK 20-20-0', 'MOP'])
    elif rainfall > 2000:
        fertilizer = np.random.choice(['Urea', 'NPK 12-32-16', 'NPK 19-19-19'])
    elif temp > 35:
        fertilizer = np.random.choice(['NPK 10-26-26', 'Borax', 'NPK 28-28-0'])
    else:
        fertilizer = np.random.choice(fertilizers)
    
    data['recommended_fertilizer'].append(fertilizer)

# Create DataFrame
df = pd.DataFrame(data)

# Prepare the model
X = df[['pH', 'rainfall', 'temperature']]
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Encode categorical variables
crop_encoder = LabelEncoder()
season_encoder = LabelEncoder()
fertilizer_encoder = LabelEncoder()

crop_encoded = crop_encoder.fit_transform(df['crop'])
season_encoded = season_encoder.fit_transform(df['season'])
y = fertilizer_encoder.fit_transform(df['recommended_fertilizer'])

# Combine features
X_final = np.column_stack([X_scaled, crop_encoded, season_encoded])

# Train Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_final, y)

# Save the model and encoders
joblib.dump(model, 'C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_model.pkl')
joblib.dump(scaler, 'C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_scaler.pkl')
joblib.dump(crop_encoder, 'C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_crop_encoder.pkl')
joblib.dump(season_encoder, 'C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_season_encoder.pkl')
joblib.dump(fertilizer_encoder, 'C:\\Users\\arunk\\Desktop\\cyp\\ML\\fertilizer\\fertilizer_output_encoder.pkl')

print("Model and encoders saved successfully!")