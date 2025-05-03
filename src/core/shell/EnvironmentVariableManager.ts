import { IEnvironmentVariableManager } from "../interfaces/IEnvironment";

export class EnvironmentVariableManager implements IEnvironmentVariableManager {
  private variables: Record<string, string> = {};

  constructor(initialVariables?: Record<string, string>) {
    const isNode = typeof process !== "undefined" && process.env;
    // Initialize with system environment variables
    this.variables = {
      PATH: isNode ? (process.env.PATH ?? "") : "",
      HOME: isNode
        ? (process.env.HOME ?? process.env.USERPROFILE ?? "")
        : "/home/user",
      USER: isNode
        ? (process.env.USER ?? process.env.USERNAME ?? "")
        : "browser",
      SHELL: isNode ? (process.env.SHELL ?? "") : "nsh",
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
