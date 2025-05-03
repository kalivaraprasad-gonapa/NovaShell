import {
  ITabCompletionRegistry,
  ITabCompletionProvider,
  CompletionMatch,
} from "../interfaces/ITabCompletion";

export class TabCompletionRegistry implements ITabCompletionRegistry {
  private providers: ITabCompletionProvider[] = [];

  registerProvider(provider: ITabCompletionProvider): void {
    this.providers.push(provider);
  }

  unregisterProvider(provider: ITabCompletionProvider): void {
    const index = this.providers.indexOf(provider);
    if (index !== -1) {
      this.providers.splice(index, 1);
    }
  }

  async getCompletions(
    commandLine: string,
    cursorPosition: number,
  ): Promise<CompletionMatch[]> {
    // Get completions from all providers
    const allCompletionsPromises = this.providers.map((provider) =>
      provider.getCompletions(commandLine, cursorPosition),
    );

    // Wait for all providers to finish
    const allCompletions = await Promise.all(allCompletionsPromises);

    // Flatten and deduplicate results
    const completions = allCompletions
      .flat()
      .filter(
        (completion, index, self) =>
          self.findIndex((c) => c.value === completion.value) === index,
      );

    return completions;
  }
}
