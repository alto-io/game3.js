"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const __1 = require("..");
const GameState_1 = require("../states/GameState");
class ShooterGameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        // HANDLERS
        this.handleTick = () => {
            this.state.update();
        };
        this.handleMessage = (message) => {
            this.broadcast(message.type, message);
        };
    }
    // LIFECYCLE
    onCreate(options) {
        // Set max number of clients for this room
        this.maxClients = __1.Maths.clamp(options.roomMaxPlayers || 0, __1.Constants.ROOM_PLAYERS_MIN, __1.Constants.ROOM_PLAYERS_MAX);
        // Init Metadata
        this.setMetadata({
            playerName: options.playerName.slice(0, __1.Constants.PLAYER_NAME_MAX),
            roomName: options.roomName.slice(0, __1.Constants.ROOM_NAME_MAX),
            roomMap: options.roomMap,
            roomMaxPlayers: this.maxClients,
            mode: options.mode,
            tournamentId: options.tournamentId,
        });
        // Init State
        this.setState(new GameState_1.GameState(options.roomMap, this.maxClients, options.mode, options.tournamentId, this.handleMessage));
        this.setSimulationInterval(() => this.handleTick());
        this.onMessage('action', (client, data) => {
            const playerId = client.sessionId;
            const type = data.type;
            // Validate which type of message is accepted
            switch (type) {
                case 'name':
                case 'move':
                case 'rotate':
                case 'shoot':
                    this.state.playerPushAction(Object.assign(Object.assign({ playerId }, data), { ts: Date.now() }));
                    break;
                default:
                    break;
            }
        });
        console.log('Room created', options);
    }
    onJoin(client, options) {
        this.state.playerAdd(client.sessionId, options.playerName, options.playerAddress);
        console.log(`Player joined: id=${client.sessionId} name=${options.playerName}`);
    }
    onLeave(client) {
        console.log("Left");
        this.state.playerRemove(client.sessionId);
        console.log(`Player joined: id=${client.sessionId}`);
    }
    onDispose() {
        console.log('Room deleted');
    }
}
exports.ShooterGameRoom = ShooterGameRoom;
//# sourceMappingURL=ShooterGameRoom.js.map