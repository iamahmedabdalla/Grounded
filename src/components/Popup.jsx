import React from 'react';
import { Mail, User, Calendar, Link, Globe } from 'lucide-react';

const Popup = ({ emailData }) => {
  if (!emailData) return <div>No email data available</div>;
  return (
    <div className="w-full h-full bg-blue-50 p-6 overflow-y-auto w-[500px] h-[400px]">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Email Scanner</h2>
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="flex items-center space-x-2 text-blue-700">
          <Mail className="w-5 h-5" />
          <span className="font-semibold">Subject:</span>
          <span className="text-blue-600">{emailData.subject}</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-700">
          <User className="w-5 h-5" />
          <span className="font-semibold">From:</span>
          <span className="text-blue-600">{emailData.senderName} ({emailData.senderEmail})</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-700">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Date:</span>
          <span className="text-blue-600">{emailData.date}</span>
        </div>
        <div className="border-t border-blue-200 pt-2">
          <p className="font-semibold text-blue-700 mb-1">Body:</p>
          <p className="text-blue-600 text-sm">{emailData.body}</p>
        </div>
        <div className="border-t border-blue-200 pt-2">
          <div className="flex items-center space-x-2 text-blue-700 mb-1">
            <Link className="w-5 h-5" />
            <span className="font-semibold">URLs:</span>
          </div>
          <ul className="list-disc list-inside text-blue-600 text-sm space-y-1 overflow-y-auto">
            {emailData?.urls?.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ul>
        </div>
        <div className="border-t border-blue-200 pt-2">
          <div className="flex items-center space-x-2 text-blue-700 mb-1">
            <Globe className="w-5 h-5" />
            <span className="font-semibold">Unique Domains:</span>
          </div>
          <ul className="list-disc list-inside text-blue-600 text-sm">
            {emailData?.uniqueDomains?.map((domain, index) => (
              <li key={index}>{domain}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Popup;