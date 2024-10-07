// // import React from 'react'

// // function ScanningEmail() {
// //   return (
// //     <>
// //     // This is a pop up that will appear when the gmail email is loaded in the browser, prompting the user to wait while the email is being scanned.
    
// //         <h2 className="text-2xl font-bold text-blue-800 mb-4">Email Scanner</h2>
// //         <div className="flex items-center justify-center w-full h-full">
// //             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
// //         </div>

// //     </>

// //   )
// // }

// // export default ScanningEmail

import React, { useState, useEffect } from 'react';
import { Mail, User, FileText, Brain, CheckCircle, Zap } from 'lucide-react';

const steps = [
  { icon: Mail, text: "Hmm, let's see what we've got here..." },
  { icon: User, text: "Ah, interesting sender. Let me look closer..." },
  { icon: FileText, text: "Now, what's the content all about?" },
  { icon: Brain, text: "Processing... This is quite intriguing!" },
  { icon: Zap, text: "Just connecting the dots..." },
  { icon: CheckCircle, text: "Alright, I think I've got it!" },
];

const ScanningEmail = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      setProgress((prev) => (prev < 100 ? prev + (100 / steps.length) : 100));
    }, 2666); // ~16 seconds total for 6 steps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-green-100 via-purple-100 to-fuchsia-100 flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-row p-8">
        {/* Left side: Spinning animation */}
        <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
          <div className="relative">
            <div className="animate-spin rounded-full h-48 w-48 border-t-4 border-b-4 border-indigo-500"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 transition-all duration-500 ${
                    index === currentStep ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                  }`}
                >
                  <step.icon className="w-24 h-24 text-indigo-500 " />
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right side: Messages */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
          <div className="bg-white bg-opacity-80 rounded-lg p-6 shadow-lg">
            <p className="text-indigo-700">{steps[currentStep].text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanningEmail;

// src/components/ScanningEmail.jsx
// import React, { useState, useEffect } from 'react';
// import { Mail, User, FileText, Brain, CheckCircle, Zap } from 'lucide-react';

// const steps = [
//   { icon: Mail, text: "Hmm, let's see what we've got here..." },
//   { icon: User, text: "Ah, interesting sender. Let me look closer..." },
//   { icon: FileText, text: "Now, what's the content all about?" },
//   { icon: Brain, text: "Processing... This is quite intriguing!" },
//   { icon: Zap, text: "Just connecting the dots..." },
//   { icon: CheckCircle, text: "Alright, I think I've got it!" },
// ];

// const ScanningEmail = () => {
//   const [currentStep, setCurrentStep] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
//     }, 2666); // ~16 seconds total for 6 steps

//     return () => clearInterval(interval);
//   }, []);

//   const CurrentIcon = steps[currentStep].icon;

//   return (
//     <div className="custom-info-card">
//       {/* Display the current step */}
//       <div className="flex items-center space-x-4">
//         <CurrentIcon className="w-12 h-12 text-indigo-500" />
//         <p className="text-indigo-700">{steps[currentStep].text}</p>
//       </div>
//     </div>
//   );
// };

// export default ScanningEmail;