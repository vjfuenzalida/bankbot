import { Locator, Page } from "playwright";
import { LoginCredentials } from "../interfaces";

export class LoginPage {
  readonly url =
    "https://mibanco.santander.cl/UI.Web.HB/Private_new/frame/#/public/login";

  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel("Ingresa tu RUT");
    this.passwordInput = page.getByLabel("Ingresa tu clave");
    this.submitButton = page.getByRole("button", { name: "INGRESAR" });
  }

  get onPage(): boolean {
    return this.page.url() === this.url;
  }

  async goto(): Promise<void> {
    if (!this.onPage) {
      console.log("Going to Login Page...");
      await this.page.goto(this.url);
    }

    await this.page.waitForLoadState("domcontentloaded");
    console.log("Login Page loaded...");
  }

  async fillUsername(username: string) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
  }

  async fillForm(credentials: LoginCredentials) {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
  }

  async login(credentials: LoginCredentials) {
    await this.fillForm(credentials);
    await this.submitButton.click();
  }
}
