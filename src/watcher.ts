export type WatcherHandler = () => Promise<void>;

export default class Watcher {
  private handler: WatcherHandler;
  private intervalId: NodeJS.Timeout | null;
  private isRunning: boolean;

  constructor(handler: WatcherHandler) {
    this.handler = handler;
    this.intervalId = null;
    this.isRunning = false;
  }

  watch(interval = 1000): void {
    if (this.intervalId) {
      throw new Error('Watcher is already running');
    }

    this.intervalId = setInterval(async () => {
      await this.run();
    }, interval);
  }

  async run(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;

    try {
      await this.handler();
    } catch (error) {
      // dont handle
    }

    this.isRunning = false;
  }

  stop(): void {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
  }
}
