# Google Sheets Integration for Portfolio Contact Form

This directory contains the Google Apps Script backend that connects your portfolio contact form to a Google Spreadsheet.

## Architecture & Data Flow

```
Visitor fills contact form
         │
         ▼
AJAX POST (fetch text/plain JSON)
         │
         ▼
Google Apps Script Web App (doPost)
   • LockService (Concurrency protection)
   • Honeypot Spam Verification
   • Input Validation (Name, Email regex, Message)
   • Formula Injection Sanitization (=, +, -, @)
         │
         ▼
Google Spreadsheet ("Portfolio Contact Form")
   • WorkSheet: "Submissions"
   • Columns: [ Name | Email | Message | Timestamp ]
         │
         ▼
JSON Response { status: "success", message: "..." }
         │
         ▼
Frontend shows confirmed success & resets form
```

## Setup Instructions

### 1. Create the Google Spreadsheet
1. Open [Google Sheets](https://sheets.new).
2. Name the spreadsheet: **`Portfolio Contact Form`**.
3. (Optional) Rename `Sheet1` to **`Submissions`** (or the script will automatically create it for you).

### 2. Add the Apps Script Code
1. In your spreadsheet, click **Extensions** &rarr; **Apps Script**.
2. Delete any default code in the editor (`myFunction`).
3. Open `Code.gs` from this directory, copy the entire code, and paste it into the editor.
4. Click the **Save** icon (Ctrl+S or Cmd+S).

### 3. Deploy as a Web App
1. At the top right of the Apps Script editor, click **Deploy** &rarr; **New deployment**.
2. Click the gear icon (**Select type**) &rarr; choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `Portfolio Contact Form API`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: allows visitors to submit without logging into Google)*
4. Click **Deploy**.

### 4. Authorize Access
1. Google will prompt: *"Authorization required"*. Click **Authorize access**.
2. Select your Google account.
3. If you see *"Google hasn't verified this app"*:
   - Click **Advanced** (bottom left).
   - Click **Go to Untitled project (unsafe)** (or your project name).
4. Click **Allow**.

### 5. Copy the Web App URL & Configure Portfolio
1. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).
2. Open `js/main.js` in your portfolio.
3. Locate line ~325:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
4. Replace the placeholder string with your copied URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
5. Save the file, commit, and push to deploy on Netlify.
