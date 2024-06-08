# logger-dogger

`logger-dogger` is a versatile and extendable logging library for TypeScript applications. It supports different log levels and multiple transport mechanisms, allowing you to direct logs to various outputs such as the console or files.

## Features

- Log levels: info, warn, error, debug.
- Multiple transports: console, file, and easily extendable for other transports.
- Timestamped log entries.
- Easy integration with any TypeScript project.

## Installation

To install `logger-dogger`, run:

```bash
npm install logger-dogger
```

## Usage

Here is an example of how to use `logger-dogger` in your project:

### 1. Import and Setup the Logger

```typescript
import { Logger, ConsoleTransport, FileTransport } from 'logger-dogger';

const logger = new Logger();
logger.addTransport(new ConsoleTransport());
logger.addTransport(new FileTransport('app.log'));

logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');
logger.debug('This is a debug message');
```

### 2. Creating Custom Transports

To create a custom transport, implement the `LoggerTransport` interface:

```typescript
import { Logger, ConsoleTransport, FileTransport } from 'logger-dogger';

class CustomTransport implements LoggerTransport {
    log(level: LogLevel, message: string): void {
        // Custom implementation
    }
}

const logger = new Logger();
logger.addTransport(new CustomTransport());

logger.info('This is a custom transport info message');
```

## API

### Logger

- `addTransport(transport: LoggerTransport): void` - Adds a transport to the logger.
- `info(message: string): void` - Logs an info message.
- `warn(message: string): void` - Logs a warn message.
- `error(message: string): void` - Logs an error message.
- `debug(message: string): void` - Logs a debug message.

### LoggerTransport

- `log(level: LogLevel, message: string): void` - Interface method to implement custom transports.

### LogLevel

- `INFO`
- `WARN`
- `ERROR`
- `DEBUG`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Running Tests

To run the tests, execute:

```bash
npx jest
```

### Example Tests

Tests are located in the `Logger.test.ts` file and cover various aspects of the logger functionality, including logging to console and file, and handling multiple transports.

---

## Contact

For any questions or suggestions, please open an issue or reach out to the maintainer.

---

Enjoy logging with `logger-dogger`! 🚀
