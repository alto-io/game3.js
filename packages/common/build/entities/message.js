"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(type, params) {
        this.type = type;
        this.ts = Date.now();
        this.params = params;
    }
    get JSON() {
        return {
            type: this.type,
            ts: this.ts,
            params: this.params,
        };
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map