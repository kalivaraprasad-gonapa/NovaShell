// src/core/config/LocalStorageConfigProvider.ts
import { BaseConfigProvider } from "./BaseConfigProvider";

export abstract class LocalStorageConfigProvider<
  T,
> extends BaseConfigProvider<T> {
  private storageKey: string | null = null;

  constructor(storageKeyPrefix?: string) {
    super();
    // We'll set the storage key in getStorageKey method instead of here
  }

  protected async loadFromStorage(): Promise<Partial<T> | null> {
    if (typeof window === "undefined") {
      return null;
    }

    const storageKey = this.getStorageKey();
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as Partial<T>;
    } catch (error) {
      console.error(`Error parsing stored config for ${this.id}:`, error);
      return null;
    }
  }

  protected async saveToStorage(config: T): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storageKey = this.getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (error) {
      console.error(`Error saving config for ${this.id}:`, error);
    }
  }

  // Helper method to get or initialize storage key
  private getStorageKey(): string {
    if (!this.storageKey) {
      this.storageKey = `novashell:config:${this.id}`;
    }
    return this.storageKey;
  }
}
