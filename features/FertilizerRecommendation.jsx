import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FertilizerRecommendation() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [formData, setFormData] = useState({
        ph: '',
        rainfall: '',
        temperature: '',
        moisture: '',
        soil: '',
        crop: ''
    });

    // Add useEffect to handle preselected crop
    useEffect(() => {
        if (location.state?.preselectedCrop) {
            setFormData(prev => ({
                ...prev,
                crop: location.state.preselectedCrop
            }));
        }
    }, [location.state]);

  const crops = [
    'rice', 'wheat', 'Mung Bean', 'Tea', 'millet', 'maize', 'Lentil', 'Jute', 'Coffee', 'Cotton', 'Ground Nut', 'Peas', 'Rubber', 'Sugarcane', 'Tobacco', 'Kidney Beans', 'Moth Beans', 'Coconut', 'Black gram', 'Adzuki Beans', 'Pigeon Peas', 'Chickpea', 'banana', 'grapes', 'apple', 'mango', 'muskmelon', 'orange', 'papaya', 'pomegranate', 'watermelon'
  ];

  const soilTypes = ['Loamy Soil' , 'Peaty Soil' , 'Acidic Soil' , 'Neutral Soil' , 'Alkaline Soil'];  // Replace seasons with soil types

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
          moisture: parseFloat(formData.moisture),  // Added moisture
          soil: formData.soil,                      // Changed from season to soil
          crop: formData.crop
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      navigate('/fertilizer-results', { 
        state: {
           recommendation: result,
           selectedCrop: formData.crop,
       } });
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

              {/* Add Moisture Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Moisture (%)
                </label>
                <input
                  type="number"
                  name="moisture"
                  step="0.1"
                  value={formData.moisture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Replace Season with Soil Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type
                </label>
                <select
                  name="soil"
                  value={formData.soil}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Soil Type</option>
                  {soilTypes.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>

              {/* Crop Selection - moved to same row */}
              <div>
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

            <div className="pt-8 flex justify-center">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-12 rounded-lg text-base font-semibold hover:bg-green-700 transition-all duration-200"
              >
                Get Recommendation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}