/**
 * Starts a hosted mode server on any available port and returns the port number
 * once the server is ready to receive requests.
 **/
export declare function startServer(commandLineArgs: string[]): Promise<number>;
export declare function stopServer(): void;
