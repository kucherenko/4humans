import {LogLevel} from "./log-level";

export interface LoggerTransport {
    log(level: LogLevel, message: string): void;
}
