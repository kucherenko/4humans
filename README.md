# 4Humans

4Humans is a tool designed to analyze the quality of unit tests and suggest improvements. It employs the Test && Commit || Revert (TCR) methodology, proposed by Kent Beck, to ensure high-quality code through continuous testing and committing.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Methodology](#methodology)

## Features

- **Unit Test Quality Analysis**: Evaluates the quality of your unit tests.
- **Improvement Suggestions**: Provides actionable suggestions to enhance test quality.
- **TCR Methodology**: Implements the Test && Commit || Revert approach for continuous code improvement.

## Installation

To install 4Humans, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/kucherenko/4humans.git
   ```

2. Navigate to the project directory:

   ```sh
   cd 4humans
   ```

3. Install dependencies:
   ```sh
   pnpm install
   ```

## Usage

Put `.env` file with `OPENAI_API_KEY` in the root of the project.

To use 4Humans, run the following command:

```sh
pnpm start go https://github.com/kucherenko/logger-dogger --model openai
```

This will analyze your project's unit tests and provide a report with suggestions for improvement.

## Methodology

4Humans utilizes the **Test && Commit || Revert (TCR)** approach, a development workflow where:

1. **Test**: Run your tests.
2. **Commit**: If the tests pass, commit the changes.
3. **Revert**: If the tests fail, revert to the last known good state.

This cycle ensures that your codebase remains in a working state and that any changes made are properly tested before being committed.
