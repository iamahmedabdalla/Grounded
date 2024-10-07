console.log("contentScript.js loaded");


// Function to extract email data from the page
const getEmailData = () => {
  let emailSubject =
    document.querySelector("h2.hP")?.textContent || "No subject found";
  // let emailSenderName =
  //   document.querySelector("span.gD")?.textContent || "No sender found";
  // let emailSenderEmail =
  //   document.querySelector("span.go")?.textContent || "No sender email found";

  // getting email sender name and email
  let emailSenderName = document.querySelector(".gD")?.textContent || "Unknown sender";
  let emailSenderEmail = document.querySelector("span[email]")?.getAttribute("email") || "Unknown email";

  // Debug:
  console.log("Email Sender Name:", emailSenderName + " Email Sender Email:", emailSenderEmail);




  let emailDate =
    document.querySelector("span.g3")?.textContent || "No date found";
  let emailBody =
    document
      .querySelector("div.a3s")
      ?.textContent.trim()
      .replace(/\s+/g, " ") || "No body found";

  // Extracting URLs in the email body
  let emailContentArea = document.querySelector("div.a3s");
  let emailURLsFound = emailContentArea
    ? emailContentArea.querySelectorAll(
        // Feature:
        // expand to detect other clickable links of other common protocols
        'a[href^="http"], a[href^="https"], a[href^="mailto"], a[href^="ftp"], a[href^="tel"], a[href^="sms"]'
      )
    : [];

  // Unique Domain Names
  let uniqueDomainNames = new Set();
  emailURLsFound.forEach((a) => {
    let domainName = new URL(a.href).hostname;
    uniqueDomainNames.add(domainName);
  });

  // getting the sender domain
  let emailSenderDomain =  emailSenderEmail.split("@").pop().replace(">", "").split(".").slice(-2).join(".");


  let emailId = window.location.href.split("/").pop().split("?")[0];

  // Return the email data
  return {
    subject: emailSubject,
    senderName: emailSenderName,
    senderEmail: emailSenderEmail,
    date: emailDate,
    senderDomain: emailSenderDomain,
    body: emailBody,
    urls: Array.from(emailURLsFound).map((a) => a.href),
    uniqueDomains: Array.from(uniqueDomainNames),
    emailId: emailId,
  };
};

// first check if email is already scanned and stored in the local storage

// Function to create and inject the email details UI
const injectEmailScanningUI = () => {
  // Remove existing injected UI if any
  const existingUI = document.getElementById("injected-email-details");
  if (existingUI) {
    existingUI.remove();
  }

  // Creating scanning interface
  const container = document.createElement("div");
  container.id = "injected-email-details";
  container.style.cssText = `
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 97%;
        background-color: #fdff6e;
        border-radius: 15px;
        margin: 10px 0;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        line-height: 1.6;
        transition: all 0.3s ease;
    `;

  // Create the content
  const content = `
        <p>Scanning this email</p>
        <span class="loader">⌛</span>
    `;

  container.innerHTML = content;

  // Find the email content container and insert our UI before it
  const emailContainer = document.querySelector(".a3s.aiL");
  if (emailContainer) {
    emailContainer.parentNode.insertBefore(container, emailContainer);
  }
};

