import {
  ICommandPlugin,
  ICommand,
  IShellSession,
} from "@/core/interfaces/ICommand";

export abstract class BasePlugin implements ICommandPlugin {
  abstract readonly id: string;
  abstract readonly version: string;
  abstract readonly commands: ReadonlyArray<ICommand>;
  protected shellSession?: IShellSession;

  async initialize(shellSession: IShellSession): Promise<void> {
    this.shellSession = shellSession;
    await this.onInitialize();
  }

  async terminate(): Promise<void> {
    await this.onTerminate();
    this.shellSession = undefined;
  }

  // Template methods for subclasses to override
  protected async onInitialize(): Promise<void> {}
  protected async onTerminate(): Promise<void> {}
}
