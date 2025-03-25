import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FertilizerRecommendation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ph: '',
    rainfall: '',
    temperature: '',
    crop: '',
    season: ''
  });

  const crops = [
    'Wheat', 'Rice', 'Maize', 'Potatoes', 'Soybeans', 'Sorghum', 
    'Cotton', 'Sugarcane', 'Tomatoes', 'Onions', 'Groundnut',
    'Chickpeas', 'Mustard', 'Turmeric', 'Garlic', 'Carrots',
    'Cabbage', 'Cauliflower', 'Peas', 'Beans'
  ];

  const seasons = ['Winter', 'Summer', 'Rainy', 'Spring'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/fertilizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall),
          temperature: parseFloat(formData.temperature),
          crop: formData.crop,
          season: formData.season
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      navigate('/fertilizer-results', { state: { recommendation: result } });
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting fertilizer recommendation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Fertilizer Recommendation System
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* pH Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil pH
                </label>
                <input
                  type="number"
                  name="ph"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Rainfall Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Temperature Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Season Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Season</option>
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              {/* Crop Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Crop</option>
                  {crops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-200"
              >
                Get Fertilizer Recommendation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}