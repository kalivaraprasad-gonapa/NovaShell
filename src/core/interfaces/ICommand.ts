import React from "react";
import { ITabCompletionRegistry } from "./ITabCompletion";
import { IWorkingDirectoryManager } from "./IWorkingDirectory";
import { IEnvironmentVariableManager } from "./IEnvironment";

export interface CommandResult {
  readonly output: string | React.ReactNode;
  readonly exitCode: number;
  readonly metadata?: Record<string, unknown>;
}

export interface ICommand {
  readonly id: string;
  readonly description: string;
  execute(args: string[]): Promise<CommandResult>;
  validate(args: string[]): boolean;
}

export interface RegisterOptions {
  overwrite?: boolean;
  silent?: boolean;
}

export interface ICommandRegistry {
  register(command: ICommand, options?: RegisterOptions): boolean;
  unregister(commandId: string): void;
  getCommand(commandId: string): ICommand | undefined;
  getAllCommands(): ReadonlyArray<ICommand>;
}

export interface IHistoryManager {
  add(command: string): void;
  get(index: number): string | undefined;
  search(term: string): ReadonlyArray<string>;
  getAll(): ReadonlyArray<string>;
  saveHistory(): Promise<boolean>;
  loadHistory(): Promise<boolean>;
  clear(): void;
}

export interface IShellSession {
  executeCommand(commandLine: string): Promise<CommandResult>;
  getHistory(): IHistoryManager;
  getCommandRegistry(): ICommandRegistry;
  getTabCompletionRegistry(): ITabCompletionRegistry;
  getWorkingDirectoryManager(): IWorkingDirectoryManager;
  getEnvironmentManager(): IEnvironmentVariableManager;
  setFallbackCommand(command: ICommand): void;
}

export interface ParsedCommand {
  readonly commandName: string;
  readonly args: string[];
  readonly rawInput: string;
}

export interface ICommandParser {
  parse(commandLine: string): ParsedCommand;
}

export interface ICommandPlugin {
  readonly id: string;
  readonly version: string;
  readonly commands: ReadonlyArray<ICommand>;
  initialize(shellSession: IShellSession): Promise<void>;
  terminate(): Promise<void>;
}

export interface IConfigProvider<T> {
  readonly id: string;
  readonly description: string;
  getConfig(): Promise<T>;
  setConfig(config: Partial<T>): Promise<void>;
  resetToDefaults(): Promise<void>;
  onChange(callback: (config: T) => void): () => void;
}

export interface IConfigManager {
  registerProvider<T>(provider: IConfigProvider<T>): void;
  unregisterProvider(providerId: string): void;
  getProvider<T>(providerId: string): IConfigProvider<T> | undefined;
  getAllProviders(): ReadonlyArray<IConfigProvider<unknown>>;
}
