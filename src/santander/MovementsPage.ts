import { Locator, Page } from "playwright";
import { Period } from "../interfaces";
import moment from "moment";
import { TutorialDialog } from "./TutorialDialog";

export class MovementsPage {
  readonly url =
    "https://mibanco.santander.cl/UI.Web.HB/Private_new/frame/#/private/historico-tef/main/historico-tef";

  readonly page: Page;
  readonly transferMenuToggler: Locator;
  readonly transferMenuOption: Locator;
  readonly dateFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transferMenuToggler = page.locator("#mat-expansion-panel-header-1");
    this.transferMenuOption = page.getByText("Historial de transferencias");
    this.dateFilterButton = page.getByText("Buscar otro mes");
  }

  get onPage(): boolean {
    return this.page.url() === this.url;
  }

  async goto(): Promise<void> {
    if (!this.onPage) {
      console.log("Going to Movements Page...");
      await this.page.goto(this.url);
    }

    await this.page.waitForLoadState("domcontentloaded");
    console.log("Movements page loaded...");
  }

  private translateMonth(monthNumber: number): string {
    moment.locale("es");
    const monthLabel = moment().month(monthNumber).format("MMM").toUpperCase();
    return monthLabel;
  }

  async selectPeriod(period: Period) {
    console.log("Selecting period...");
    await this.dateFilterButton.click();

    const yearLabel = period.year.toString();
    const monthLabel = this.translateMonth(period.month);

    console.log(`Selecting ${monthLabel} ${yearLabel}...`);

    const yearButton = this.page.getByRole("gridcell", { name: yearLabel });
    const monthButton = this.page.getByText(monthLabel);

    await yearButton.click();
    await monthButton.click();
  }

  async getMovements() {
    const response = await this.page.waitForResponse(response => response.url().includes('/some_url/') && response.status() === 200);


  async clearDialogs() {
    const tutorialDialog = new TutorialDialog(this.page);
    await tutorialDialog.handle();
  }
}
