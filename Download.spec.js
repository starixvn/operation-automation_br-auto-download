import { test, expect } from '@playwright/test';

test.setTimeout(120000); // Set timeout to 2 minutes

test('test', async ({ page }) => {
  // Calculate date 5 days from now
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + 5);

  // Format date for the date picker (MM/DD/YYYY)
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const year = targetDate.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  // Get day name and format for option selection
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[targetDate.getDay()];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[targetDate.getMonth()];
  const dayWithSuffix = day + (day === '01' || day === '21' || day === '31' ? 'st' : day === '02' || day === '22' ? 'nd' : day === '03' || day === '23' ? 'rd' : 'th');
  const optionText = `Choose ${dayName}, ${monthName} ${dayWithSuffix},`;

  console.log(`Target date: ${formattedDate} (${optionText})`);

  // Go directly to the portal and let it redirect to login
  await page.goto('https://portal.betradar.com/');

  // Wait for login page to load
  await page.waitForSelector('input[name="username"], input[type="text"]', { timeout: 10000 });

  // Decode credentials from base64
  const username = Buffer.from('Um5kc3VreQ==', 'base64').toString('utf-8');
  const password = Buffer.from('UXExMjM0NTY=', 'base64').toString('utf-8');

  // Fill in credentials
  await page.fill('input[name="username"], input[type="text"]', username);
  await page.fill('input[name="password"], input[type="password"]', password);

  // Click sign in button
  await page.click('button[type="submit"], button:has-text("Sign in")');

  // Wait for the page to load after login
  await page.waitForTimeout(3000);

  // Handle Data Privacy cookie dialog
  console.log('Looking for Data Privacy dialog...');
  const acceptAllButton = page.getByText('ACCEPT ALL', { exact: true });

  try {
    await acceptAllButton.waitFor({ state: 'visible', timeout: 10000 });
    await acceptAllButton.click();
    console.log('Clicked ACCEPT ALL button');
    await page.waitForTimeout(2000); // Wait for dialog to close
  } catch (error) {
    console.log('Data Privacy dialog not found or already accepted');
  }
  // Click HOME button to open dropdown menu
  console.log('Clicking HOME button...');
  await page.getByRole('button', { name: 'HOME' }).click();
  await page.waitForTimeout(1000);

  // Click LIVE BOOKING CALENDAR from the menu
  console.log('Clicking LIVE BOOKING CALENDAR...');
  await page.getByRole('link', { name: 'LIVE BOOKING CALENDAR', exact: true }).click();
  await page.getByText('Export Matches').click();
  await page.waitForTimeout(1000);
  await page.getByText('Next').click();
  await page.waitForTimeout(1000);
  await page.getByText('range').click();
  await page.getByRole('textbox', { name: 'To date' }).click();

  // Try to select by option text first, fallback to direct input if not found
  try {
    await page.getByRole('option', { name: optionText }).click({ timeout: 3000 });
  } catch (error) {
    console.log('Option not found, trying direct input...');
    await page.getByRole('textbox', { name: 'To date' }).fill(formattedDate);
    await page.keyboard.press('Enter');
  }

  await page.getByText('Next').click();
  await page.waitForTimeout(1000);
  await page.getByText('csv').click();
  await page.locator('.switch').first().click();

  // Start waiting for download before clicking
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Download File').click();
  const download = await downloadPromise;

  // Save the downloaded file with timestamp
  const timestamp = today.toISOString().split('T')[0];
  const suggestedFilename = download.suggestedFilename();
  const filePath = `./downloads/${timestamp}_${suggestedFilename}`;
  await download.saveAs(filePath);
  console.log(`Downloaded: ${filePath}`);
});
