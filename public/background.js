// console.log("background.js loaded");

// const LLM_API_URL = "http://localhost:11434/api/chat";
// const LLM_NAME = "gemma2:2b";

// // Function sending email data to an LLM for scanning
// const ScanEmailViaLLM = async (emailData) => {
//   await new Promise((resolve) => setTimeout(resolve, 100));

//   // Simple scam logic
//   // let isScam = emailData?.urls.length > 5 || emailData?.uniqueDomains.length > 3;
//   // let updatedEmailData = {
//   //   ...emailData,
//   //   results: isScam ? "scam" : "safe",
//   //   scanDate: new Date().toISOString(),
//   // };

//   const llmRequestPayload = {
//     model: LLM_NAME,
//     messages: [
//       {
//         role: "user",
//         content: `Please categorize the email as one of the following:

// 	1.	Legitimate (Safe): A normal, safe email with no signs of tricks or bad intent.
// 	2.	Neutral (Caution): A harmless but unclear email, such as marketing or newsletters that don’t show clear signs of being legitimate or harmful.
// 	3.	Spam/Scam (Dangerous): A suspicious email that might try to trick or cheat the recipient. This includes phishing (trying to steal information), scams, or other harmful content.

// When analyzing the email, consider these factors:

// - Examine everything: Look at the sender’s name, email domain (where the email comes from), subject line, message body, and any links inside the email.
// - Check the sender’s domain: If the email claims to be from a trusted company (like a bank, government, or official service) but uses a common domain like gmail.com or yahoo.com, it’s most likely a scam.
// - Mismatched information: If the sender’s email domain doesn’t match the organization they claim to represent, this is a big red flag.
// - Common scam tricks: Watch out for signs like requests for sensitive information, pressure to act immediately, or vague and impersonal language like “Dear Customer.”
// - Suspicious language: Pay attention to bad grammar, spelling errors, or strange sentences that don’t seem professional.
// - Urgent requests: Emails that push you to click a link, open an attachment, or provide personal details (like passwords or bank info) are likely to be scams.
// - Generic terms: If the sender doesn’t mention their company by name (e.g., using terms like “HR Department” or “Banking Service”), be suspicious.
// - If Sender Domain or Sender Email is not found in the email, consider it as a scam.
// - Don’t hesitate to classify as scam: If you’re unsure or something feels off, it’s safer to classify the email as spam/scam.


// Pay extra attention to:

// Mismatches between the sender's claimed identity and their email domain
// Requests for personal information, money, or urgent action
// Use of fear, threats, or excessive promises
// Unexpected attachments or requests to download files
// Links that lead to unfamiliar websites
// Impersonation of well-known companies, banks, or government agencies
// Vague or generic greetings and content


// After analyzing, provide your result in this format:

// Safety Rating: [Legitimate/Caution/Danger]


// Confidence: [0-100%]

// Top 3 Reasons:

// 	1.	[Most important reason]
// 	2.	[Second important reason]
// 	3.	[Third important reason]

// Explanation:

// [Briefly explain why you chose this classification, point to specific details from the email like sender, subject line, or links]

// Summary:

// [A short, simple summary of your analysis, focusing on why the email is Safe, Caution, or Danger, in easy-to-understand language]

// Remember, Emily:

// Use simple, friendly language as if you're explaining to a grandparent.
// Use very concise, clear and short sentences.
// Be confident in your assessment, but remind the user that you're an AI assistant and they should trust their instincts too.
// If you're unsure, it's better to err on the side of caution or danger.
// Encourage the user to reach out to the supposed sender through a known, trusted method like visiting the bank physically, if they're unsure about an email's legitimacy.
// Remind users never to share personal information, passwords, or financial details via email.

// Email for analysis:
// Subject: ${emailData.subject}
// From: ${emailData.senderName}
// Sender Domain: ${emailData.senderDomain}
// Date: ${emailData.date}
// Body:
// ${emailData.body}

// Additional Info:
// Other Domains Found: ${emailData.uniqueDomains}


// Final Note: Please remember to be cautious and thorough in your analysis. If you're unsure, it's better to classify the email as Caution or Danger. Very short and consise sentences are best.
// `,
//       },
//     ],
//     stream: false,
//   };

