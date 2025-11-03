import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color output (cross-platform)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logBox(title) {
  const line = '='.repeat(60);
  console.log(`\n${colors.cyan}${line}${colors.reset}`);
  log(title, colors.bright);
  console.log(`${colors.cyan}${line}${colors.reset}\n`);
}

function logStep(step, total, message) {
  log(`[Step ${step}/${total}] ${message}`, colors.yellow);
  console.log('-'.repeat(60));
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

async function runCommand(command, description) {
  try {
    log(`Executing: ${command}`, colors.cyan);
    const { stdout, stderr } = await execAsync(command, {
      cwd: __dirname,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr && !stderr.includes('Debugger attached')) {
      console.error(stderr);
    }

    return true;
  } catch (error) {
    logError(`Execution failed: ${description}`);
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

async function main() {
  logBox('Betradar Automated Data Download & Processing System');

  const startTime = Date.now();

  // Step 1: Download data
  logStep(1, 2, 'Download Betradar Event Data');
  const downloadSuccess = await runCommand(
    'npx playwright test Download.spec.js',
    'Data Download'
  );

  if (!downloadSuccess) {
    logError('Download failed! Please check network connection or login credentials.');
    process.exit(1);
  }

  logSuccess('Data download completed!');
  console.log('');

  // Step 2: Process data
  logStep(2, 2, 'Process Data and Generate Excel Files');
  const processSuccess = await runCommand(
    'node process_data.js',
    'Data Processing'
  );

  if (!processSuccess) {
    logError('Data processing failed! Please check if CSV file exists.');
    process.exit(1);
  }

  logSuccess('Data processing completed!');
  console.log('');

  // Complete
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  logBox('All Tasks Completed Successfully!');
  log(`Total time: ${duration} seconds`, colors.green);
  console.log('');
  log('Output locations:', colors.bright);
  log('  → Downloaded files: downloads/', colors.cyan);
  log('  → Processed files: processed_data/', colors.cyan);
  console.log('');
}

// Execute main program
main().catch((error) => {
  logError('An unexpected error occurred during execution');
  console.error(error);
  process.exit(1);
});