const injectEmailResultsUI = (emailData, results, scanDate, classification, confidence, status) => {
  const container = document.getElementById("injected-email-details");
  if (!container) return;

  container.style.backgroundColor = classification === "Danger" ? "#ffcdd2" : classification === "Caution" ? "#ffeb3b" : classification === "Legitimate" ? "#c8e6c9" : "#a4a1f7";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-start";

  injectStyles();

  const sanitiseHTML = (html) => {
    const temp = document.createElement("div");
    temp.textContent = html;
    return temp.innerHTML;
  };

  const content = `
   ${status === "Success" ? "": `<h3 class="email-suspicion suspicious">Email Not Scanned. Please try again</h3>`}
    <h2 class="email-subject">Subject: ${sanitiseHTML(emailData.subject)}</h2>
    <div class="email-summary">
      <p><strong>Classification:</strong> ${sanitiseHTML(classification)}</p>
      
      <p><strong>From Name:</strong> ${sanitiseHTML(emailData.senderName)}</p>
      <p><strong>From Email:</strong> ${sanitiseHTML(emailData.senderEmail)}</p>
      <p><strong>Scan Date:</strong> ${sanitiseHTML(new Date(scanDate).toLocaleString())}. But you received this email on <strong>${sanitiseHTML(emailData.date)}</strong></p>
    </div>
    <div class="toggle-section">
      <h3 class="toggle-header" data-target="analysis">LLM Analysis <span class="toggle-icon">▼</span></h3>
      <div class="toggle-content hidden" id="analysis">
        <p>${results}</p>
      </div>
    </div>
    <div class="toggle-section">
      <h3 class="toggle-header" data-target="content">Content Found <span class="toggle-icon">▼</span></h3>
      <div class="toggle-content hidden" id="content">
        <p>${sanitiseHTML(emailData.body)}</p>
      </div>
    </div>
    <div class="toggle-section">
      <h3 class="toggle-header" data-target="urls">URLs Found <span class="toggle-icon">▼</span></h3>
      <div class="toggle-content hidden" id="urls">
        <ul>
          ${(emailData.urls || [])
            .map(
              (url) =>
                `<li><a href="${sanitiseHTML(url)}" target="_blank">${sanitiseHTML(url)}</a></li>`
            )
            .join("")}
        </ul>
      </div>
    </div>
    <div class="toggle-section">
      <h3 class="toggle-header" data-target="domains">Unique Domains Found (${emailData.uniqueDomains.length})
        <span class="toggle-icon">▼</span>
      </h3>
      <div class="toggle-content hidden" id="domains">
        <ul>
          ${(emailData.uniqueDomains || [])
            .map((domain) => `<li>${sanitiseHTML(domain)}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
    <button id="toggle-highlight" class="highlight-button">Show/Hide Areas Scanned</button>
    <button id="rescan-button" class="rescan-button">Rescan Email</button>
   
  `;

  container.innerHTML = content;

  // Add event listeners for toggles
  const toggleHeaders = container.querySelectorAll(".toggle-header");
  toggleHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const targetId = header.dataset.target;
      const content = container.querySelector(`#${targetId}`);
      if (content) {
        content.classList.toggle("hidden");
        // Also change the arrow icon
        const icon = header.querySelector(".toggle-icon");
        if (icon) {
          icon.textContent = content.classList.contains("hidden") ? "▼" : "▲";
        }
      }
    });
  });

  const toggleButton = container.querySelector('#toggle-highlight');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      // Debug:
      // alert('Toggle button clicked');
      // const toggleSections = container.querySelectorAll('div.a3s');
      // Toggle the hidden class for each section
      const contentElements = document.querySelectorAll(
        'div.a3s'
      );
      contentElements.forEach((element) => {
        if (element.textContent.trim().length > 0) {
          element.style.backgroundColor = element.style.backgroundColor
            ? ""
            : "rgba(0, 128, 0, 0.2)";
        }
      });
    });
  }

  // Add event listener for rescan button
  const rescanButton = container.querySelector('#rescan-button');
  if (rescanButton) {
    rescanButton.addEventListener('click', () => {
      // Debug:
      // alert('Rescan button clicked');
      // Inject the email scanning UI
      injectEmailScanningUI();
      // Send email to background to check if email is already scanned
      function processEmailData(emailData) {
        try {
          chrome.runtime.sendMessage(
            { action: "rescanThisEmail", data: emailData },
            (response) => {
              //  show the results
              injectEmailResultsUI(emailData, response.data.results, response.data.scanDate, response.data.classification, response.data.confidence, response.status);
              console.log(
                "Email processed with response",
                response
              );
            }
          );
        } catch (error) {
          if (error.message.includes("Extension context invalidated")) {
            console.error("Extension context invalidated. Retrying...");
            setTimeout(() => processEmailData(emailData), 1000); // Retry after 1 second
          } else {
            console.error("An unexpected error occurred:", error);
          }
        }
      }
      // Start processing the email data
      processEmailData(emailData);
    });
  }

  
  



};

