"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function promiseQueue(promiseBuffer = [], resolve, reject) {
    const chain = new Promise(resolve => resolve());
    const loop = () => __awaiter(this, void 0, void 0, function* () {
        const current = promiseBuffer.shift();
        if (typeof current === 'function') {
            yield current();
            return loop();
        }
        else {
            resolve();
        }
    });
    chain.then(loop).catch(reject);
    return chain;
}
exports.promiseQueue = promiseQueue;
//# sourceMappingURL=promise-queue.js.map