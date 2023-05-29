import { chromium, Browser, Page } from "playwright";
import { LoginPage } from "./santander/LoginPage";
import Config from "./config";
import { MainPage } from "./santander/MainPage";
import { TutorialDialog } from "./santander/TutorialDialog";
import { BaseDialog, Period } from "./interfaces";
import { MovementsPage } from "./santander/MovementsPage";

// const watchers: BaseDialog[] = [];

// function setupWatchers(page: Page) {
//   const tutorialDialog = new TutorialDialog(page);
//   watchers.push(tutorialDialog);
// }

// function startWatchers() {
//   watchers.forEach((watcher) => watcher.start());
// }

// function stopWatchers() {
//   watchers.forEach((watcher) => watcher.stop());
// }

async function run() {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();

  // setupWatchers(page);
  // startWatchers();

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(Config.credentials);

  const mainPage = new MainPage(page);
  await mainPage.goto();

  const movementsPage = new MovementsPage(page);
  await movementsPage.goto();

  await movementsPage.clearDialogs();

  const period: Period = { month: 3, year: 2023 }
  await movementsPage.selectPeriod(period);

  await page.waitForTimeout(10000);

  await mainPage.logout();

  // stopWatchers();

  await browser.close();
}

run().catch((error) => console.error(error));
