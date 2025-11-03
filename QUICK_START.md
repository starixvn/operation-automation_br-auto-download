# Quick Start Guide

## 🚀 Simplest Way to Use

### Windows Users

1. Double-click `run.bat`
2. Wait for execution to complete
3. Check `processed_data\` folder

Or execute in Command Prompt/PowerShell:
```batch
npm start
```

### Linux/Mac Users

Execute in terminal:
```bash
./run.sh
```

Or:
```bash
npm start
```

### Universal Method (All Platforms)

```bash
node main.js
```

---

## 📋 Execution Flow

```
┌─────────────────────────────────────┐
│  Step 1: Download Betradar Data    │
│  → Auto login                       │
│  → Select date range (5 days ahead) │
│  → Download CSV file                │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Step 2: Process Data               │
│  → Remove unnecessary columns       │
│  → Group by date                    │
│  → Generate Excel files             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Complete!                          │
│  → downloads/ (Raw CSV)             │
│  → processed_data/ (Excel files)    │
└─────────────────────────────────────┘
```

---

## 📂 Output Locations

- **downloads/** - Downloaded raw CSV files
- **processed_data/** - Date-split Excel files

---

## 🔧 Advanced Usage

### Download Data Only

```bash
npm run test
```

### Process Already Downloaded Data

```bash
npm run process
```

---

## 🔄 Set Up Automated Scheduling

### Windows (Task Scheduler)

1. Open "Task Scheduler"
2. Create Basic Task
3. Trigger: Every day at 9:00 AM
4. Action: Start a program
   - Program: `node`
   - Arguments: `main.js`
   - Start in: Project folder path

### Linux/Mac (crontab)

```bash
# Edit crontab
crontab -e

# Add schedule (run every day at 9:00 AM)
0 9 * * * cd /path/to/betradar && node main.js >> logs/cron.log 2>&1
```

---

## ❓ FAQ

**Q: Error during execution?**

A: Please confirm:
- Node.js is installed (v22+)
- Ran `npm install`
- Network connection is stable
- Betradar account credentials are correct

**Q: Want to change the download date range?**

A: Edit in `Download.spec.js`:
```javascript
targetDate.setDate(today.getDate() + 5); // Change to your desired number of days
```

**Q: Want to modify the kept columns?**

A: Edit the `columnsToKeep` array in `process_data.js`

---

## 📖 Detailed Documentation

For complete instructions, please refer to [README.md](README.md)
