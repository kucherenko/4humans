import {LoggerTransport} from "../types/logger-transport";
import {LogLevel} from "../types/log-level";

export class ConsoleTransport implements LoggerTransport {
    log(level: LogLevel, message: string): void {
        switch (level) {
            case LogLevel.INFO:
                console.info(message);
                break;
            case LogLevel.WARN:
                console.warn(message);
                break;
            case LogLevel.ERROR:
                console.error(message);
                break;
            case LogLevel.DEBUG:
                console.debug(message);
                break;
            default:
                console.log(message);
                break;
        }
    }
}
