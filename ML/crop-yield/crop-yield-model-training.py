import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, LSTM, concatenate
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import tensorflow as tf
from tensorflow.keras.saving import register_keras_serializable
import joblib
from sklearn.metrics import mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt

# Register custom loss for model saving
@register_keras_serializable()
class CustomMSE(tf.keras.losses.MeanSquaredError):
    pass

# Load and preprocess data
df = pd.read_csv('F:\\Study\\S8\\cyp\\ML\\Dataset\\soil-nutrients.csv')

# Create sequences of 5 temperatures for each crop
def create_sequences(data, n_steps=5):
    temp_sequences = []
    for i in range(len(data) - n_steps + 1):
        temp_sequences.append(data[i:i + n_steps])
    return np.array(temp_sequences)

# Group by crop and create temperature sequences
crops = df['Name'].unique()
temp_sequences = []
other_features = []
yields = []

for crop in crops:
    crop_data = df[df['Name'] == crop]
    temps = crop_data['Temperature'].values
    sequences = create_sequences(temps)
    
    # Repeat other features for each sequence
    n_sequences = len(sequences)
    temp_sequences.extend(sequences)
    
    # Get other features and yields
    other_features.extend(np.column_stack([
        crop_data['pH'].values[:n_sequences],
        crop_data['Rainfall'].values[:n_sequences],
        crop_data['Season'].values[:n_sequences]
    ]))
    
    # Create yield array for all crops
    yield_array = np.zeros((n_sequences, len(crops)))
    crop_idx = np.where(crops == crop)[0][0]
    yield_array[:, crop_idx] = crop_data['Yield'].values[:n_sequences]
    yields.extend(yield_array)

# Convert to numpy arrays
X_temp = np.array(temp_sequences)
X_other = np.array(other_features)
y = np.array(yields)

# Encode seasons
season_encoder = LabelEncoder()
X_other[:, 2] = season_encoder.fit_transform(X_other[:, 2])

# Scale numerical features
scaler = StandardScaler()
X_other_scaled = scaler.fit_transform(X_other)

# Split the data
X_temp_train, X_temp_test, X_other_train, X_other_test, y_train, y_test = train_test_split(
    X_temp, X_other_scaled, y, test_size=0.2, random_state=42
)

# Build the model
# Temperature input branch (LSTM)
temp_input = Input(shape=(5, 1))
lstm = LSTM(64)(temp_input)

# Other features branch
other_input = Input(shape=(3,))
dense1 = Dense(32, activation='relu')(other_input)

# Combine branches
combined = concatenate([lstm, dense1])
dense2 = Dense(128, activation='relu')(combined)
dense3 = Dense(64, activation='relu')(dense2)
output = Dense(len(crops), activation='linear')(dense3)

# Create and compile model
model = Model(inputs=[temp_input, other_input], outputs=output)
model.compile(optimizer=Adam(learning_rate=0.001), loss=CustomMSE())

# Train the model
early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

history = model.fit(
    [X_temp_train.reshape(-1, 5, 1), X_other_train],
    y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stopping],
    verbose=1
)

# Evaluate the model
test_loss = model.evaluate([X_temp_test.reshape(-1, 5, 1), X_other_test], y_test, verbose=0)
print(f"Test Loss: {test_loss}")

# Save the model and preprocessors
model.save('F:\\Study\\S8\\cyp\\ML\\crop-yield\\crop_yield_model.h5')
joblib.dump(scaler, 'F:\\Study\\S8\\cyp\\ML\\crop-yield\\scaler.pkl')
joblib.dump(season_encoder, 'F:\\Study\\S8\\cyp\\ML\\crop-yield\\season_encoder.pkl')

# Create a sample prediction function
def predict_top_crops(ph, rainfall, temperature_sequence, season):
    # Scale inputs (only pH and rainfall, temperature mean will be handled by LSTM)
    other_features = scaler.transform([[ph, rainfall, 0]])  # Add dummy value for scaling
    season_encoded = season_encoder.transform([season])
    
    # Create final feature array with correct shape (1, 3)
    other_features = np.column_stack([other_features[:, :2], season_encoded])  # Only take pH and rainfall
    
    # Reshape temperature sequence
    temp_seq = np.array(temperature_sequence).reshape(1, 5, 1)
    
    # Make prediction
    predictions = model.predict([temp_seq, other_features], verbose=0)[0]
    
    # Get top 3 crops
    top_3_indices = np.argsort(predictions)[-3:][::-1]
    top_3_crops = crops[top_3_indices]
    top_3_yields = predictions[top_3_indices]
    
    return list(zip(top_3_crops, top_3_yields))

# Save crop encoder for future reference
joblib.dump(crops, 'F:\\Study\\S8\\cyp\\ML\\crop-yield\\crop_encoder.pkl')

# Test the prediction function
sample_prediction = predict_top_crops(
    ph=6.5,
    rainfall=750,
    temperature_sequence=[20, 22, 21, 23, 22],
    season='Summer'
)

print("\nSample Prediction:")
for crop, yield_pred in sample_prediction:
    print(f"{crop}: {yield_pred:.2f}")

# After test_loss calculation
y_pred = model.predict([X_temp_test.reshape(-1, 5, 1), X_other_test])

# Calculate overall metrics
print("\nOverall Model Metrics:")
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)

print(f"MSE: {mse:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"MAE: {mae:.4f}")

# Plot training history and metrics
plt.figure(figsize=(12, 4))

# Plot 1: Training History
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss Over Time')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

# Plot 2: Actual vs Predicted
plt.subplot(1, 2, 2)
plt.scatter(y_test.flatten(), y_pred.flatten(), alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.title('Actual vs Predicted Yields')
plt.xlabel('Actual Yield')
plt.ylabel('Predicted Yield')

plt.tight_layout()
plt.savefig('f:\\Study\\S8\\Final Year Project\\cyp\\ML\\crop-yield\\model_performance.png')
plt.close()