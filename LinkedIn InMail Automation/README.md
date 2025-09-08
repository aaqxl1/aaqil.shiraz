# LinkedIn InMail Automation

This folder contains the complete **LinkedIn InMail Automation** Apps Script project that automatically processes LinkedIn InMail reports by downloading Excel files from emails and integrating the data into Google Sheets.

## Downloaded Files

### Apps Script Files
- **Code.js** - Main automation script for LinkedIn report processing and data integration
- **appsscript.json** - Project configuration with Drive API integration
- **.clasp.json** - Local clasp configuration pointing to script ID: `1bu7ff4lEGrusu3Rb-DtZ6jtNjAmvzlEOAjtD_0e5B2g16ph1gPu66uEp`

## Project Overview

This is an **intelligent LinkedIn InMail report automation system** that streamlines the process of collecting and analyzing LinkedIn recruiting metrics by automatically processing biweekly reports.

## 🎯 Core Functionality

### Email Monitoring & Processing
1. **Gmail Integration**: Monitors for emails from `messages-noreply@linkedin.com`
2. **Subject Filtering**: Specifically targets "Biweekly InMail Report" emails
3. **Duplicate Prevention**: Uses PropertiesService to track processed emails and avoid reprocessing
4. **Automatic Detection**: Runs checks to identify new reports as they arrive

### File Processing Pipeline
1. **Download Automation**: Extracts download links from LinkedIn emails using regex pattern matching
2. **File Conversion**: Downloads Excel files and converts them to Google Sheets format
3. **Data Extraction**: Processes specific sheets from the LinkedIn reports
4. **Sheet Mapping**: Maps LinkedIn report sheets to target Google Sheets tabs
5. **Clean Processing**: Automatically removes temporary files after processing

### Data Integration
1. **Smart Appending**: Adds new data to existing Google Sheets without overwriting
2. **Date Tracking**: Automatically adds start and end date columns for reporting periods
3. **Multi-Sheet Support**: Handles both "InMail Insights" and "InMail-Seats" data
4. **Data Validation**: Checks for sheet existence and data validity before processing

## 📊 Data Sources & Targets

### LinkedIn Email Structure
- **Sender**: `messages-noreply@linkedin.com`
- **Subject**: "Biweekly InMail Report"
- **Content**: Contains Excel file download links with specific URL patterns
- **Download Pattern**: `https://www.linkedin.com/e/v2?urlhash=...&t=plh`

### Target Google Sheet
- **Sheet ID**: `1AetehZUJ4H1Q-FL6M3J83sUB0tPL5YjJLOP0XnZcQL0`
- **Insights Tab**: Stores LinkedIn InMail performance metrics
- **Seats Tab**: Tracks InMail seat usage with automatic date columns

### Sheet Mapping Configuration
```javascript
const sheetsMap = {
  "InMail Insights": "Insights",    // LinkedIn sheet → Target sheet
  "InMail-Seats": "Seats"          // LinkedIn sheet → Target sheet
};
```

## 🔧 Technical Implementation

### Advanced Features
- **HTML Parsing**: Extracts download links from HTML email content
- **URL Decoding**: Properly handles HTML entities in LinkedIn URLs
- **Drive API Integration**: Uses Google Drive API v2 for file conversion
- **Properties Persistence**: Maintains state between script executions
- **Error Handling**: Comprehensive logging and graceful failure handling

### Date Automation (Seats Sheet Only)
- **Start Date**: Automatically calculates as 14 days before processing date
- **End Date**: Uses current processing date
- **Format**: YYYY-MM-DD format in Asia/Dubai timezone
- **Columns**: Start Date (Column K), End Date (Column L)

### File Management
- **Temporary Storage**: Downloads files to Google Drive temporarily
- **Format Conversion**: Converts Excel to Google Sheets using Drive API
- **Automatic Cleanup**: Removes both original and converted files after processing
- **Memory Efficiency**: Minimizes storage usage through immediate cleanup

