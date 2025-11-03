# Betradar Automated Data Download & Processing System

Automatically download Betradar event data and split it by date into Excel files.

## Features

1. **Auto Login** to Betradar Portal
2. **Auto Download** Live Booking Calendar data (5 days from today)
3. **Data Processing**:
   - Remove unnecessary columns
   - Group by date
   - Generate separate Excel files

## System Requirements

- Node.js v22+
- Playwright
- csv-parser
- xlsx

## Installation

```bash
npm install
```

## Usage

### Method 1: Cross-Platform Execution (Recommended) ⭐

#### Full Execution (Download + Process)

**Windows:**
```batch
run.bat
# or
npm start
```

**Linux/Mac:**
```bash
./run.sh
# or
npm start
```

**Universal (All Platforms):**
```bash
node main.js
```

This will execute in sequence:
1. Download latest event data
2. Process and split into date-based Excel files

### Method 2: Step-by-Step Execution

#### Download Data Only
```bash
npm run test
# or
npx playwright test Download.spec.js
```

#### Process Data Only
```bash
npm run process
# or
node process_data.js
```

### Method 3: Windows Batch Files

#### Silent Execution (No pause prompt)
```batch
run_silent.bat
```
Suitable for scheduled tasks or automated scripts

#### Download Data Only
```batch
download_only.bat
```

#### Process Data Only
```batch
process_only.bat
```
If you already have downloaded CSV files and only want to reprocess them

## Output

### Downloaded Raw Files
- Location: `downloads/`
- Format: `YYYY-MM-DD_Live-Calendar.csv`
- Example: `2025-10-30_Live-Calendar.csv`
- **Auto-Detection**: `process_data.js` will automatically process the latest CSV file

### Processed Files
- Location: `processed_data/`
- Format: `Bet2-DD-MM-YYYY.xlsx`
- Examples:
  - `Bet2-30-10-2025.xlsx` (2,503 rows)
  - `Bet2-31-10-2025.xlsx` (2,117 rows)
  - `Bet2-01-11-2025.xlsx` (1,979 rows)
  - etc...

## Kept Columns

The processed Excel files contain the following 9 columns:

1. EventId
2. Day
3. Date
4. Time
5. Sport
6. Category
7. Tournament
8. Event
9. Stream

## Removed Columns

The following columns are removed (consistent with the video processing):

- Unique Tournament
- Courtid
- Court
- Packages
- Covered from
- Age group
- AddOns
- LO/LD Booking status

## File Structure

```
betradar/
├── main.js                   # Main program (cross-platform) ⭐
├── run.bat                   # Windows startup script
├── run.sh                    # Linux/Mac startup script
├── run_silent.bat            # Windows silent execution version
├── download_only.bat         # Download only (Windows)
├── process_only.bat          # Process only (Windows)
├── Download.spec.js          # Playwright automation download script
├── process_data.js           # JavaScript data processing script
├── playwright.config.js      # Playwright configuration
├── package.json              # Node.js project configuration
├── downloads/                # Downloaded raw CSV files
├── processed_data/           # Processed Excel files
└── README.md                 # Documentation
```

## Configuration

### Modify Date Range

Edit in `Download.spec.js`:

```javascript
// Current: Download 5 days from today
targetDate.setDate(today.getDate() + 5);

// Change to download 10 days from today
targetDate.setDate(today.getDate() + 10);
```

### Modify Kept Columns

Edit in `process_data.js`:

```javascript
const columnsToKeep = [
  'EventId',
  'Day',
  'Date',
  // Add or remove columns...
];
```

## Smart Features

### Auto-Detect Latest File 🔍

`process_data.js` will automatically:
1. Scan all CSV files in the `downloads/` directory
2. Sort by modification time
3. Process the latest file

This means:
- ✅ No need to manually specify filename
- ✅ Process latest data directly after each download
- ✅ Can retain historical download records

If there are multiple files:
```
downloads/
├── 2025-10-30_Live-Calendar.csv  (older)
├── 2025-10-31_Live-Calendar.csv  ← Will process this one
└── 2025-11-01_Live-Calendar.csv  (if exists)
```

## Troubleshooting

### Login Failed
- Check if username and password are correct
- Confirm network connection is stable

### Download Failed
- Confirm date range is valid
- Check if Betradar Portal is working normally

### Processing Failed
- Confirm CSV file exists in `downloads/` directory
- Check if file format is correct
