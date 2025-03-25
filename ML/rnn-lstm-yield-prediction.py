
import numpy as np
import pandas as pd
import joblib  # Import joblib for saving and loading encoders and scaler
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, LSTM, Dense, Concatenate
from tensorflow.keras.saving import register_keras_serializable
from tensorflow.keras.losses import MeanSquaredError


@register_keras_serializable()
class CustomMSE(MeanSquaredError):
    pass

# Load dataset
# Update this line to use the correct path
data = pd.read_csv("Dataset/yield_df.csv")

# Define constants
time_steps = 5  # Number of past temperature readings used in LSTM
n_seasons = data["Season"].nunique()  # Number of unique seasons
n_crops = data["Name"].nunique()  # Number of unique crops

# Normalize numeric features
scaler = MinMaxScaler()
data[['pH', 'Temperature', 'Rainfall', 'Yield']] = scaler.fit_transform(data[['pH', 'Temperature', 'Rainfall', 'Yield']])

# Save the scaler for later use in the Flask app
joblib.dump(scaler, 'scaler.pkl')  # Save the scaler

# Encode categorical features
season_encoder = OneHotEncoder(sparse_output=False)
season_encoded = season_encoder.fit_transform(data[['Season']])

crop_encoder = OneHotEncoder(sparse_output=False)
crop_encoded = crop_encoder.fit_transform(data[['Name']])  # One-hot encoding for crops

# Save the encoders for later use
joblib.dump(season_encoder, 'season_encoder.pkl')
joblib.dump(crop_encoder, 'crop_encoder.pkl')

# Prepare inputs
X_soil_ph = data[['pH']].values
X_rainfall = data[['Rainfall']].values
X_temperature = data[['Temperature']].values
X_season = season_encoded
y_yield = crop_encoded * data[['Yield']].values  # Yield per crop

# Handle time-series input for LSTM
X_temp_series = []
for i in range(len(X_temperature) - time_steps):
    X_temp_series.append(X_temperature[i:i + time_steps])

X_temperature = np.array(X_temp_series).reshape(-1, time_steps, 1)  # Reshape for LSTM

# Trim all inputs to match LSTM input size
valid_samples = X_temperature.shape[0]
X_soil_ph = X_soil_ph[:valid_samples]
X_rainfall = X_rainfall[:valid_samples]
X_season = X_season[:valid_samples]
y_yield = y_yield[:valid_samples]

# Define Input layers
soil_ph_input = Input(shape=(1,), name="pH")
rainfall_input = Input(shape=(1,), name="Rainfall")
temperature_input = Input(shape=(time_steps, 1), name="Temperature")  # Time-series data
season_input = Input(shape=(n_seasons,), name="Season")  # One-hot encoded

# LSTM for temperature
lstm_output = LSTM(64, return_sequences=False)(temperature_input)

# Concatenate all inputs
merged = Concatenate()([soil_ph_input, rainfall_input, lstm_output, season_input])

# Dense layers
x = Dense(128, activation='relu')(merged)
x = Dense(64, activation='relu')(x)
x = Dense(32, activation='relu')(x)

# Output layer (predict yield for all crops)
output = Dense(n_crops, activation='linear')(x)

# Build model
model = Model(inputs=[soil_ph_input, rainfall_input, temperature_input, season_input], outputs=output)
model.compile(optimizer='adam', loss=CustomMSE(), metrics=['mae'])

# Train the model
history = model.fit(
    [X_soil_ph, X_rainfall, X_temperature, X_season],
    y_yield,
    epochs=50,
    batch_size=32,
    validation_split=0.2
)

# Saving the trained model
model.save('crop_yield_model.h5')
model.summary()
