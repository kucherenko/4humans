import {LoggerTransport} from "./types/logger-transport";
import {LogLevel} from "./types/log-level";

export class Logger {
    private transports: LoggerTransport[] = [];

    addTransport(transport: LoggerTransport): void {
        this.transports.push(transport);
    }

    private log(level: LogLevel, message: string): void {
        for (const transport of this.transports) {
            transport.log(level, message);
        }
    }

    info(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    warn(message: string): void {
        this.log(LogLevel.WARN, message);
    }

    error(message: string): void {
        this.log(LogLevel.ERROR, message);
    }

    debug(message: string): void {
        this.log(LogLevel.DEBUG, message);
    }
}