//   // Send email data to LLM API
//   try {
//     const response = await fetch(LLM_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(llmRequestPayload),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     } else {
//       const data = await response.json();
//       console.log("LLM API Response:", data);

//       let LLMPrediction = data.message.content;
//       let convertedLLMPrediction = convertMarkdownToHTML(LLMPrediction);

//       // Algorithm extracting message from llm to friendly format

//       // remove the spaces from the convertedLLMPrediction
//       let sanitisedLLMPrediction = convertedLLMPrediction.replace(/\s/g, " ");

//       // remove ** or <br> or <h1/h2> from the convertedLLMPrediction for the classification and confidence score
//       let removeBold = sanitisedLLMPrediction.replace(/<strong>|<\/strong>|<br>|<h1>|<\/h1>|<h2>|<\/h2>/g, "");

//       // get the classification and confidence score
//       let classification = removeBold.match(/Safety Rating: (Legitimate|Caution|Danger)/);
//       let confidence = removeBold.match(/Confidence: (\d+)/);
//       // get the summary until Recommendations
//       let summaryMatch = removeBold.match(/Summary: (.*?)Recommendations/);
//       let summary = summaryMatch ? summaryMatch[1] : "";

//       // Debug:
//       console.log("Classification:", classification?.[1]);
//       // console.log("Confidence:", confidence?.[1]);
//       console.log("Summary:", summary);



//       let updatedEmailData = {
//         ...emailData,
//         results: sanitisedLLMPrediction,
//         classification: classification?.[1],
//         confidence: confidence?.[1],
//         summary: summary?.[1],
//         scanDate: new Date().toISOString(),
//       };

//       return updatedEmailData;
//     }
//   } catch (error) {
//     console.error("Error in ScanEmailLLM:", error);
//     return { status: "Error", message: error.message };
//   }

//   // Debug:
//   // console.log('Scan Email LLM Function is Getting', emailData);
//   // console.log('Scan Email LLM Function Updated Data', updatedEmailData);

//   return updatedEmailData;
// };

// // Check if email is already stored
// async function CheckEmailFromStoredEmails(emailID, emailData) {
//   try {
//     // Retrieve storedEmails from storage
//     const result = await chrome.storage.local.get(["storedEmails"]);
//     let storedEmails = result.storedEmails || [];

//     // Check if the email is already stored
//     let email = storedEmails.find((email) => email.emailId === emailID);

//     if (email) {
//       // Email is already stored
//       await chrome.storage.local.set({
//         currentEmailId: emailID,
//       });
//       console.log("Email already stored", email);
//       return { status: "Success", data: email };
//     } else {
//       // Debug
//       console.log("Email is been sent to the LLM for analysis");

//       // Email is not stored; process it with ScanEmailLLM

//       const updatedEmailData = await ScanEmailViaLLM(emailData);

//       // Add the updated email data to storedEmails
//       storedEmails.push(updatedEmailData);

