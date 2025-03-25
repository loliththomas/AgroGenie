import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CropPrediction() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = React.useState({
        ph: '',
        rainfall: '',
        temperature: ['', '', '', '', ''], // Must be exactly 5 temperature values
        season: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTempChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            temperature: prev.temperature.map((t, i) => i === index ? value : t)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log('Sending data:', {
                ph: parseFloat(formData.ph),
                rainfall: parseFloat(formData.rainfall),
                temperature: formData.temperature.map(t => parseFloat(t)),
                season: formData.season
            });

            const response = await fetch('http://localhost:5001/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ph: parseFloat(formData.ph),
                    rainfall: parseFloat(formData.rainfall),
                    temperature: formData.temperature.map(t => parseFloat(t)),
                    season: formData.season
                })
            });

            const result = await response.json();
            console.log('Raw server response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Server error occurred');
            }

            if (!result.top_3_crops || !Array.isArray(result.top_3_crops)) {
                console.error('Invalid response format:', result);
                throw new Error('Invalid response format from server');
            }

            // In handleSubmit function
            console.log('Processing results:', result.top_3_crops);
                
            // Add this log before navigation
            console.log('Navigating to yield with data:', { 
                state: { results: result.top_3_crops } 
            });
            
            navigate('/yield', { 
                state: { results: result.top_3_crops }
            });
        } catch (error) {
            console.error('Detailed error:', error);
            if (error.message.includes('Failed to fetch')) {
                alert('Cannot connect to the server. Please ensure the Flask server is running on port 5001.');
            } else {
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
                    Smart Crop Yield Prediction
                </h1>
                
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                    <div className="space-y-6">
                        {/* pH Value */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="font-medium text-gray-700">Soil pH Level:</label>
                            <div className="md:col-span-2">
                                <input
                                    type="number"
                                    name="ph"
                                    value={formData.ph}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Rainfall */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="font-medium text-gray-700">Annual Rainfall:</label>
                            <div className="md:col-span-2 relative">
                                <input
                                    type="number"
                                    name="rainfall"
                                    value={formData.rainfall}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                    required
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">mm</span>
                            </div>
                        </div>

                        {/* Season */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="font-medium text-gray-700">Growing Season:</label>
                            <div className="md:col-span-2">
                                <select 
                                    name="season"
                                    value={formData.season}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                    required
                                >
                                    <option value="">Select Growing Season</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                </select>
                            </div>
                        </div>

                        {/* Temperature */}
                        <div className="space-y-4">
                            <label className="block font-medium text-gray-700">Temperature Records (°C):</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.temperature.map((temp, index) => (
                                    <div key={index} className="relative">
                                        <input
                                            type="number"
                                            value={temp}
                                            onChange={(e) => handleTempChange(index, e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                            placeholder={`Reading ${index + 1}`}
                                            step="0.1"
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">°C</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md"
                            >
                                Predict Crop Yield
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}