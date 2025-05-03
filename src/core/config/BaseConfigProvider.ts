// src/core/config/BaseConfigProvider.ts
import { IConfigProvider } from "../interfaces/ICommand";

export abstract class BaseConfigProvider<T> implements IConfigProvider<T> {
  abstract readonly id: string;
  abstract readonly description: string;
  abstract readonly defaultConfig: T;

  private config!: T; // Using the ! non-null assertion operator
  private listeners: ((config: T) => void)[] = [];

  constructor() {
    // Don't initialize this.config here
    // We'll initialize it in the getConfig method instead
  }

  async getConfig(): Promise<T> {
    // Initialize config if it hasn't been initialized yet
    if (!this.config) {
      this.config = { ...this.defaultConfig };
    }

    // Load config from storage if available
    const storedConfig = await this.loadFromStorage();
    if (storedConfig) {
      this.config = this.mergeWithDefaults(storedConfig);
    }
    return { ...this.config };
  }

  async setConfig(partialConfig: Partial<T>): Promise<void> {
    // Initialize config if needed
    if (!this.config) {
      await this.getConfig();
    }

    this.config = {
      ...this.config,
      ...partialConfig,
    };

    // Save to storage
    await this.saveToStorage(this.config);

    // Notify listeners
    this.notifyListeners();
  }

  async resetToDefaults(): Promise<void> {
    this.config = { ...this.defaultConfig };

    // Save to storage
    await this.saveToStorage(this.config);

    // Notify listeners
    this.notifyListeners();
  }

  onChange(callback: (config: T) => void): () => void {
    this.listeners.push(callback);

    // Return function to unsubscribe
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  protected abstract loadFromStorage(): Promise<Partial<T> | null>;
  protected abstract saveToStorage(config: T): Promise<void>;

  private mergeWithDefaults(storedConfig: Partial<T>): T {
    return {
      ...this.defaultConfig,
      ...storedConfig,
    };
  }

  private notifyListeners(): void {
    const configCopy = { ...this.config };
    for (const listener of this.listeners) {
      listener(configCopy);
    }
  }
}
