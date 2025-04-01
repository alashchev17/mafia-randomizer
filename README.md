# Mafia (roles randomizer)

A project created to simplify the process of conducting the game "Mafia" for hosts. It is a ready-to-use tool for convenient monitoring of the game process with a pleasant visual component.

## Available Languages

| Language | Link                         |
| -------- | ---------------------------- |
| English  | [README.md](README.md)       |
| Russian  | [README.ru.md](README.ru.md) |

# ℹ️ Changelog

**_Changelog 24.11.23 v0.2:_**

- Implemented the "Settings" page;
- Added game mode selection;
- Moved the functionality of determining the number of players to the "Settings" page;
- Added a new role: "Doctor".

**_Changelog 26.11.23 v0.2.1:_**

- Implemented notifications when saving settings.

**_Changelog 06.12.23 v1.0-pre-release:_**

- Added the "Game Field" page;
- Added a game timer with several parameters;
- Implemented a system for tracking player statuses;
- Implemented a voting system;
- Implemented a system for recording rule violations;
- Fixed minor interface display bugs.

**_Changelog 12.12.23 v1.1-pre-release:_**

- Added scenarios for automatic game completion (according to the rules of the game "Mafia");
- Fixed bugs and errors in the code.

**_Changelog 15.12.23 v1.2:_**

- Added a history of game events as a separate page;
- Fixed bugs and errors on the Game Field page.

**_Changelog 05.01.24 v1.3:_**

- Added automatic removal of a player in voting if they were the only one nominated;
- Fixed bugs and errors in the code.

**_Changelog 07.11.24 v1.4:_**

- Added a new language - English;
- Fixed bugs and errors in the code, lots of optimizations.

**_Changelog [Current Date] v1.5:_**

- Added comprehensive testing suite with Vitest and Cypress;
- Implemented unit tests for core components and utilities;
- Added end-to-end tests for critical application flows;
- Improved code reliability and maintainability.

# 🧑🏼‍💻 Tech Stack

- React
- TypeScript
- React-Router v6
- Framer Motion
- i18next
- Vitest (Unit Testing)
- Cypress (E2E Testing)

# 🧪 Testing

The project now includes a comprehensive testing suite:

## Unit Tests (Vitest)

Unit tests cover individual components and utilities to ensure they function correctly in isolation:

- Core components like `PlayerCard`, `GameDesk`, etc.
- Utility functions like `rolesRandomizer`
- Context providers like `SessionContext`

Run unit tests with:

```bash
npm run test        # Run tests in watch mode
npm run test:ui     # Run tests with UI
npm run test:coverage # Generate test coverage report
```

## End-to-End Tests (Cypress)

E2E tests simulate real user interactions to verify the application works correctly as a whole:

- Navigation between pages
- Game setup and configuration
- Game state management

Run E2E tests with:

```bash
npm run test:e2e    # Run all E2E tests headlessly
npm run cypress:open # Open Cypress UI for interactive testing
```

# 📁 Sources

- [GitHub Repository](https://github.com/alashchev17/mafia-randomizer)
- [Deploy on Vercel](https://mafia-randomizer-react.vercel.app)
