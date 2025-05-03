import { IConfigManager, IConfigProvider } from "../interfaces/ICommand";

export class ConfigManager implements IConfigManager {
  private readonly providers = new Map<string, IConfigProvider<unknown>>();

  registerProvider<T>(provider: IConfigProvider<T>): void {
    if (this.providers.has(provider.id)) {
      throw new Error(
        `Config provider with ID ${provider.id} is already registered`,
      );
    }
    this.providers.set(provider.id, provider);
  }

  unregisterProvider(providerId: string): void {
    this.providers.delete(providerId);
  }

  getProvider<T>(providerId: string): IConfigProvider<T> | undefined {
    return this.providers.get(providerId) as IConfigProvider<T> | undefined;
  }

  getAllProviders(): ReadonlyArray<IConfigProvider<unknown>> {
    return Array.from(this.providers.values());
  }
}
