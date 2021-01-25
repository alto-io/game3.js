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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimongo = __importStar(require("minimongo"));
const all = require('it-all');
class MinimongoDBManager {
    constructor() {
        this.db = null;
        this.REPO = './ipfs';
        this.node = null;
        this.orbitdb = null;
        this.defaultOptions = null;
        //client
        this.config = null;
        this.leaderboardEntries = null;
        // server
        this.user = null;
        this.tournaments = null;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            var LocalDB = minimongo.LocalStorageDb;
            // @ts-ignore
            this.db = yield new LocalDB({ namespace: "opg" });
            yield this.initializeData();
        });
    }
    initializeData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.addCollection("guest");
            this.db.addCollection("user");
            this.db.addCollection("leaderboardEntries");
            this.db.addCollection("tournaments");
            // this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
            // await this.user.load()
            // this.leaderboardEntries = await this.orbitdb.docstore('leaderboardEntries', docStoreOptions); 
            // await this.leaderboardEntries.load()
            // this.tournaments = await this.orbitdb.kvstore('tournaments', this.defaultOptions);
            // await this.tournaments.load()
        });
    }
    refreshLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            // this.db.leaderboardEntries.find()
            // if (this.leaderboardEntries)
            // { 
            //   return await this.leaderboardEntries.query( (doc) => doc.id != null);
            // }
            // else return null;
        });
    }
    getPlayerProfile(walletid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.user.find().fetch((result) => {
                console.log(result);
                if (result.length > 0)
                    return result[0];
                else
                    return null;
            }, (error) => {
                console.log(error);
                return null;
            });
        });
    }
    getLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const lb = yield this.user.all;
            return lb;
        });
    }
    savePlayerProfile(playerProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.user.upsert(playerProfile, playerProfile, (result) => {
                return result;
            }, (error) => {
                console.log(error);
                return null;
            });
        });
    }
    getTournamentData(tournamentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.tournaments.find({ tournamentId }).fetch((result) => {
                if (result.length > 0)
                    return result[0];
                else
                    return null;
            }, (error) => {
                console.log(error);
                return null;
            });
        });
    }
    // TODO: update for minimongodb, still uses orbit code
    putTournamentData(tournamentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = tournamentData.id;
            const result = yield this.user.set(id, tournamentData);
            return result;
        });
    }
    getGuestConfig(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.guest.find().fetch(callback, (error) => {
                return null;
            });
        });
    }
    saveGuestConfig(guestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.guest.upsert(guestConfig, null, (r) => { console.log(r); }, (e) => { console.log(e); });
        });
    }
    localSaveReplay(playerId, tournamentId, time, file) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file);
            try {
                for (var _b = __asyncValues(this.node.add({
                    path: file.name,
                    content: file
                })), _c; _c = yield _b.next(), !_c.done;) {
                    const saveResult = _c.value;
                    const hash = saveResult.cid.string;
                    const entry = {
                        id: file.name,
                        tournamentId,
                        time,
                        hash,
                    };
                    yield this.leaderboardEntries.put(entry);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    getFileFromHash(hash) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            result = null;
            try {
                for (var _b = __asyncValues(this.node.get(hash)), _c; _c = yield _b.next(), !_c.done;) {
                    const file = _c.value;
                    console.log(file);
                    if (file.content) {
                        const content = Buffer.concat(yield all(file.content));
                        result = new File([content], hash + ".webm", { type: 'video/webm' });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            console.log(result);
            return result;
        });
    }
    serverPutGameReplay(reqBody) { }
}
exports.MinimongoDBManager = MinimongoDBManager;
//# sourceMappingURL=minimongodbmanager.js.map