import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function startConsoleWithPuppeteer() {
  // const username = "mrisaina1";
  // const password = process.env.PYTHONANYWHERE_PASSWORD;

  // if (!username || !password) {
  //   console.log(username);
  //   console.log(password);
  //   console.error("Username or password is not defined.");
  //   return;
  // }

  // console.log(username);
  // console.log(password);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.pythonanywhere.com/login/");
  await delay(2000);

  await page.screenshot({ path: "login_page.png" });

  // Login
  console.log("Typing username and password...");
  await page.type('[name="auth-username"]', "mrisaina1");
  await page.type('[name="auth-password"]', "Aria9651!");
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
