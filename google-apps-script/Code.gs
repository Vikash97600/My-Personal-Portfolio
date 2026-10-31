/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: PORTFOLIO CONTACT FORM BACKEND
 * ==============================================================================
 * Author: Vikash R. Chaurasiya Developer Portfolio
 * Target Sheet Columns: Name | Email | Message | Timestamp
 * 
 * This script runs as a Google Apps Script Web App bound to your Google Spreadsheet.
 * It receives form submissions via HTTP POST, validates inputs, sanitizes data to
 * prevent spreadsheet formula injection, handles concurrent requests safely using
 * LockService, and appends submissions to the 'Submissions' worksheet.
 * ==============================================================================
 */

// Target worksheet name within the Google Spreadsheet
var SHEET_NAME = 'Submissions';

// Target column headers (Row 1)
var SHEET_HEADERS = ['Name', 'Email', 'Message', 'Timestamp'];

/**
 * Handle HTTP GET Requests
 * Acts as a healthcheck endpoint so you can verify deployment directly in a browser.
 */
function doGet(e) {
  return createJsonResponse({
    status: 'success',
    message: 'Google Apps Script Web App for Vikash Portfolio Contact Form is active and listening for submissions.'
  });
}

/**
 * Handle HTTP POST Requests
 * Processes contact form submissions sent from the portfolio.
 */
function doPost(e) {
  // 1. Acquire Script Lock (Concurrency Protection)
  // Ensures simultaneous submissions do not overwrite each other or create race conditions.
  var lock = LockService.getScriptLock();
  
  try {
    // Wait up to 30 seconds for any running write operation to finish
    var lockAcquired = lock.tryLock(30000);
    if (!lockAcquired) {
      console.error('LockService timeout: Unable to acquire script lock within 30 seconds.');
      return createJsonResponse({
        status: 'error',
        message: 'The server is currently busy. Please wait a few seconds and try again.'
      });
    }

    // 2. Parse Incoming Payload
    // Supports both 'text/plain' JSON string bodies and standard form-urlencoded parameters
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = (e && e.parameter) ? e.parameter : {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // 3. Spam Honeypot Check
    // If the invisible honeypot field is filled, silently succeed without writing to sheet.
    var honeypot = payload._gotcha || payload.honeypot || payload.website || '';
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      console.warn('Spam submission detected and discarded via honeypot trap.');
      return createJsonResponse({
        status: 'success',
        message: 'Thank you! Your message has been received.'
      });
    }

    // 4. Server-Side Input Validation
    var rawName = (payload.name !== undefined && payload.name !== null) ? String(payload.name).trim() : '';
    var rawEmail = (payload.email !== undefined && payload.email !== null) ? String(payload.email).trim() : '';
    var rawMessage = (payload.message !== undefined && payload.message !== null) ? String(payload.message).trim() : '';

    if (!rawName) {
      return createJsonResponse({
        status: 'error',
        message: 'Name is required.'
      });
    }

    if (!rawEmail) {
      return createJsonResponse({
        status: 'error',
        message: 'Email address is required.'
      });
    }

    // Email format validation (RFC 5322 compatible regex)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      return createJsonResponse({
        status: 'error',
        message: 'Please provide a valid email address.'
      });
    }

    if (!rawMessage) {
      return createJsonResponse({
        status: 'error',
        message: 'Message cannot be empty.'
      });
    }

    // Length boundary sanity checks
    if (rawName.length > 100) {
      return createJsonResponse({
        status: 'error',
        message: 'Name exceeds maximum allowed length of 100 characters.'
      });
    }
    if (rawEmail.length > 150) {
      return createJsonResponse({
        status: 'error',
        message: 'Email exceeds maximum allowed length of 150 characters.'
      });
    }
    if (rawMessage.length > 5000) {
      return createJsonResponse({
        status: 'error',
        message: 'Message exceeds maximum allowed length of 5000 characters.'
      });
    }

    // 5. Formula Injection Protection (CSV / Spreadsheet Injection)
    // If user input starts with =, +, -, @, \t, or \r, prefix with a single quote (')
    // so Google Sheets treats it as static plain text rather than an executable formula.
    var sanitizedName = sanitizeForSpreadsheet(rawName);
    var sanitizedEmail = sanitizeForSpreadsheet(rawEmail);
    var sanitizedMessage = sanitizeForSpreadsheet(rawMessage);

    // 6. Access or Initialize Google Spreadsheet & Sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet found. Ensure the script is bound to a Google Spreadsheet.');
    }

    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      // Create worksheet if it does not exist yet
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    // Check if headers need initialization (empty sheet)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, SHEET_HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0D0F16');
      headerRange.setFontColor('#F5F5F7');
      sheet.setFrozenRows(1);
    }

    // 7. Generate Submission Timestamp
    var timezone = spreadsheet.getSpreadsheetTimeZone() || 'Asia/Kolkata';
    var formattedTimestamp = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd HH:mm:ss');

    // 8. Append Row to Sheet (Never overwrites existing records)
    sheet.appendRow([
      sanitizedName,
      sanitizedEmail,
      sanitizedMessage,
      formattedTimestamp
    ]);

    console.log('Successfully recorded contact submission from: ' + rawEmail + ' at ' + formattedTimestamp);

    return createJsonResponse({
      status: 'success',
      message: 'Thank you! Your message has been received.'
    });

  } catch (error) {
    console.error('Exception in doPost: ' + error.toString());
    return createJsonResponse({
      status: 'error',
      message: 'An internal error occurred while saving your message. Please try again later.'
    });
  } finally {
    // 9. Always Release Script Lock
    lock.releaseLock();
  }
}

/**
 * Neutralizes spreadsheet formula injection by prefixing risky characters with a single quote.
 */
function sanitizeForSpreadsheet(text) {
  if (typeof text !== 'string') return '';
  var trimmed = text.trim();
  // Check if string begins with =, +, -, @, tab, or carriage return
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return "'" + trimmed;
  }
  return trimmed;
}

/**
 * Helper to construct JSON response with ContentService
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
