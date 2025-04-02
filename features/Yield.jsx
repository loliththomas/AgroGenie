import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Yield() {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results || [];

    // Chart configuration
    const chartData = {
        labels: results.map(item => item.crop),
        datasets: [
            {
                label: 'Predicted Yield (Tons/Hect)',
                data: results.map(item => item.yield),
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',  // green-600
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(34, 197, 94, 0.4)',
                ],
                borderColor: [
                    'rgb(21, 128, 61)',  // green-800
                    'rgb(21, 128, 61)',
                    'rgb(21, 128, 61)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Crop Yield Comparison',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Predicted Yield',
                },
            },
        },
    };

    // Keep your existing empty state handling
    if (!location.state || !location.state.results) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-green-800 mb-6">No Data Available</h1>
                    <p className="text-gray-600 mb-6">Please make a prediction first.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                        Go to Prediction Form
                    </button>
                </div>
            </div>
        );
    }

    if (!location.state || !results || results.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-green-800 mb-6">No Prediction Results</h1>
                    <p className="text-gray-600 mb-6">Please make a prediction first.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                        Back to Prediction Form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-green-800 text-green py-4 px-8 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold">Top 3 Recommended Crops</h1>
                </div>
            </div>

            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <Bar data={chartData} options={chartOptions} />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            {results.map((item, index) => (
                                <div key={index} className="bg-green-50 rounded-lg p-6 text-center">
                                    <div className="text-2xl font-bold text-green-800 mb-2">#{index + 1}</div>
                                    <div className="text-xl font-semibold text-gray-800 mb-3">{item.crop}</div>
                                    <div className="text-lg text-gray-600">
                                        Predicted Yield: <span className="font-bold">{item.yield.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('/prediction')}
                                className="bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                            >
                                Make Another Prediction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}