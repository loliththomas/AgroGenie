import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import json  # Add json import

# Load the dataset
df = pd.read_csv('F:\\Study\\S8\\cyp\\ML\\Dataset\\fertilizer_recommendation_dataset.csv')

# Prepare features (X) and target (y)
X = df[['Temperature', 'Moisture', 'Rainfall', 'PH', 'Soil', 'Crop']].copy()  # Add .copy()
y = df['Fertilizer'].values.ravel()  # Convert to 1d array

# Encode categorical variables
le_crop = LabelEncoder()
le_soil = LabelEncoder()
le_fertilizer = LabelEncoder()

# Transform categorical variables
X.loc[:, 'Crop'] = le_crop.fit_transform(X['Crop'])
X.loc[:, 'Soil'] = le_soil.fit_transform(X['Soil'])
y = le_fertilizer.fit_transform(y)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the numerical features
scaler = StandardScaler()
numerical_features = ['Temperature', 'Moisture', 'Rainfall', 'PH']  # Updated numerical features
X_train_numerical = scaler.fit_transform(X_train[numerical_features])
X_test_numerical = scaler.transform(X_test[numerical_features])

# Combine scaled numerical features with categorical features
X_train_categorical = X_train[['Crop', 'Soil']].values  # Changed from Season to Soil
X_test_categorical = X_test[['Crop', 'Soil']].values

X_train_final = np.hstack((X_train_numerical, X_train_categorical))
X_test_final = np.hstack((X_test_numerical, X_test_categorical))

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_final, y_train)

# Save the model and preprocessors
joblib.dump(model, 'fertilizer_model.joblib')
joblib.dump(scaler, 'fertilizer_scaler.joblib')
joblib.dump(le_crop, 'crop_encoder.joblib')
joblib.dump(le_soil, 'soil_encoder.joblib')  # Changed from season to soil
joblib.dump(le_fertilizer, 'fertilizer_encoder.joblib')

# Print accuracy
print(f"Model accuracy: {model.score(X_test_final, y_test):.2f}")

# Add fertilizer application information dictionary
fertilizer_recommendations = {
    'Balanced NPK Fertilizer': {
        'application_rate': '250-300 kg/ha',
        'timing': 'Apply in two split doses: 50% at sowing and 50% after 30 days',
        'notes': 'Provides balanced nutrition for overall crop growth. Best applied when soil moisture is adequate.'
    },
    'Urea': {
        'application_rate': '175-200 kg/ha',
        'timing': 'Apply in three split doses during the growing season',
        'notes': 'High nitrogen content. Avoid application during heavy rainfall. Keep soil moisture adequate.'
    },
    'DAP': {
        'application_rate': '150-200 kg/ha',
        'timing': 'Apply at sowing time or before planting',
        'notes': 'Rich in phosphorus. Best for root development and early crop growth stages.'
    },
    'Muriate of Potash': {
        'application_rate': '100-150 kg/ha',
        'timing': 'Apply in two splits: pre-planting and during flowering',
        'notes': 'High in potassium. Essential for fruit quality and stress resistance.'
    },
    'Compost': {
        'application_rate': '5-10 tons/ha',
        'timing': 'Apply 2-3 weeks before sowing',
        'notes': 'Improves soil structure and organic matter content. Good for long-term soil health.'
    },
    'Lime': {
        'application_rate': '2-4 tons/ha',
        'timing': 'Apply 2-3 months before planting',
        'notes': 'Used to raise soil pH in acidic soils. Apply based on soil test results.'
    },
    'Water Retaining Fertilizer': {
        'application_rate': '20-25 kg/ha',
        'timing': 'Mix with soil before sowing',
        'notes': 'Helps retain soil moisture. Particularly useful in dry conditions or sandy soils.'
    },
    'Organic Fertilizer': {
        'application_rate': '3-5 tons/ha',
        'timing': 'Apply 2-4 weeks before planting',
        'notes': 'Natural source of nutrients. Improves soil biology and long-term fertility.'
    },
    'Gypsum': {
        'application_rate': '200-500 kg/ha',
        'timing': 'Apply before land preparation',
        'notes': 'Helps improve soil structure and reduce soil pH in alkaline soils.'
    },
    'General Purpose Fertilizer': {
        'application_rate': '200-250 kg/ha',
        'timing': 'Apply in two splits: at sowing and during growth',
        'notes': 'Balanced nutrition suitable for most crops. Adjust rate based on soil test.'
    }
}