//       // Update storage with new storedEmails and currentEmailId
//       await chrome.storage.local.set({
//         storedEmails: storedEmails,
//         currentEmailId: emailID,
//       });
//       // Debug:
//       // console.log("New email stored", updatedEmailData);
//       return { status: "Success", data: updatedEmailData };
//     }
//   } catch (error) {
//     console.error("Error in CheckEmailFromStoredEmails:", error);
//     return { status: "Error", message: error.message };
//   }
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "foundThisEmail") {
//     if (message.data && message.data.emailId) {
//       const emailID = message.data.emailId;
//       const emailData = message.data;

//       // Call the async function and handle the Promise
//       CheckEmailFromStoredEmails(emailID, emailData)
//         .then((response) => {
//           sendResponse(response);
//           // Notify the popup that email data has been updated
//           chrome.runtime.sendMessage({ action: "emailDataUpdated" });
//         })
//         .catch((error) => {
//           sendResponse({ status: "Error", message: error.message });
//         });
//     } else {
//       sendResponse({ status: "Error", message: "Invalid email data" });
//     }
//     return true; // Keep the message channel open for sendResponse
//   } else if (message.action === "rescanThisEmail") {
//     if (message.data && message.data.emailId) {
//       const emailID = message.data.emailId;
//       const emailData = message.data;

//       // Call the async function and handle the Promise
//       ScanEmailViaLLM(emailData)
//         .then((response) => {
//           sendResponse(response);
//           // Notify the popup that email data has been updated
//           chrome.runtime.sendMessage({ action: "emailDataUpdated" });
//         })
//         .catch((error) => {
//           sendResponse({ status: "Error", message: error.message });
//         });
//     } else {
//       sendResponse({ status: "Error", message: "Invalid email data" });
//     }
//     return true; // Keep the message channel open for sendResponse
//   }
  
//   else if (message.action === "getStoredEmail") {
//     chrome.storage.local.get(["currentEmailId", "storedEmails"], (result) => {
//       const { currentEmailId, storedEmails } = result;
//       if (currentEmailId && storedEmails) {
//         const email = storedEmails.find(
//           (email) => email.emailId === currentEmailId
//         );

//         if (email) {
//           sendResponse({ status: "Success", data: email });
//         } else {
//           sendResponse({ status: "Error", message: "Email data not found" });
//         }
//       } else {
//         sendResponse({
//           status: "Error",
//           message: "No current emailId or storedEmails found",
//         });
//       }
//     });
//     return true; // Keep the message channel open for sendResponse
//   }
// });

// // converting llm message to HTML
// function convertMarkdownToHTML(markdown) {
//   // Convert headers
//   markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
//   markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
//   markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');
//   // Convert bold and italics
//   markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
//   markdown = markdown.replace(/\*(.*)\*/gim, '<em>$1</em>');
//   // Convert lists
//   markdown = markdown.replace(/^\s*[-]\s+(.*)/gim, '<li>$1</li>');
//   markdown = markdown.replace(/<\/li>\s*<li>/gim, '</li><li>');
//   markdown = markdown.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
//   // Convert links
//   markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
//   // Line breaks
//   markdown = markdown.replace(/\n/gim, '<br>');
//   return markdown.trim();
// }

//////////////////////// ================== //////////////////////////

console.log("background.js loaded");

const LLM_API_URL = "http://localhost:11434/api/chat";
const LLM_NAME = "gemma2:2b";

// Algorithm extracting message from llm to friendly format
function parseLLMResponse(LLMPrediction) {
  let convertedLLMPrediction = convertMarkdownToHTML(LLMPrediction);

  // Remove spaces
  let sanitisedLLMPrediction = convertedLLMPrediction.replace(/\s/g, " ");

  // Remove formatting tags
  let removeBold = sanitisedLLMPrediction.replace(
    /<strong>|<\/strong>|<br>|<h1>|<\/h1>|<h2>|<\/h2>/g,
    ""
  );

  // Extract classification, confidence, and summary
  let classificationMatch = removeBold.match(
    /Safety Rating: (Legitimate|Caution|Danger)/
  );
  let confidenceMatch = removeBold.match(/Confidence: (\d+)/);
  let summaryMatch = removeBold.match(/Summary: (.*?)Recommendations/);
  let summary = summaryMatch ? summaryMatch[1] : "";

  let classification = classificationMatch ? classificationMatch[1] : "";
  let confidence = confidenceMatch ? confidenceMatch[1] : "";

  return {
    sanitisedLLMPrediction,
    classification,
    confidence,
    summary,
  };
}

// Function sending email data to an LLM for scanning
const ScanEmailViaLLM = async (emailData) => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const llmRequestPayload = {
    model: LLM_NAME,
    messages: [
      {
        role: "user",
        content: `Please categorize the email as one of the following:

1.	Legitimate (Safe): A normal, safe email with no signs of tricks or bad intent.
2.	Neutral (Caution): A harmless but unclear email, such as marketing or newsletters that don’t show clear signs of being legitimate or harmful.
3.	Spam/Scam (Dangerous): A suspicious email that might try to trick or cheat the recipient. This includes phishing (trying to steal information), scams, or other harmful content.

When analyzing the email, consider these factors:

- Examine everything: Look at the sender’s name, email domain (where the email comes from), subject line, message body, and any links inside the email.
- Check the sender’s domain: If the email claims to be from a trusted company (like a bank, government, or official service) but uses a common domain like gmail.com or yahoo.com, it’s most likely a scam.
- Mismatched information: If the sender’s email domain doesn’t match the organization they claim to represent, this is a big red flag.
- Common scam tricks: Watch out for signs like requests for sensitive information, pressure to act immediately, or vague and impersonal language like “Dear Customer.”
- Suspicious language: Pay attention to bad grammar, spelling errors, or strange sentences that don’t seem professional.
- Urgent requests: Emails that push you to click a link, open an attachment, or provide personal details (like passwords or bank info) are likely to be scams.
- Generic terms: If the sender doesn’t mention their company by name (e.g., using terms like “HR Department” or “Banking Service”), be suspicious.
- If Sender Domain or Sender Email is not found in the email, consider it as a scam.
- Don’t hesitate to classify as scam: If you’re unsure or something feels off, it’s safer to classify the email as spam/scam.

Pay extra attention to:

Mismatches between the sender's claimed identity and their email domain
Requests for personal information, money, or urgent action
Use of fear, threats, or excessive promises
Unexpected attachments or requests to download files
Links that lead to unfamiliar websites
Impersonation of well-known companies, banks, or government agencies
Vague or generic greetings and content

After analyzing, provide your result in this format:

Safety Rating: [Legitimate/Caution/Danger]

Confidence: [0-100%]

Top 3 Reasons:

	1.	[Most important reason]
	2.	[Second important reason]
	3.	[Third important reason]

Explanation:

[Briefly explain why you chose this classification, point to specific details from the email like sender, subject line, or links]

Summary:

[A short, simple summary of your analysis, focusing on why the email is Safe, Caution, or Danger, in easy-to-understand language]

Remember, Emily:

Use simple, friendly language as if you're explaining to a grandparent.
Use very concise, clear and short sentences.
Be confident in your assessment, but remind the user that you're an AI assistant and they should trust their instincts too.
If you're unsure, it's better to err on the side of caution or danger.
Encourage the user to reach out to the supposed sender through a known, trusted method like visiting the bank physically, if they're unsure about an email's legitimacy.
Remind users never to share personal information, passwords, or financial details via email.

Email for analysis:
Subject: ${emailData.subject}
From: ${emailData.senderName}
Sender Domain: ${emailData.senderDomain}
Date: ${emailData.date}
Body:
${emailData.body}

Additional Info:
Other Domains Found: ${emailData.uniqueDomains}

Final Note: Please remember to be cautious and thorough in your analysis. If you're unsure, it's better to classify the email as Caution or Danger. Very short and consise sentences are best.
`,
      },
    ],
    stream: false,
  };

  // Send email data to LLM API
  try {
    const response = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(llmRequestPayload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      console.log("LLM API Response:", data);

      let LLMPrediction = data.message.content;

      // Parse LLM Response
      let {
        sanitisedLLMPrediction,
        classification,
        confidence,
        summary,
      } = parseLLMResponse(LLMPrediction);

      // Debug:
      console.log("Classification:", classification);
      console.log("Summary:", summary);

      let updatedEmailData = {
        ...emailData,
        results: sanitisedLLMPrediction,
        classification: classification,
        confidence: confidence,
        summary: summary,
        scanDate: new Date().toISOString(),
      };

      return { status: "Success", data: updatedEmailData };
    }
  } catch (error) {
    console.error("Error in ScanEmailLLM:", error);
    return { status: "Error", message: error.message };
  }
};

