import { IEnvironmentVariableManager } from "../interfaces/IEnvironment";

export class EnvironmentVariableManager implements IEnvironmentVariableManager {
  private variables: Record<string, string> = {};

  constructor(initialVariables?: Record<string, string>) {
    // Initialize with system environment variables
    this.variables = {
      // Include some basic environment variables
      PATH: process.env.PATH || "",
      HOME: process.env.HOME || process.env.USERPROFILE || "",
      USER: process.env.USER || process.env.USERNAME || "",
      SHELL: process.env.SHELL || "",
      // Add any additional provided variables
      ...initialVariables,
    };
  }

  getVariable(name: string): string | undefined {
    return this.variables[name];
  }

  setVariable(name: string, value: string): void {
    this.variables[name] = value;
  }

  deleteVariable(name: string): boolean {
    if (name in this.variables) {
      delete this.variables[name];
      return true;
    }
    return false;
  }

  getAllVariables(): Record<string, string> {
    return { ...this.variables };
  }

  expandVariables(text: string): string {
    // Replace $VAR or ${VAR} with their values
    return text.replace(/\$(\w+)|\$\{(\w+)\}/g, (match, name1, name2) => {
      const name = name1 || name2;
      return this.variables[name] || match; // Return the value or keep the original if not found
    });
  }
}