// Show errors if any

const injectErrorUI = (error) => {
  const container = document.getElementById("injected-email-details");
  if (!container) return;

  container.style.backgroundColor = "#ffcdd2";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-start";

  injectStyles();

  const content = `
    <h3 class="email-suspicion suspicious">Error: ${error.message}</h3>
  `;

  container.innerHTML = content;
}





// inject Styles
const injectStyles = () => {
  const styles = `
    #injected-email-details {
              width: 97%;
    border-radius: 8px;
    margin: 10px 0;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    line-height: 1.6;
    transition: all 0.3s ease;
      }
      #injected-email-details h2.email-subject {
          font-size: 16px;
          margin: 0;
      }
      #injected-email-details .email-summary {
          margin-top: 10px;
          font-size: 14px;
      }
      #injected-email-details .toggle-section {
          margin-top: 10px;
          border-top: 1px solid #eee;
      }
      #injected-email-details .toggle-header {
          cursor: pointer;
          margin: 10px 0;
          font-size: 14px;
          color: #007bff;
      }
      #injected-email-details .toggle-content.hidden {
          display: none;
      }
      #injected-email-details .toggle-content {
          margin-top: 5px;
      }
      #injected-email-details .highlight-button {
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
      }
      #injected-email-details .highlight-button:hover {
          background-color: #0056b3;
      }
      #injected-email-details .email-suspicion {
          margin-top: 10px;
          padding: 5px;
          font-size: 14px;
      }
      #injected-email-details .email-suspicion.suspicious {
          color: #ff0000;
      }
      #injected-email-details .email-suspicion.safe {
          color: #00ff00;
      }
      .processing-ui {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 97%;
          background-color: #fdff6e;
          border-radius: 15px;
          margin: 10px 0;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          line-height: 1.6;
          transition: all 0.3s ease;
      }
      .processing-ui .loader {
          font-size: 24px;
      }
    .rescan-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.rescan-button:hover {
  background-color: #0056b3;
}
  .scanned-highlight {
      background-color: yellow;
    }
  `;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
};

// Variable to store the last processed email ID
let lastProcessedEmailId = null;

// Function to handle email data changes
const handleEmailDataChange = () => {
  const emailData = getEmailData();

  if (emailData.emailId === lastProcessedEmailId) {
    return;
  }

  lastProcessedEmailId = emailData.emailId;

  // Inject the email scanning UI
  injectEmailScanningUI();

  // Send email to background to check if email is already scanned
  function processEmailData(emailData) {
    try {
      chrome.runtime.sendMessage(
        { action: "foundThisEmail", data: emailData },
        (response) => {
          //  show the results
          injectEmailResultsUI(emailData, response.data.results, response.data.scanDate, response.data.classification, response.data.confidence, response.status);
          console.log(
            "Email processed with response",
            response
          );
        }
      );
    } catch (error) {
      if (error.message.includes("Extension context invalidated")) {
        console.error("Extension context invalidated. Retrying...");
        setTimeout(() => processEmailData(emailData), 1000); // Retry after 1 second
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  // Start processing the email data
  processEmailData(emailData);
};

// Variable to store the current URL
let currentUrl = window.location.href;

// Function to check for URL changes
const checkUrlChange = () => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;

    // Wait for the DOM to update after URL change
    setTimeout(() => {
      if (document.querySelector("h2.hP")) {
        handleEmailDataChange();
      }
    }, 1000); // Delay of 1 second
  }
};

// Set up an interval to check for URL changes
setInterval(checkUrlChange, 500); // Check every 500ms


// utilities



