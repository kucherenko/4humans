import * as fs from 'fs';
import {ConsoleTransport} from "../src/transport/console";
import {FileTransport} from "../src/transport/file";
import {Logger} from "../src";
import {LogLevel} from "../src/types/log-level";

jest.mock('fs');

describe('Logger', () => {
    let logger: Logger;
    let consoleTransport: ConsoleTransport;
    let fileTransport: FileTransport;

    beforeEach(() => {
        logger = new Logger();
        consoleTransport = new ConsoleTransport();
        fileTransport = new FileTransport('test.log');

        logger.addTransport(consoleTransport);
        logger.addTransport(fileTransport);

        console.info = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
        console.debug = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log info messages to console and file', () => {
        const message = 'This is an info message';
        logger.info(message);

        expect(console.info).toHaveBeenCalledWith(message);
        expect(fs.appendFile).toHaveBeenCalledWith(
            'test.log',
            expect.stringContaining(message),
            expect.any(Function)
        );
    });

    it('should log warn messages to console and file', () => {
        const message = 'This is a warn message';
        logger.warn(message);

        expect(console.warn).toHaveBeenCalledWith(message);
        expect(fs.appendFile).toHaveBeenCalledWith(
            'test.log',
            expect.stringContaining(message),
            expect.any(Function)
        );
    });

    it('should log error messages to console and file', () => {
        const message = 'This is an error message';
        logger.error(message);

        expect(console.error).toHaveBeenCalledWith(message);
        expect(fs.appendFile).toHaveBeenCalledWith(
            'test.log',
            expect.stringContaining(message),
            expect.any(Function)
        );
    });

    it('should log debug messages to console and file', () => {
        const message = 'This is a debug message';
        logger.debug(message);

        expect(console.debug).toHaveBeenCalledWith(message);
        expect(fs.appendFile).toHaveBeenCalledWith(
            'test.log',
            expect.stringContaining(message),
            expect.any(Function)
        );
    });

    it('should add multiple transports and log to all of them', () => {
        const message = 'This is a test message';
        const mockTransport = {
            log: jest.fn(),
        };

        logger.addTransport(mockTransport);

        logger.info(message);

        expect(console.info).toHaveBeenCalledWith(message);
        expect(fs.appendFile).toHaveBeenCalledWith(
            'test.log',
            expect.stringContaining(message),
            expect.any(Function)
        );
        expect(mockTransport.log).toHaveBeenCalledWith(LogLevel.INFO, message);
    });
});
