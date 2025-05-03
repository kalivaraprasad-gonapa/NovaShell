import { LocalStorageConfigProvider } from "../../core/config/LocalStorageConfigProvider";

export interface TerminalConfig {
  promptSymbol: string;
  historySize: number;
  showLineNumbers: boolean;
  tabCompletionEnabled: boolean;
  showTimestamps: boolean;
  shellWidth: "normal" | "wide" | "full";
}

export class TerminalConfigProvider extends LocalStorageConfigProvider<TerminalConfig> {
  readonly id = "terminal";
  readonly description = "Terminal display and behavior settings";
  readonly defaultConfig: TerminalConfig = {
    promptSymbol: "$",
    historySize: 1000,
    showLineNumbers: false,
    tabCompletionEnabled: true,
    showTimestamps: false,
    shellWidth: "normal",
  };
}
