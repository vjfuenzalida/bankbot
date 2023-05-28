import { Locator, Page } from "playwright";

export class MainPage {
  readonly url =
    "https://mibanco.santander.cl/UI.Web.HB/Private_new/frame/#/private/main";

  readonly page: Page;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.locator('[mattooltip="Salir"]').first();
  }

  get onPage(): boolean {
    return this.page.url() === this.url;
  }

  async goto(): Promise<void> {
    if (!this.onPage) {
      console.log("Going to Main Page...");
      await this.page.goto(this.url);
    }

    await this.page.waitForLoadState("domcontentloaded");
    console.log("Main page loaded...");
  }

  async logout() {
    console.log("Logging out...");
    await this.logoutButton.click();
  }
}
