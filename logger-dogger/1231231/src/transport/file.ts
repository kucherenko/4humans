import * as fs from 'fs';
import {LoggerTransport} from "../types/logger-transport";
import {LogLevel} from "../types/log-level";

export class FileTransport implements LoggerTransport {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    log(level: LogLevel, message: string): void {
        const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
        fs.appendFile(this.filePath, logMessage, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });
    }
}
