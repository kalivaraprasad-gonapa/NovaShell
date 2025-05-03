export interface IEnvironmentVariableManager {
  getVariable(name: string): string | undefined;
  setVariable(name: string, value: string): void;
  deleteVariable(name: string): boolean;
  getAllVariables(): Record<string, string>;
  expandVariables(text: string): string;
}
