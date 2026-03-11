import { RepeaterServer, RepeaterServerEventHandler, RepeaterServerEventsMap, DeployCommandOptions, RepeaterServerDeployedEvent } from './RepeaterServer';
import { Logger } from '@sectester/core';
export interface DefaultRepeaterServerOptions {
    readonly uri: string;
    readonly token: string;
    readonly connectTimeout?: number;
    readonly proxyUrl?: string;
}
export declare const DefaultRepeaterServerOptions: unique symbol;
export declare const enum SocketEvents {
    DEPLOYED = "deployed",
    DEPLOY = "deploy",
    UNDEPLOY = "undeploy",
    UNDEPLOYED = "undeployed",
    ERROR = "error",
    UPDATE_AVAILABLE = "update-available",
    LIMITS = "limits",
    PING = "ping",
    REQUEST = "request"
}
export declare class DefaultRepeaterServer implements RepeaterServer {
    private readonly logger;
    private readonly options;
    private readonly MAX_DEPLOYMENT_TIMEOUT;
    private readonly MAX_RECONNECTION_ATTEMPTS;
    private readonly MIN_RECONNECTION_DELAY;
    private readonly MAX_RECONNECTION_DELAY;
    private latestReconnectionError?;
    private connectionTimer?;
    private _socket?;
    private connectionAttempts;
    private events;
    private readonly handlerMap;
    private get socket();
    constructor(logger: Logger, options: DefaultRepeaterServerOptions);
    disconnect(): void;
    deploy(options?: DeployCommandOptions): Promise<RepeaterServerDeployedEvent>;
    connect(namePrefix?: string): Promise<void>;
    off<K extends keyof RepeaterServerEventsMap>(event: K, handler: RepeaterServerEventHandler<K>): void;
    on<K extends keyof RepeaterServerEventsMap>(event: K, handler: RepeaterServerEventHandler<K>): void;
    private wrapEventListener;
    private extractLastArgument;
    private listenToApplicationEvents;
    private listenToReservedEvents;
    private handleConnectionError;
    private suppressConnectionError;
    private scheduleReconnection;
    private logConnectionError;
    private clearConnectionTimer;
    private handleConnect;
    private handleDisconnect;
    private handleEventError;
}
