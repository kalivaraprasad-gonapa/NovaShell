# NovaShell

NovaShell is a modern, modular terminal emulator built with React, Next.js, and TypeScript. It follows strong object-oriented programming principles to ensure a maintainable, extensible architecture.

## Current Status

This project is currently in development. The core architecture has been designed and the basic framework is in place, but not all features are implemented yet.

### ✅ Implemented

- Core architecture and interface definitions
- Command system architecture
- Shell session infrastructure
- Plugin system framework
- Terminal UI components
- Theming system
- Configuration system foundation
- Basic command implementations (echo, help)
- Project setup and scaffolding

### 🚧 In Progress / Planned

- System shell integration
- Working directory management
- Environment variable handling
- Interactive command support
- Full plugin library
- Advanced UI features
- Command history persistence
- Tab completion

## Features

- 💻 Modern terminal interface with customizable themes
- 🔌 Plugin-based architecture for extensibility
- 🧩 Modular design with strict separation of concerns
- 🔄 Command history with search functionality
- 🎨 Customizable themes and appearance
- ⚙️ Configuration system with persistent settings

## Architecture

NovaShell follows clean architecture principles with a focus on:

- **Single Responsibility Principle**: Each module has one responsibility
- **Open/Closed Principle**: Extensible through plugins and interfaces
- **Liskov Substitution Principle**: Polymorphic class hierarchies
- **Interface Segregation**: Focused interfaces for specific needs
- **Dependency Inversion**: Dependencies on abstractions, not implementations

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher) or yarn (v1.22.x or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kalivaraprasad-gonapa/novashell.git
   cd novashell
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Quick Start with Setup Script

Alternatively, you can use the initialization script to set up the project from scratch:

1. Create a new directory and save the initialization script as `setup.sh`
2. Make the script executable: `chmod +x setup.sh`
3. Run the script: `./setup.sh`
4. Follow the on-screen instructions

## Project Structure

```
novashell/
├── src/
│   ├── core/               # Core business logic
│   │   ├── interfaces/     # Core interfaces
│   │   ├── command/        # Command handling
│   │   ├── history/        # History management
│   │   ├── shell/          # Shell session
│   │   ├── plugin/         # Plugin system
│   │   └── config/         # Configuration
│   ├── components/         # UI components
│   │   ├── terminal/       # Terminal UI
│   │   ├── theme/          # Theme providers
│   │   ├── settings/       # Settings UI
│   │   └── ui/             # Shared UI components
│   ├── plugins/            # Command plugins
│   │   ├── base/           # Base plugin classes
│   │   ├── file-system/    # File system commands
│   │   ├── system/         # System information
│   │   ├── network/        # Network tools
│   │   └── development/    # Development tools
│   ├── config/             # Configuration
│   │   └── providers/      # Config providers
│   ├── hooks/              # React hooks
│   ├── utils/              # Utility functions
│   ├── pages/              # Next.js pages
│   │   └── api/            # API routes
│   ├── styles/             # Global styles
│   └── tests/              # Tests
│       ├── core/           # Core tests
│       ├── components/     # Component tests
│       └── plugins/        # Plugin tests
```

## Core Components

### Command System

The command system is built around the `ICommand` interface:

```typescript
export interface ICommand {
  readonly id: string;
  readonly description: string;
  execute(args: string[]): Promise<CommandResult>;
  validate(args: string[]): boolean;
}
```

Commands are registered with the `CommandRegistry` and executed through the `ShellSession`.

### Plugin System

Plugins implement the `ICommandPlugin` interface and can add new commands to the shell:

```typescript
export interface ICommandPlugin {
  readonly id: string;
  readonly version: string;
  readonly commands: ReadonlyArray<ICommand>;
  initialize(shellSession: IShellSession): Promise<void>;
  terminate(): Promise<void>;
}
```

## Roadmap & Upcoming Features

### System Shell Integration (Coming Soon)

One of the key features in development is system shell integration, which will allow NovaShell to execute native system commands. The implementation will:

1. First try to execute commands through the internal command registry
2. For any command not found internally, pass it to the system shell (PowerShell on Windows, Bash on macOS/Linux)
3. Capture and display output in the NovaShell UI

Implementation will be done through the `SystemShellPlugin` module that's currently in development.

### Working Directory Management

Support for tracking and managing the working directory across commands is planned, allowing commands to operate in the correct directory context.

### Environment Variable Handling

A system for managing environment variables within the shell session is planned, ensuring that commands have access to the appropriate environment.

### Interactive Command Support

Enhanced support for interactive commands (editors, prompts, etc.) is on the roadmap, requiring more sophisticated terminal emulation capabilities.

## Development Guide

### Adding a New Command

1. Create a class that implements the `ICommand` interface:

```typescript
export class MyCommand implements ICommand {
  readonly id = "my-command";
  readonly description = "Description of my command";

  validate(args: string[]): boolean {
    // Validate arguments
    return true;
  }

  async execute(args: string[]): Promise<CommandResult> {
    // Command implementation
    return {
      output: "Command output",
      exitCode: 0,
    };
  }
}
```

2. Register the command with the registry:

```typescript
commandRegistry.register(new MyCommand());
```

### Creating a Plugin

1. Create a class that extends `BasePlugin`:

```typescript
export class MyPlugin extends BasePlugin {
  readonly id = "my-plugin";
  readonly version = "1.0.0";
  readonly commands: ReadonlyArray<ICommand> = [
    new MyCommand(),
    new AnotherCommand(),
  ];

  protected async onInitialize(): Promise<void> {
    console.log("MyPlugin initialized");
  }

  protected async onTerminate(): Promise<void> {
    console.log("MyPlugin terminated");
  }
}
```

2. Register the plugin with the plugin manager:

```typescript
await pluginManager.registerPlugin(new MyPlugin());
```

## How NovaShell Works

NovaShell operates through these main components:

1. **Terminal UI**: React components render a terminal-like interface in the browser
2. **Command Processing**:

   - User input is captured through the `TerminalInput` component
   - Input is sent to the `ShellSession` for processing
   - `CommandParser` breaks the input into command name and arguments
   - `CommandRegistry` is queried for a matching command
   - The command's `validate` and `execute` methods are called
   - Results are displayed in the `TerminalOutput` component

3. **Plugin System**:

   - Plugins are registered at startup
   - Each plugin provides a set of commands
   - Plugins can access the shell session to coordinate with other components

4. **Configuration System**:
   - Settings are stored through the `ConfigManager`
   - Each module defines its own configuration schema
   - Changes trigger UI updates through React hooks

## Next Steps for Contributors

If you'd like to contribute to NovaShell, here are some key areas where help is needed:

1. **System Shell Integration**:

   - Implement the `SystemShellPlugin` for executing native commands
   - Add support for process management and output streaming
   - Implement working directory tracking

2. **UI Enhancements**:

   - Improve terminal rendering and styling
   - Add support for more advanced terminal features (ANSI colors, cursor control)
   - Create a better command input experience with autocomplete

3. **Plugin Development**:

   - Implement more plugins for common use cases
   - Create a plugin discovery and loading system
   - Develop a plugin marketplace concept

4. **Testing**:
   - Write unit tests for core components
   - Create integration tests for command execution
   - Build UI component tests

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

Before submitting, please ensure your code:

- Follows the project's OOP principles
- Includes tests for new functionality
- Is properly documented
