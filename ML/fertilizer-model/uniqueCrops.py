import pandas as pd

# Read the dataset
df = pd.read_csv('F:\\Study\\S8\\cyp\\ML\\Dataset\\fertilizer_recommendation_dataset.csv')

# Get unique crops
unique_crops = df['Crop'].unique()

# Print the unique crops and their count
print("Unique Crops in Dataset:")
print("------------------------")
for crop in unique_crops:
    count = df[df['Crop'] == crop].shape[0]
    print(f" '{crop}' ", end=',')