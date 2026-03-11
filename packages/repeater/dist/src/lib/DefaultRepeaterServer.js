"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRepeaterServer = exports.DefaultRepeaterServerOptions = void 0;
const tslib_1 = require("tslib");
const RepeaterServer_1 = require("./RepeaterServer");
const core_1 = require("@sectester/core");
const tsyringe_1 = require("tsyringe");
const socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
const socket_io_msgpack_parser_1 = tslib_1.__importDefault(require("socket.io-msgpack-parser"));
const events_1 = require("events");
const os_1 = require("os");
exports.DefaultRepeaterServerOptions = Symbol('DefaultRepeaterServerOptions');
let DefaultRepeaterServer = class DefaultRepeaterServer {
    get socket() {
        if (!this._socket) {
            throw new Error('Please make sure that repeater established a connection with host.');
        }
        return this._socket;
    }
    constructor(logger, options) {
        this.logger = logger;
        this.options = options;
        this.MAX_DEPLOYMENT_TIMEOUT = 60000;
        this.MAX_RECONNECTION_ATTEMPTS = 20;
        this.MIN_RECONNECTION_DELAY = 1000;
        this.MAX_RECONNECTION_DELAY = 86400000;
        this.connectionAttempts = 0;
        this.events = new events_1.EventEmitter();
        this.handlerMap = new WeakMap();
        this.handleConnectionError = (err) => {
            const { data } = err;
            // If the error is not related to the repeater, we should ignore it
            if (!(data === null || data === void 0 ? void 0 : data.code)) {
                this.logConnectionError(err);
                return;
            }
            if (this.suppressConnectionError(data)) {
                this.events.emit("error" /* RepeaterServerEvents.ERROR */, {
                    ...data,
                    message: err.message
                });
                return;
            }
            if (this.connectionAttempts >= this.MAX_RECONNECTION_ATTEMPTS) {
                this.events.emit("reconnection_failed" /* RepeaterServerEvents.RECONNECTION_FAILED */, {
                    error: err
                });
                return;
            }
            // If the error is not related to the authentication, we should manually reconnect
            this.scheduleReconnection();
        };
        this.handleConnect = () => {
            this.connectionAttempts = 0;
            this.clearConnectionTimer();
            this.events.emit("connected" /* RepeaterServerEvents.CONNECTED */);
        };
        this.handleDisconnect = (reason) => {
            if (reason !== 'io client disconnect') {
                this.events.emit("disconnected" /* RepeaterServerEvents.DISCONNECTED */);
            }
            // the disconnection was initiated by the server, you need to reconnect manually
            if (reason === 'io server disconnect') {
                this.socket.connect();
            }
        };
    }
    disconnect() {
        var _a, _b;
        this.events.removeAllListeners();
        this.clearConnectionTimer();
        (_a = this._socket) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this._socket) === null || _b === void 0 ? void 0 : _b.removeAllListeners();
        this._socket = undefined;
    }
    async deploy(options = {}) {
        process.nextTick(() => this.socket.emit("deploy" /* SocketEvents.DEPLOY */, options));
        const [result] = await Promise.race([
            (0, events_1.once)(this.socket, "deployed" /* SocketEvents.DEPLOYED */),
            new Promise((_, reject) => setTimeout(reject, this.MAX_DEPLOYMENT_TIMEOUT, new Error('No response.')).unref())
        ]);
        return result;
    }
    async connect(namePrefix = (0, os_1.hostname)()) {
        this._socket = (0, socket_io_client_1.default)(this.options.uri, {
            parser: socket_io_msgpack_parser_1.default,
            path: '/api/ws/v1',
            transports: ['websocket'],
            reconnectionAttempts: this.MAX_RECONNECTION_ATTEMPTS,
            auth: {
                domain: namePrefix,
                token: this.options.token
            }
        });
        this.listenToReservedEvents();
        this.listenToApplicationEvents();
        await (0, events_1.once)(this.socket, 'connect');
        this.logger.debug('Repeater connected to %s', this.options.uri);
    }
    off(event, handler) {
        const wrappedHandler = this.handlerMap.get(handler);
        if (wrappedHandler) {
            this.events.off(event, wrappedHandler);
            this.handlerMap.delete(handler);
        }
    }
    on(event, handler) {
        const wrappedHandler = (...args) => this.wrapEventListener(event, handler, ...args);
        this.handlerMap.set(handler, wrappedHandler);
        this.events.on(event, wrappedHandler);
    }
    async wrapEventListener(event, handler, ...args) {
        try {
            const callback = this.extractLastArgument(args);
            // eslint-disable-next-line @typescript-eslint/return-await
            const response = await handler(...args);
            callback === null || callback === void 0 ? void 0 : callback(response);
        }
        catch (err) {
            this.handleEventError(err, event, args);
        }
    }
    extractLastArgument(args) {
        const lastArg = args.pop();
        if (typeof lastArg === 'function') {
            return lastArg;
        }
        else {
            // If the last argument is not a function, add it back to the args array
            args.push(lastArg);
            return undefined;
        }
    }
    listenToApplicationEvents() {
        this.socket.on("deployed" /* SocketEvents.DEPLOYED */, event => {
            this.events.emit("deploy" /* RepeaterServerEvents.DEPLOY */, event);
        });
        this.socket.on("request" /* SocketEvents.REQUEST */, (event, callback) => this.events.emit("request" /* RepeaterServerEvents.REQUEST */, event, callback));
        this.socket.on("error" /* SocketEvents.ERROR */, event => {
            this.events.emit("error" /* RepeaterServerEvents.ERROR */, event);
        });
        this.socket.on("update-available" /* SocketEvents.UPDATE_AVAILABLE */, event => this.events.emit("update_available" /* RepeaterServerEvents.UPDATE_AVAILABLE */, event));
        this.socket.on("limits" /* SocketEvents.LIMITS */, event => this.events.emit("limits" /* RepeaterServerEvents.LIMITS */, event));
    }
    listenToReservedEvents() {
        this.socket.on('connect', this.handleConnect);
        this.socket.on('connect_error', this.handleConnectionError);
        this.socket.on('disconnect', this.handleDisconnect);
        this.socket.io.on('reconnect', () => {
            this.latestReconnectionError = undefined;
        });
        this.socket.io.on('reconnect_error', error => (this.latestReconnectionError = error));
        this.socket.io.on('reconnect_failed', () => this.events.emit("reconnection_failed" /* RepeaterServerEvents.RECONNECTION_FAILED */, {
            error: this.latestReconnectionError
        }));
        this.socket.io.on('reconnect_attempt', attempt => this.events.emit("reconnect_attempt" /* RepeaterServerEvents.RECONNECT_ATTEMPT */, {
            attempt,
            maxAttempts: this.MAX_RECONNECTION_ATTEMPTS
        }));
        this.socket.io.on('reconnect', () => this.events.emit("reconnection_succeeded" /* RepeaterServerEvents.RECONNECTION_SUCCEEDED */));
    }
    suppressConnectionError(data) {
        return [
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_UNAUTHORIZED,
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_NOT_PERMITTED
        ].includes(data.code);
    }
    scheduleReconnection() {
        let delay = Math.max(this.MIN_RECONNECTION_DELAY * 2 ** this.connectionAttempts, this.MIN_RECONNECTION_DELAY);
        delay += delay * 0.3 * Math.random();
        delay = Math.min(delay, this.MAX_RECONNECTION_DELAY);
        this.connectionAttempts++;
        this.events.emit("reconnect_attempt" /* RepeaterServerEvents.RECONNECT_ATTEMPT */, {
            attempt: this.connectionAttempts,
            maxAttempts: this.MAX_RECONNECTION_ATTEMPTS
        });
        this.connectionTimer = setTimeout(() => this.socket.connect(), delay);
    }
    logConnectionError(err) {
        var _a;
        this.logger.debug('An error occurred while connecting to the repeater: %s', err.message);
        const { description, cause } = err;
        const nestedError = (_a = description === null || description === void 0 ? void 0 : description.error) !== null && _a !== void 0 ? _a : cause;
        if (nestedError) {
            this.logger.debug('The error cause: %s', nestedError.message);
        }
    }
    clearConnectionTimer() {
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
        }
    }
    handleEventError(error, event, args) {
        this.logger.debug('An error occurred while processing the %s event with the following payload: %j', event, args);
        this.logger.error('An error occurred', error);
    }
};
exports.DefaultRepeaterServer = DefaultRepeaterServer;
exports.DefaultRepeaterServer = DefaultRepeaterServer = tslib_1.__decorate([
    (0, tsyringe_1.scoped)(tsyringe_1.Lifecycle.ContainerScoped),
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(1, (0, tsyringe_1.inject)(exports.DefaultRepeaterServerOptions)),
    tslib_1.__metadata("design:paramtypes", [core_1.Logger, Object])
], DefaultRepeaterServer);
//# sourceMappingURL=DefaultRepeaterServer.js.map