// Check if email is already stored
async function CheckEmailFromStoredEmails(emailID, emailData) {
  try {
    // Retrieve storedEmails from storage
    const result = await chrome.storage.local.get(["storedEmails"]);
    let storedEmails = result.storedEmails || [];

    // Check if the email is already stored
    let email = storedEmails.find((email) => email.emailId === emailID);

    if (email) {
      // Email is already stored
      await chrome.storage.local.set({
        currentEmailId: emailID,
      });
      console.log("Email already stored", email);
      return { status: "Success", data: email };
    } else {
      // Debug
      console.log("Email is being sent to the LLM for analysis");

      // Email is not stored; process it with ScanEmailLLM
      const response = await ScanEmailViaLLM(emailData);

      if (response.status === "Success") {
        const updatedEmailData = response.data;

        // Add the updated email data to storedEmails
        storedEmails.push(updatedEmailData);

        // Update storage with new storedEmails and currentEmailId
        await chrome.storage.local.set({
          storedEmails: storedEmails,
          currentEmailId: emailID,
        });

        return { status: "Success", data: updatedEmailData };
      } else {
        return { status: "Error", message: response.message };
      }
    }
  } catch (error) {
    console.error("Error in CheckEmailFromStoredEmails:", error);
    return { status: "Error", message: error.message };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "foundThisEmail") {
    if (message.data && message.data.emailId) {
      const emailID = message.data.emailId;
      const emailData = message.data;

      // Call the async function and handle the Promise
      CheckEmailFromStoredEmails(emailID, emailData)
        .then((response) => {
          sendResponse(response);
          // Notify the popup that email data has been updated
          chrome.runtime.sendMessage({ action: "emailDataUpdated" });
        })
        .catch((error) => {
          sendResponse({ status: "Error", message: error.message });
        });
    } else {
      sendResponse({ status: "Error", message: "Invalid email data" });
    }
    return true; // Keep the message channel open for sendResponse
  } else if (message.action === "rescanThisEmail") {
    if (message.data && message.data.emailId) {
      const emailID = message.data.emailId;
      const emailData = message.data;

      // Call the async function and handle the Promise
      ScanEmailViaLLM(emailData)
        .then(async (response) => {
          if (response.status === "Success") {
            const updatedEmailData = response.data;

            // Update storedEmails
            const result = await chrome.storage.local.get(["storedEmails"]);
            let storedEmails = result.storedEmails || [];

            // Remove old email data if exists
            storedEmails = storedEmails.filter(
              (email) => email.emailId !== emailID
            );

            // Add the updated email data to storedEmails
            storedEmails.push(updatedEmailData);

            // Update storage with new storedEmails
            await chrome.storage.local.set({
              storedEmails: storedEmails,
              currentEmailId: emailID,
            });

            sendResponse({ status: "Success", data: updatedEmailData });
            // Notify the popup that email data has been updated
            chrome.runtime.sendMessage({ action: "emailDataUpdated" });
          } else {
            sendResponse({ status: "Error", message: response.message });
          }
        })
        .catch((error) => {
          sendResponse({ status: "Error", message: error.message });
        });
    } else {
      sendResponse({ status: "Error", message: "Invalid email data" });
    }
    return true; // Keep the message channel open for sendResponse
  } else if (message.action === "getStoredEmail") {
    chrome.storage.local.get(["currentEmailId", "storedEmails"], (result) => {
      const { currentEmailId, storedEmails } = result;
      if (currentEmailId && storedEmails) {
        const email = storedEmails.find(
          (email) => email.emailId === currentEmailId
        );

        if (email) {
          sendResponse({ status: "Success", data: email });
        } else {
          sendResponse({ status: "Error", message: "Email data not found" });
        }
      } else {
        sendResponse({
          status: "Error",
          message: "No current emailId or storedEmails found",
        });
      }
    });
    return true; // Keep the message channel open for sendResponse
  }
});

// converting llm message to HTML
function convertMarkdownToHTML(markdown) {
  // Convert headers
  markdown = markdown.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  markdown = markdown.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  markdown = markdown.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  // Convert bold and italics
  markdown = markdown.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>");
  markdown = markdown.replace(/\*(.*)\*/gim, "<em>$1</em>");
  // Convert lists
  markdown = markdown.replace(/^\s*[-]\s+(.*)/gim, "<li>$1</li>");
  markdown = markdown.replace(/<\/li>\s*<li>/gim, "</li><li>");
  markdown = markdown.replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>");
  // Convert links
  markdown = markdown.replace(
    /\[(.*?)\]\((.*?)\)/gim,
    '<a href="$2" target="_blank">$1</a>'
  );
  // Line breaks
  markdown = markdown.replace(/\n/gim, "<br>");
  return markdown.trim();
}