# Sample prediction matching the form inputs
sample_input = {
    'Temperature': 25.0,
    'Moisture': 45.0,
    'Rainfall': 200.0,
    'PH': 6.5,
    'Soil': 'Loamy Soil',
    'Crop': 'rice'
}

# Convert to DataFrame
# Sample prediction section
sample_df = pd.DataFrame([sample_input])

# Encode categorical variables
sample_df['Crop'] = le_crop.transform(sample_df[['Crop']])
sample_df['Soil'] = le_soil.transform(sample_df[['Soil']])  # Changed from Season to Soil

# Scale numerical features
numerical_sample = scaler.transform(sample_df[numerical_features])
categorical_sample = sample_df[['Crop', 'Soil']].values  # Changed from Season to Soil

# Combine features
sample_final = np.hstack((numerical_sample, categorical_sample))

# Make prediction
prediction = model.predict(sample_final)
fertilizer = le_fertilizer.inverse_transform(prediction)[0]
print("\nSample Input:")
print(sample_input)
print("\nRecommended Fertilizer:")
print(f"{fertilizer}")

def get_recommendation(input_data):
    """Generate fertilizer recommendation in the format required by the frontend"""
    # Create DataFrame from input
    sample_df = pd.DataFrame([input_data])
    
    # Encode categorical variables
    sample_df['Crop'] = le_crop.transform(sample_df[['Crop']])
    sample_df['Soil'] = le_soil.transform(sample_df[['Soil']])  # Changed from Season to Soil
    
    # Scale numerical features
    numerical_sample = scaler.transform(sample_df[numerical_features])
    categorical_sample = sample_df[['Crop', 'Soil']].values  # Changed from Season to Soil
    
    # Combine features
    sample_final = np.hstack((numerical_sample, categorical_sample))
    
    # Get prediction
    prediction = model.predict(sample_final)
    fertilizer_name = le_fertilizer.inverse_transform(prediction)[0]
    
    # Get fertilizer details
    fertilizer_details = fertilizer_recommendations.get(fertilizer_name, {
        'application_rate': 'Standard application rate of 200-250 kg/ha',
        'timing': 'Apply as per local agricultural guidelines',
        'notes': 'Consult local agricultural expert for specific recommendations'
    })
    
    return {
        'fertilizer': fertilizer_name,
        'application_rate': fertilizer_details['application_rate'],
        'timing': fertilizer_details['timing'],
        'notes': fertilizer_details['notes']
    }

# Save additional data
joblib.dump(fertilizer_recommendations, 'f:\\Study\\S8\\cyp\\ML\\fertilizer-model\\fertilizer_recommendations.joblib')

# Test the recommendation format
if __name__ == "__main__":
    sample_input = {
        'Temperature': 25.0,
        'Moisture': 45.0,
        'Rainfall': 200.0,
        'PH': 6.5,
        'Soil': 'Loamy Soil',
        'Crop': 'rice'
    }
    
    result = get_recommendation(sample_input)
    print("\nSample Recommendation:")
    print(json.dumps(result, indent=2))

# After model training, before saving
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Make predictions
y_pred = model.predict(X_test_final)

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

print("\nModel Performance Metrics:")
print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1 Score: {f1:.4f}")

# Create confusion matrix visualization
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=le_fertilizer.classes_,
            yticklabels=le_fertilizer.classes_)
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('f:\\Study\\S8\\Final Year Project\\cyp\\ML\\fertilizer-model\\confusion_matrix.png')
plt.close()