## 🚀 Automation Workflow

### Complete Process Flow
1. **Email Scan**: Searches Gmail for new LinkedIn InMail reports
2. **Duplication Check**: Compares against last processed thread ID
3. **Link Extraction**: Uses regex to find Excel download URL
4. **File Download**: Fetches Excel file from LinkedIn servers
5. **Drive Upload**: Creates temporary file in Google Drive
6. **Format Conversion**: Converts Excel to Google Sheets format
7. **Data Processing**: Extracts data from mapped sheets (skipping headers)
8. **Sheet Integration**: Appends data to appropriate target sheets
9. **Date Addition**: Adds tracking dates for Seats data
10. **Cleanup**: Removes temporary files and logs completion

### Function: `processLinkedInReports()`
This is the main automation function that should be triggered on a schedule.

## 📈 Data Processing Details

### Data Extraction Logic
- **Header Skipping**: Starts from row 2 to avoid header duplication
- **Dynamic Range**: Processes all available data regardless of row count
- **Smart Appending**: Finds first blank row in target sheet for new data
- **Column Mapping**: Preserves original column structure from LinkedIn reports

### Error Prevention
- **Sheet Validation**: Checks for sheet existence before processing
- **Data Validation**: Ensures data arrays are not empty
- **Thread Tracking**: Prevents reprocessing of the same email
- **Graceful Failures**: Continues processing even if individual sheets fail

## 🔗 Original Links

- **Apps Script Project**: https://script.google.com/home/projects/1bu7ff4lEGrusu3Rb-DtZ6jtNjAmvzlEOAjtD_0e5B2g16ph1gPu66uEp/edit
- **Target Google Sheet**: https://docs.google.com/spreadsheets/d/1AetehZUJ4H1Q-FL6M3J83sUB0tPL5YjJLOP0XnZcQL0/edit

## 💡 Usage

### Working with the Apps Script Code

To push changes back to Google Apps Script:
```bash
clasp push
```

To pull latest changes:
```bash
clasp pull
```

### Setting Up Automation

1. **Push your code**: `clasp push`
2. **Open the Apps Script project** in your browser
3. **Set up triggers**:
   - Function: `processLinkedInReports`
   - Event source: Time-driven
   - Type: Hours timer
   - Interval: Every 2-4 hours (to catch biweekly reports promptly)

### Manual Execution

To test or manually process reports:
1. Open the Apps Script IDE
2. Select the `processLinkedInReports` function
3. Click "Run" to execute immediately
4. Check logs for processing status and any issues

## ⚠️ Important Configuration

### Required Permissions
- **Gmail**: Read access to search and read emails
- **Drive**: Create, read, and delete files for temporary processing
- **Sheets**: Read and write access to target spreadsheet

### API Dependencies
- **Google Drive API v2**: Enabled for file format conversion
- **Gmail API**: For email searching and content extraction
- **Spreadsheet API**: For data manipulation and appending

## 🎯 Business Impact

This automation system provides significant value by:

### ⏰ Time Savings
- **Eliminates Manual Processing**: No more downloading and importing files manually
- **Instant Processing**: Reports are processed as soon as they arrive
- **Consistent Execution**: Runs reliably without human intervention

### 📊 Data Integrity
- **No Data Loss**: Automated processing prevents missed reports
- **Consistent Formatting**: Standardized date tracking and data structure
- **Error Prevention**: Duplicate detection prevents data corruption

### 📈 Analytics Enhancement
- **Historical Tracking**: Automatic date columns enable trend analysis
- **Real-time Updates**: Data is available for analysis immediately after LinkedIn sends reports
- **Centralized Data**: All InMail metrics consolidated in one accessible location

This system transforms a manual, error-prone process into a seamless, automated workflow that ensures LinkedIn recruiting metrics are always up-to-date and analysis-ready! 🚀
