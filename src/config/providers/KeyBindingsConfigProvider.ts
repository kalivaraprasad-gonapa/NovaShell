import { LocalStorageConfigProvider } from "../../core/config/LocalStorageConfigProvider";

export interface KeyBindingConfig {
  [action: string]: string; // KeyboardEvent.key format
}

export const DEFAULT_KEY_BINDINGS: KeyBindingConfig = {
  "history-prev": "ArrowUp",
  "history-next": "ArrowDown",
  "cursor-start": "Home",
  "cursor-end": "End",
  "clear-terminal": "Control+l",
  "cancel-command": "Control+c",
  autocomplete: "Tab",
  "exit-terminal": "Control+d",
};

export class KeyBindingsConfigProvider extends LocalStorageConfigProvider<KeyBindingConfig> {
  readonly id = "key-bindings";
  readonly description = "Keyboard shortcuts and key bindings";
  readonly defaultConfig: KeyBindingConfig = DEFAULT_KEY_BINDINGS;
}
