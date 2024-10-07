// import React from 'react';
// import { Shield, AlertTriangle, AlertOctagon, ChevronDown, Trash, Flag, CheckCircle } from 'lucide-react';

// const EmailScanResult = ({ scanResult }) => {
//   const {
//     classification,
//     subject,
//     sender,
//     senderEmail,
//     receivedDate,
//     score,
//     decision,
//     keywords
//   } = scanResult;

//   const getBackgroundColor = () => {
//     switch (classification) {
//       case 'Legitimate': return 'bg-green-100';
//       case 'Neutral': return 'bg-amber-100';
//       case 'Spam': return 'bg-red-100';
//       default: return 'bg-gray-100';
//     }
//   };

//   const getIcon = () => {
//     switch (classification) {
//       case 'Legitimate': return <Shield className="w-6 h-6 text-green-600" />;
//       case 'Neutral': return <AlertTriangle className="w-6 h-6 text-amber-600" />;
//       case 'Spam': return <AlertOctagon className="w-6 h-6 text-red-600" />;
//       default: return null;
//     }
//   };

//   return (
//     <div className={`w-full p-6 rounded-lg shadow-lg ${getBackgroundColor()}`}>
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center space-x-2">
//           {getIcon()}
//           <span className="text-lg font-semibold">{classification}</span>
//         </div>
//         <div className="text-right">
//           <div className="text-sm font-medium">Classification Score</div>
//           <div className="text-2xl font-bold">{score}%</div>
//         </div>
//       </div>

//       <h2 className="text-2xl font-bold mb-4">{subject}</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <p><strong>From:</strong> {sender} ({senderEmail})</p>
//           <p><strong>Received:</strong> {receivedDate}</p>
//         </div>
//         <div>
//           <p><strong>Decision:</strong> {decision}</p>
//           <p><strong>Key phrases:</strong> {keywords.join(', ')}</p>
//         </div>
//       </div>

//       <div className="flex justify-between items-center">
//         <div className="flex space-x-2">
//           <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
//             <CheckCircle className="w-4 h-4 inline mr-2" />
//             Mark as Safe
//           </button>
//           <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
//             <Trash className="w-4 h-4 inline mr-2" />
//             Delete
//           </button>
//           <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300">
//             <Flag className="w-4 h-4 inline mr-2" />
//             Report
//           </button>
//         </div>
//         <button className="text-gray-600 hover:text-gray-800 transition duration-300">
//           <ChevronDown className="w-6 h-6" />
//           More Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmailScanResult;

// src/components/EmailScanResult.jsx
import React from 'react';
import { Shield, AlertTriangle, AlertOctagon, ChevronDown, Trash, Flag, CheckCircle } from 'lucide-react';

const EmailScanResult = ({ scanResult }) => {
  const {
    classification,
    subject,
    sender,
    senderEmail,
    receivedDate,
    score,
    decision,
    keywords
  } = scanResult;

  const getBackgroundColor = () => {
    switch (classification) {
      case 'Legitimate': return 'bg-green-100';
      case 'Neutral': return 'bg-amber-100';
      case 'Spam': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getIcon = () => {
    switch (classification) {
      case 'Legitimate': return <Shield className="w-6 h-6 text-green-600" />;
      case 'Neutral': return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'Spam': return <AlertOctagon className="w-6 h-6 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className={`custom-info-card ${getBackgroundColor()}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="text-lg font-semibold">{classification}</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">Classification Score</div>
          <div className="text-2xl font-bold">{score}%</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{subject}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>From:</strong> {sender} ({senderEmail})</p>
          <p><strong>Received:</strong> {receivedDate}</p>
        </div>
        <div>
          <p><strong>Decision:</strong> {decision}</p>
          <p><strong>Key phrases:</strong> {keywords.join(', ')}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Mark as Safe
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
            <Trash className="w-4 h-4 inline mr-2" />
            Delete
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300">
            <Flag className="w-4 h-4 inline mr-2" />
            Report
          </button>
        </div>
        <button className="text-gray-600 hover:text-gray-800 transition duration-300">
          <ChevronDown className="w-6 h-6" />
          More Details
        </button>
      </div>
    </div>
  );
};

export default EmailScanResult;