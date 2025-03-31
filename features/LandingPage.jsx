// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaSeedling } from 'react-icons/fa';

// const Navbar = () => {
//     const navigate = useNavigate();
//     return (
//         <div className="flex justify-between items-center px-6 py-4">
//             <div className="flex items-center gap-4 text-[#141811]">
//                 <FaSeedling className="text-2xl text-green-600" />
//                 <h2 className="text-lg font-bold">AgriPredict</h2>
//             </div>
//             <div className="flex gap-8">
//                 <a href="#" className="text-sm font-medium">Solutions</a>
//                 <a href="#" className="text-sm font-medium">Resources</a>
//                 <a href="#" className="text-sm font-medium">About Us</a>
//                 <button onClick={() => navigate('/signup')} className="bg-[#8ce830] px-4 py-2 rounded-full text-sm font-bold">
//                     Sign Up
//                 </button>
//                 <button onClick={() => navigate('/login')} className="bg-[#f2f4f0] px-4 py-2 rounded-full text-sm font-bold">
//                     Log In
//                 </button>
//             </div>
//         </div>
//     );
// };
// const HeroSection = () => {
//     const navigate = useNavigate();
//     return (
//         <div className="px-4 md:px-8 flex justify-center py-8">
//             <div className="w-full max-w-[1200px] flex flex-col items-center">
//                 <div className="w-full min-h-[400px] flex flex-col gap-6 bg-cover bg-center p-8 items-center justify-center rounded-xl"
//                     style={{ 
//                         backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("src/images/farm-3d.jpg")`,
//                         backgroundPosition: 'center 30%'
//                     }}>
//                     <h1 className="text-white text-4xl md:text-5xl font-bold max-w-3xl text-center">
//                         AI-Driven Crop Yield Prediction
//                     </h1>
//                     <p className="text-white text-lg md:text-xl max-w-2xl text-center">
//                         Understand your future yields, optimize your operations and make data-driven decisions
//                     </p>
//                     <button 
//                         onClick={() => navigate('/login')}
//                         className="bg-[#8ce830] hover:bg-[#7ad628] px-8 py-3 rounded-full text-base font-bold transition-colors"
//                     >
//                         Get Started
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const FeaturesSection = () => (
//     <div className="w-full px-4 md:px-8 py-16">
//         <div className="max-w-[1200px] mx-auto">
//             <div className="flex flex-col items-center mb-12">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Key Features</h2>
//                 <p className="text-lg text-gray-600">Trusted by Farmers and Agribusinesses Worldwide</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {[
//                     "src/images/feature-1.jpg",
//                     "src/images/feature-2.jpg",
//                     "src/images/feature-3.jpg"
//                 ].map((img, index) => (
//                     <div key={index} 
//                         className="aspect-[16/9] rounded-xl overflow-hidden shadow-lg"
//                     >
//                         <img 
//                             src={img} 
//                             alt={`Feature ${index + 1}`}
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );




// export default function LandingPage() {
//     return (
        
//         <div className="flex flex-col bg-white">
//             <Navbar />
//             {/* <HeroSection />
//             <FeaturesSection /> */}

//         </div>
//     );
// }




// gemini

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSeedling } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <div className="flex items-center gap-3 text-[#141811]">
                <FaSeedling className="text-2xl text-green-600" />
                <h2 className="text-lg font-bold">AgriPredict</h2>
            </div>
            <div className="flex gap-6">
                <a href="#solutions" className="text-sm font-medium text-gray-700 hover:text-gray-900">Solutions</a>
                <a href="#resources" className="text-sm font-medium text-gray-700 hover:text-gray-900">Resources</a>
                <a href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900">About Us</a>
                <button onClick={() => navigate('/signup')} className="bg-[#8ce830] hover:bg-[#7ad628] px-4 py-2 rounded-full text-sm font-bold text-white transition-colors">
                    Sign Up
                </button>
                <button onClick={() => navigate('/login')} className="bg-[#f2f4f0] hover:bg-[#e6e8e3] px-4 py-2 rounded-full text-sm font-bold text-gray-700 transition-colors">
                    Log In
                </button>
            </div>
        </div>
    );
};

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="relative pt-6 pb-16 md:pb-20 lg:pb-24 xl:pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 bg-white shadow-xl sm:rounded-b-2xl lg:rounded-b-none">
                        <div className="px-4 sm:px-6 lg:max-w-2xl lg:px-8 xl:pr-0">
                            <div className="pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 xl:pt-24 xl:pb-40">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                    <span className="block xl:inline">AI-Driven Crop Yield</span>
                                    <span className="block text-green-600 xl:inline"> Prediction</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                                    Understand your future yields, optimize your operations and make data-driven decisions.
                                </p>
                                <div className="mt-5 sm:mt-8 flex lg:mt-12">
                                    <div className="rounded-md shadow">
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Hero Image - Adjust path as needed */}
                        <div className="hidden lg:block absolute top-0 right-0 bottom-0 left-1/2 -ml-24 overflow-hidden pointer-events-none" aria-hidden="true">
                            <img
                                src="src/images/farm-3d.jpg"
                                alt="AI-Driven Crop Yield Prediction"
                                className="absolute inset-0 w-full h-full object-cover rounded-l-2xl **rounded-r-2xl**"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeaturesSection = () => (
    <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center lg:max-w-lg">
                <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Key Features</h2>
                <p className="mt-2 text-base text-gray-500 sm:text-lg">Trusted by Farmers and Agribusinesses Worldwide</p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    "src/images/feature-1.jpg",
                    "src/images/feature-2.jpg",
                    "src/images/feature-3.jpg"
                ].map((img, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img
                            src={img}
                            alt={`Feature ${index + 1}`}
                            className="w-full h-48 object-cover"
                        />
                        {/* You can add descriptions below the images if needed */}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default function LandingPage() {
    return (
        
        <div className="bg-white">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
        </div>
        
    );
}