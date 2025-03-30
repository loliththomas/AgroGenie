import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FertilizerResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const recommendation = location.state?.recommendation;
    const selectedCrop = location.state?.selectedCrop;  // Get the crop name

    if (!location.state || !recommendation) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-green-800 mb-6">No Recommendations Available</h1>
                    <p className="text-gray-600 mb-6">Please complete the fertilizer recommendation form first.</p>
                    <button
                        onClick={() => navigate('/fertilizer')}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                        Back to Fertilizer Form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-green-800 text-white py-4 px-8 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold">Fertilizer Recommendation</h1>
                </div>
            </div>

            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="space-y-6">
                            <div className="bg-green-50 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-green-800 mb-4">
                                    Recommended Fertilizer for {selectedCrop}
                                </h2>
                                <div className="text-xl font-semibold text-green-700 mb-2">
                                    {recommendation.fertilizer}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Application Rate
                                    </h3>
                                    <p className="text-gray-600">
                                        {recommendation.application_rate}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Application Timing
                                    </h3>
                                    <p className="text-gray-600">
                                        {recommendation.timing}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                    Additional Notes
                                </h3>
                                <p className="text-blue-600">
                                    {recommendation.notes}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/fertilizer')}
                                className="bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                            >
                                Make Another Recommendation
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gray-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}