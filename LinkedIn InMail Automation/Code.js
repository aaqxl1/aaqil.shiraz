function processLinkedInReports() {
  const sheetID = "1AetehZUJ4H1Q-FL6M3J83sUB0tPL5YjJLOP0XnZcQL0";
  const senderEmail = "messages-noreply@linkedin.com";
  const subjectSearch = "Biweekly InMail Report";

  // Get the last processed thread ID from PropertiesService
  const properties = PropertiesService.getScriptProperties();
  const lastProcessedThreadId = properties.getProperty("LAST_PROCESSED_THREAD_ID");

  // Search for the email
  const threads = GmailApp.search(`from:${senderEmail} subject:"${subjectSearch}"`);
  if (threads.length === 0) {
    Logger.log("No emails found with the specified criteria.");
    return;
  }

  // Check if this thread is new
  const latestThread = threads[0]; // Most recent thread
  const latestThreadId = latestThread.getId();

  if (latestThreadId === lastProcessedThreadId) {
    Logger.log("No new emails to process.");
    return;
  }

  // Process the latest email
  const messages = latestThread.getMessages();
  const latestMessage = messages[messages.length - 1];

  // Save the latest thread ID to prevent reprocessing
  properties.setProperty("LAST_PROCESSED_THREAD_ID", latestThreadId);

  // Extract body content (HTML)
  const htmlBody = latestMessage.getBody();

  // Revised regex to find the download link
  const regex = /https:\/\/www\.linkedin\.com\/e\/v2\?urlhash=.*?&amp;t=plh/gi;
  const htmlMatch = htmlBody.match(regex);

  // Decode the HTML entities to get the proper URL
  const downloadLink = htmlMatch ? htmlMatch[0].replace(/&amp;/g, "&") : null;

  if (!downloadLink) {
    Logger.log("No download link found in the email.");
    return;
  }

  Logger.log("Download link: " + downloadLink);

  // Download the Excel file and save to Google Drive
  const response = UrlFetchApp.fetch(downloadLink);
  const blob = response.getBlob().setName("LinkedInReport.xlsx");
  const tempFile = DriveApp.createFile(blob);
  Logger.log("File uploaded to Drive with ID: " + tempFile.getId());

  // Convert the file to Google Sheets format
  const googleSheet = Drive.Files.insert(
    {
      title: tempFile.getName(),
      mimeType: MimeType.GOOGLE_SHEETS
    },
    tempFile.getBlob()
  );
  const googleSheetId = googleSheet.id;
  Logger.log("File converted to Google Sheets with ID: " + googleSheetId);

  const xlsxFile = SpreadsheetApp.openById(googleSheetId);
  const sheetsMap = {
    "InMail Insights": "Insights",
    "InMail-Seats": "Seats"
  };

  Object.entries(sheetsMap).forEach(([sourceSheetName, targetSheetName]) => {
    const sourceSheet = xlsxFile.getSheetByName(sourceSheetName);
    if (!sourceSheet) {
      Logger.log(`Sheet '${sourceSheetName}' not found in the downloaded file.`);
      return;
    }

    // Extract data from row 2 onward (skipping the header)
    const data = sourceSheet.getRange(2, 1, sourceSheet.getLastRow() - 1, sourceSheet.getLastColumn()).getValues();
    if (data.length > 0) {
      const targetSheet = SpreadsheetApp.openById(sheetID).getSheetByName(targetSheetName);
      if (targetSheet) {
        // Find the first blank cell in column A
        const lastRow = targetSheet.getRange("A:A").getValues().filter(String).length + 1;

        // Append new data starting from the first blank cell in column A
        targetSheet.getRange(lastRow, 1, data.length, data[0].length).setValues(data);
        Logger.log(`Data from '${sourceSheetName}' successfully appended to '${targetSheetName}'.`);

        if (targetSheetName === "Seats") {
          // Add 'Start Date' and 'End Date' columns for the appended rows
          const currentDate = new Date();
          const endDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
          const startDate = Utilities.formatDate(new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000), Session.getScriptTimeZone(), "yyyy-MM-dd");

          // Create 'Start Date' and 'End Date' arrays
          const startDateColumn = Array(data.length).fill([startDate]);
          const endDateColumn = Array(data.length).fill([endDate]);

          // Write 'Start Date' to column K and 'End Date' to column L
          targetSheet.getRange(lastRow, 11, data.length, 1).setValues(startDateColumn); // Column K
          targetSheet.getRange(lastRow, 12, data.length, 1).setValues(endDateColumn); // Column L
          Logger.log(`Start Date and End Date columns added for '${targetSheetName}'.`);
        }
      } else {
        Logger.log(`Target sheet '${targetSheetName}' not found.`);
      }
    }
  });

  // Clean up by deleting the temporary file and converted file
  DriveApp.getFileById(tempFile.getId()).setTrashed(true);
  DriveApp.getFileById(googleSheetId).setTrashed(true);
  Logger.log("Temporary and converted files deleted.");
}
