import { Locator, Page } from "playwright";
import Watcher from "../watcher";
import { BaseDialog } from "../interfaces";

export class TutorialDialog implements BaseDialog {
  readonly page: Page;
  readonly tutorialMask: Locator;
  readonly tutorialOverlay: Locator;
  readonly tutorialStartButton: Locator;
  readonly tutorialNextButton: Locator;
  readonly tutorialEndButton: Locator;

  private watcher?: Watcher;

  constructor(page: Page) {
    this.page = page;
    this.tutorialMask = page.locator(".guided-tour-user-input-mask");
    this.tutorialOverlay = page.locator(".cdk-overlay-container");
    this.tutorialStartButton = page.getByRole("button", { name: "Comencemos" });
    this.tutorialNextButton = page.getByText("Siguiente");
    this.tutorialEndButton = page.getByText("Terminar");
  }

  overlayVisible(): Promise<boolean> {
    return this.tutorialOverlay.isVisible();
  }

  maskVisible(): Promise<boolean> {
    return this.tutorialMask.isVisible();
  }

  async tutorialVisible(): Promise<boolean> {
    const overlayVisible = await this.tutorialOverlay.isVisible({ timeout: 100 });
    const maskVisible = await this.tutorialMask.isVisible({ timeout: 100 });
    return overlayVisible || maskVisible;
  }

  async startTutorial(): Promise<boolean> {
    try {
      await this.tutorialStartButton.click();
      console.log("Tutorial started...");
      return true;
    } catch (error) {
      return false;
    }
  }

  async completeStep(): Promise<boolean> {
    try {
      await this.tutorialNextButton.click();
      console.log("Tutorial step completed...");
      return true;
    } catch (error) {
      return false;
    }
  }

  async completeSteps(): Promise<void> {
    let visibleStep = true;

    try {
      while (visibleStep) {
        visibleStep = await this.tutorialNextButton.isVisible();
        if (!visibleStep) break;

        console.log("will complete step");
        await this.completeStep();
      }
    } catch (error) {
      console.log("Error completing tutorial step...", error);
      // dont handle
    }
  }

  async endTutorial(): Promise<boolean> {
    try {
      await this.tutorialEndButton.click();
      console.log("Tutorial ended...");
      return true;
    } catch (error) {
      return false;
    }
  }

  async handle() {
    const tutorialVisible = await this.tutorialVisible();
    if (!tutorialVisible) return;

    const shouldStart = await this.tutorialStartButton.isVisible();
    if (shouldStart) await this.startTutorial();

    const shouldContinue = await this.tutorialNextButton.isVisible();
    if (shouldContinue) await this.completeSteps();


    const shouldEnd = await this.tutorialEndButton.isVisible();
    if (shouldEnd) await this.endTutorial();
  }

  start(): void {
    const handler = async () => {
      await this.handle();
    };
    this.watcher = new Watcher(handler);
    this.watcher.watch();
  }

  stop(): void {
    if (!this.watcher) return;

    this.watcher.stop();
  }
}
