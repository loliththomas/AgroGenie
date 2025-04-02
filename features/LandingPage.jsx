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




// ajmin 

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSeedling } from 'react-icons/fa'
import './styles.css';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="navbar">
            <div className="logo">
                <FaSeedling className="icon" />
                <h2>AgroGenie</h2>
            </div>
            <div className="links">
                <a href="#solutions">Solutions</a>
                <a href="#resources">Resources</a>
                <a href="#about">About Us</a>
                <button onClick={() => navigate('/signup')} className="signup-btn">
                    Sign Up
                </button>
                <button onClick={() => navigate('/login')} className="login-btn">
                    Log In
                </button>
            </div>
        </div>
    );
};

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <div className="hero-section">
            <div className="content">
                <h1 className="heading">
                    <span>AI-Driven Crop Yield</span>
                    <span className="text-green-600"> Prediction</span>
                </h1>
                <p className="subheading">
                    Understand your future yields, optimize your operations and make data-driven decisions.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="cta-btn"
                >
                    Get Started
                </button>
            </div>
            <div className="hero-image">
            </div>
        </div>
    );
};

const FeaturesSection = () => (
    <div className="features-section">
        <div className="title">Key Features</div>
        <div className="subtitle">Trusted by Farmers and Agribusinesses Worldwide</div>
        <div className="feature-cards">
            {[
                "src/images/feature-1.jpg",
                "src/images/feature-2.jpg",
                "src/images/feature-3.jpg"
            ].map((img, index) => (
                <div key={index} className="feature-card">
                    <img
                        src={img}
                        alt={`Feature ${index + 1}`}
                    />
                </div>
            ))}
        </div>
    </div>
);

export default function LandingPage() {
    return (
        <div className="">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
        </div>
    );
}
