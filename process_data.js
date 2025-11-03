import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';

/**
 * Process Betradar CSV file, simulating the Excel processing workflow from the video
 * 1. Delete unnecessary columns
 * 2. Split data by date
 * 3. Save each date's data as a separate Excel file
 */
async function processBetradarCSV(inputFile) {
  console.log(`Reading file: ${inputFile}`);

  // Define columns to keep (based on video analysis)
  const columnsToKeep = [
    'EventId',
    'Day',
    'Date',
    'Time',
    'Sport',
    'Category',
    'Tournament',
    'Event',
    'Stream'
  ];

  const allData = [];
  const dateGroups = {};

  // Read CSV file (handle BOM)
  await new Promise((resolve, reject) => {
    fs.createReadStream(inputFile)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, '') // Remove BOM
      }))
      .on('data', (row) => {
        allData.push(row);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  console.log(`Original data: ${allData.length} rows, ${Object.keys(allData[0]).length} columns`);
  console.log(`Original columns: ${Object.keys(allData[0]).join(', ')}`);

  // Filter columns and group by date
  allData.forEach((row) => {
    // Keep only needed columns
    const filteredRow = {};
    columnsToKeep.forEach((col) => {
      if (row[col] !== undefined) {
        filteredRow[col] = row[col];
      }
    });

    // Group by date
    const date = row['Date'];
    if (!dateGroups[date]) {
      dateGroups[date] = [];
    }
    dateGroups[date].push(filteredRow);
  });

  const allColumns = Object.keys(allData[0]);
  const deletedColumns = allColumns.filter(col => !columnsToKeep.includes(col));

  console.log(`\nKept columns: ${columnsToKeep.join(', ')}`);
  console.log(`\nDeleted columns (${deletedColumns.length}): ${deletedColumns.join(', ')}`);

  // Create output directory
  const outputDir = 'processed_data';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`\nFound ${Object.keys(dateGroups).length} different dates`);

  // Create separate Excel file for each date
  Object.entries(dateGroups).forEach(([dateStr, groupData]) => {
    // Parse date format DD/MM/YYYY
    let filename;
    try {
      const [day, month, year] = dateStr.split('/');
      filename = `Bet2-${day}-${month}-${year}.xlsx`;
    } catch (error) {
      filename = `Bet2-${dateStr.replace(/\//g, '-')}.xlsx`;
    }

    const filepath = `${outputDir}/${filename}`;

    // Create workbook
    const worksheet = xlsx.utils.json_to_sheet(groupData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Save as Excel file
    xlsx.writeFile(workbook, filepath);

    console.log(`  [OK] Saved ${filename}: ${groupData.length} rows`);
  });

  console.log(`\nComplete! Processed files saved to '${outputDir}' directory`);

  // Display summary statistics
  console.log(`\nSummary:`);
  console.log(`  - Original data: ${allData.length} rows`);
  console.log(`  - Original columns: ${allColumns.length}`);
  console.log(`  - Kept columns: ${columnsToKeep.length}`);
  console.log(`  - Deleted columns: ${deletedColumns.length}`);
  console.log(`  - Generated files: ${Object.keys(dateGroups).length}`);
}

/**
 * Find the latest CSV file in the downloads directory
 */
function getLatestCSVFile() {
  const downloadsDir = 'downloads';

  // Check if directory exists
  if (!fs.existsSync(downloadsDir)) {
    console.error(`Error: Directory '${downloadsDir}' not found`);
    return null;
  }

  // Read all files in directory
  const files = fs.readdirSync(downloadsDir)
    .filter(file => file.endsWith('.csv'))
    .map(file => ({
      name: file,
      path: `${downloadsDir}/${file}`,
      time: fs.statSync(`${downloadsDir}/${file}`).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // Sort by modification time in descending order

  if (files.length === 0) {
    console.error(`Error: No CSV files found in '${downloadsDir}' directory`);
    console.error('Please run the download script first: npm run test');
    return null;
  }

  return files[0].path;
}

// Main program
const inputFile = getLatestCSVFile();

if (inputFile) {
  console.log(`Found latest CSV file: ${inputFile}`);
  processBetradarCSV(inputFile).catch(console.error);
} else {
  process.exit(1);
}
