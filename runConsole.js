import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

const username = process.env.PYTHONANYWHERE_USERNAME;
const password = process.env.PYTHONANYWHERE_PASSWORD;
const fileName = `/home/${username}/tg-bot-inf.py`;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function startConsoleWithPuppeteer() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Step 1: Navigate to PythonAnywhere login page
  await page.goto("https://www.pythonanywhere.com/login/");

  // Login
  await page.type('[name="auth-username"]', username);
  await page.type('[name="auth-password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  console.log("Logged in successfully");

  await page.goto(`https://www.pythonanywhere.com/user/${username}/consoles/`);
  await page.waitForNetworkIdle();

  await page.click(".item_remove_link");
  console.log("First console deleted");

  await page.click("#id_files_link");
  await page.waitForNetworkIdle();

  await page.click('[title="tg-bot-inf.py"]');
  await page.waitForNetworkIdle();
  await page.click(".run_button");
  console.log("New console started");
  await delay(6000);

  await browser.close();
}

// Run the function
startConsoleWithPuppeteer().catch(console.error);
