// src/contentScript/contentScript.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import ScanningEmail from '../components/ScanningEmail';
import EmailScanResult from '../components/EmailScanResult';

console.log('contentScript.js loaded');

// Function to extract email data from the page
const getEmailData = () => {
  let emailSubject = document.querySelector("h2.hP")?.textContent || "No subject found";
  let emailSenderName = document.querySelector("span.gD")?.textContent || "No sender found";
  let emailSenderEmail = document.querySelector("span.go")?.textContent || "No sender email found";
  let emailDate = document.querySelector("span.g3")?.textContent || "No date found";
  let emailBody = document.querySelector("div.a3s")?.textContent.trim().replace(/\s+/g, " ") || "No body found";

  // Only searching URLs in the email body
  let emailContentArea = document.querySelector("div.a3s");
  let emailURLsFound = emailContentArea ? emailContentArea.querySelectorAll(
    'a[href^="http"], a[href^="mailto"], a[href^="ftp"], a[href^="tel"], a[href^="sms"]'
  ) : [];

  // Unique Domain Names
  let uniqueDomainNames = new Set();
  emailURLsFound.forEach((a) => {
    let domainName = new URL(a.href).hostname;
    uniqueDomainNames.add(domainName);
  });

  // Return the email data
  return {
    subject: emailSubject,
    senderName: emailSenderName,
    senderEmail: emailSenderEmail,
    date: emailDate,
    body: emailBody,
    urls: Array.from(emailURLsFound).map((a) => a.href),
    uniqueDomains: Array.from(uniqueDomainNames),
  };
};


// Create a MutationObserver to wait for the email subject to load
const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector('h2.hP')) {
      // Stop observing once the email subject is found
      obs.disconnect();

      // Extract email data
      const emailData = getEmailData();

      // Send the email data to the background script
      chrome.runtime.sendMessage(
        { action: 'storeEmailData', data: emailData },
        (response) => {
          console.log('Email data sent to the background script', response);
        }
      );

      // Inject the React app into the page
      injectReactApp();
    }
  });

  // Start observing the document for changes
  observer.observe(document, { childList: true, subtree: true });

  function injectStyles() {
    const styleContent = `
      .custom-info-card {
        width: 97%;
        border-radius: 8px;
        margin: 10px 0;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        line-height: 1.6;
        transition: all 0.3s ease;
      }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = styleContent;
    document.head.appendChild(styleTag);
  }

  function injectReactApp() {
    // Check if the root div is already there
    if (document.getElementById('email-scanner-root')) return;

    // Create a root div
    const rootDiv = document.createElement('div');
    rootDiv.id = 'email-scanner-root';

    // Insert the root div into the Gmail UI
    const parentElement = document.querySelector('div.adn.ads'); // Main email content area
    if (parentElement) {
      parentElement.insertBefore(rootDiv, parentElement.firstChild);

      // Inject styles
      injectStyles();

      // Mount the React app
      const root = ReactDOM.createRoot(rootDiv);
      root.render(<App />);
    }
  }

  function App() {
    const [showScanning, setShowScanning] = React.useState(true);
    const [emailData, setEmailData] = React.useState(null);

    React.useEffect(() => {
      // Wait for 16 seconds, then show the EmailScanResult component
      const timer = setTimeout(() => {
        setShowScanning(false);
      }, 16000);

      return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
      // Get the email data from the background script
      chrome.runtime.sendMessage({ action: 'getEmailData' }, (response) => {
        if (response.data) {
          // For testing, provide default data
          setEmailData({
            classification: 'Legitimate',
            subject: response.data.subject,
            sender: response.data.senderName,
            senderEmail: response.data.senderEmail,
            receivedDate: response.data.date,
            score: 98,
            decision: 'Safe',
            keywords: ['purchase', 'order', 'confirmation'],
          });
        } else {
          // For testing purposes, use default data
          setEmailData({
            classification: 'Legitimate',
            subject: 'Re: Your recent purchase',
            sender: 'Amazon',
            senderEmail: 'info@amazon.com',
            receivedDate: '2021-10-15 12:00 PM',
            score: 98,
            decision: 'Safe',
            keywords: ['purchase', 'order', 'confirmation'],
          });
        }
      });
    }, []);

    return showScanning ? (
      <ScanningEmail />
    ) : emailData ? (
      <EmailScanResult scanResult={emailData} />
    ) : null;
  }
  