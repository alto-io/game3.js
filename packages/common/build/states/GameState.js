"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const schema_1 = require("@colyseus/schema");
const __1 = require("..");
const entities_1 = require("../entities");
class GameState extends schema_1.Schema {
    // INIT
    constructor(mapName, maxPlayers, mode, tournamentId, onMessage) {
        super();
        this.players = new schema_1.MapSchema();
        this.monsters = new schema_1.MapSchema();
        this.props = new schema_1.ArraySchema();
        this.bullets = new schema_1.ArraySchema();
        this.spawners = [];
        this.actions = [];
        this.initializeMap = (mapName) => {
            const data = __1.Maps.List[mapName];
            const tiledMap = new __1.Tiled.Map(data, __1.Constants.TILE_SIZE);
            // Set the map boundaries
            this.map = new __1.Entities.Map(tiledMap.widthInPixels, tiledMap.heightInPixels);
            // Create a R-Tree for walls
            this.walls = new __1.Collisions.TreeCollider();
            tiledMap.collisions.forEach(tile => {
                if (tile.tileId > 0) {
                    this.walls.insert({
                        minX: tile.minX,
                        minY: tile.minY,
                        maxX: tile.maxX,
                        maxY: tile.maxY,
                        collider: tile.type,
                    });
                }
            });
            // Create spawners
            tiledMap.spawners.forEach(tile => {
                if (tile.tileId > 0) {
                    this.spawners.push(new __1.Geometry.RectangleBody(tile.minX, tile.minY, tile.maxX, tile.maxY));
                }
            });
        };
        // GAME: State changes
        this.handleWaitingStart = () => {
            this.setPlayersActive(false);
            this.onMessage(new entities_1.Message('waiting'));
        };
        this.handleLobbyStart = () => {
            this.setPlayersActive(false);
        };
        this.handleGameStart = () => __awaiter(this, void 0, void 0, function* () {
            if (this.game.mode === 'team deathmatch') {
                this.setPlayersTeamsRandomly();
            }
            this.setPlayersPositionRandomly();
            this.setPlayersActive(true);
            this.propsAdd(__1.Constants.FLASKS_COUNT);
            this.monstersAdd(__1.Constants.MONSTERS_COUNT);
            console.log("START");
            this.onMessage(new entities_1.Message('start', {
                endsAt: this.game.gameEndsAt
            }));
        });
        this.handleGameEnd = (message) => __awaiter(this, void 0, void 0, function* () {
            if (message) {
                this.onMessage(message);
            }
            this.propsClear();
            this.monstersClear();
            this.onMessage(new entities_1.Message('stop'));
        });
        // MONSTERS
        this.monstersAdd = (count) => {
            for (let i = 0; i < count; i++) {
                const body = this.getPositionRandomly(new __1.Geometry.CircleBody(0, 0, __1.Constants.MONSTER_SIZE / 2).box, false, false);
                const monster = new entities_1.Monster(body.x, body.y, body.width / 2, this.map.width, this.map.height, __1.Constants.MONSTER_LIVES);
                this.monsters[__1.Maths.getRandomInt(0, 1000)] = monster;
            }
        };
        this.monsterUpdate = (id) => {
            const monster = this.monsters[id];
            if (!monster || !monster.isAlive) {
                return;
            }
            // Update monster
            monster.update(this.players);
            // Collisions: Players
            for (const playerId in this.players) {
                const player = this.players[playerId];
                // Check if the monster can hurt the player
                if (!player.isAlive ||
                    !monster.canAttack ||
                    !__1.Collisions.circleToCircle(monster.body, player.body)) {
                    continue;
                }
                monster.attack();
                player.hurt();
                if (!player.isAlive) {
                    this.onMessage(new entities_1.Message('killed', {
                        killerName: 'A bat',
                        killedName: player.name,
                    }));
                }
                return;
            }
        };
        this.monsterRemove = (id) => {
            delete this.monsters[id];
        };
        this.monstersClear = () => {
            const monstersIds = [];
            for (const monsterId in this.monsters) {
                monstersIds.push(monsterId);
            }
            monstersIds.forEach(this.monsterRemove);
        };
        // Game
        this.game = new entities_1.Game({
            mapName,
            maxPlayers,
            mode,
            onWaitingStart: this.handleWaitingStart,
            onLobbyStart: this.handleLobbyStart,
            onGameStart: this.handleGameStart,
            onGameEnd: this.handleGameEnd,
        });
        this.tournamentId = tournamentId;
        // Map
        this.initializeMap(mapName);
        // Callback
        this.onMessage = onMessage;
    }
    // UPDATES
    update() {
        this.updateGame();
        this.updatePlayers();
        this.updateMonsters();
        this.updateBullets();
    }
    updateGame() {
        this.game.update(this.players, this.monsters);
    }
    updatePlayers() {
        let action;
        while (this.actions.length > 0) {
            action = this.actions.shift();
            switch (action.type) {
                case 'name':
                    {
                        this.playerName(action.playerId, action.value);
                    }
                    break;
                case 'move':
                    {
                        this.playerMove(action.playerId, action.ts, action.value);
                    }
                    break;
                case 'rotate':
                    {
                        this.playerRotate(action.playerId, action.ts, action.value.rotation);
                    }
                    break;
                case 'shoot':
                    {
                        this.playerShoot(action.playerId, action.ts, action.value.angle);
                    }
                    break;
            }
        }
    }
    updateMonsters() {
        for (const monsterId in this.monsters) {
            this.monsterUpdate(monsterId);
        }
    }
    updateBullets() {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bulletUpdate(i);
        }
    }
    // PLAYERS: single
    playerAdd(id, name, address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PLAYER ADD!");
            console.log("PLAYER ADD: Id", id);
            console.log("PLAYER ADD: Name", name);
            console.log("PLAYER ADD: Address", address);
            const spawner = this.getSpawnerRandomly();
            const player = new entities_1.Player(id, spawner.x + __1.Constants.PLAYER_SIZE / 2, spawner.y + __1.Constants.PLAYER_SIZE / 2, __1.Constants.PLAYER_SIZE / 2, 0, __1.Constants.PLAYER_MAX_LIVES, name || id, address);
            this.players[id] = player;
            console.log("PLAYER ADD: Player", player);
            console.log("PLAYER ADD: Players", this.players);
            let players = this.players;
            // Broadcast message to other players
            console.log("JOINED");
            this.onMessage(new entities_1.Message('joined', {
                name: this.players[id].name,
                address: this.players[id].address,
                players,
                endTimeScore: Date.now() + __1.Constants.GAME_DURATION + __1.Constants.LOBBY_DURATION
            }));
        });
    }
    playerPushAction(action) {
        this.actions.push(action);
    }
    playerName(id, name) {
        const player = this.players[id];
        if (!player) {
            return;
        }
        player.setName(name);
    }
    playerMove(id, ts, dir) {
        const player = this.players[id];
        if (!player || dir.empty) {
            return;
        }
        player.move(dir.x, dir.y, __1.Constants.PLAYER_SPEED);
        // Collisions: Map
        const clampedPosition = this.map.clampCircle(player.body);
        player.setPosition(clampedPosition.x, clampedPosition.y);
        // Collisions: Walls
        const correctedPosition = this.walls.correctWithCircle(player.body);
        player.setPosition(correctedPosition.x, correctedPosition.y);
        // Collisions: Props
        if (!player.isAlive) {
            return;
        }
        let prop;
        for (let i = 0; i < this.props.length; i++) {
            prop = this.props[i];
            if (!prop.active) {
                continue;
            }
            if (__1.Collisions.circleToRectangle(player.body, prop.body)) {
                switch (prop.type) {
                    case 'potion-red':
                        if (!player.isFullLives) {
                            prop.active = false;
                            player.heal();
                        }
                        break;
                }
            }
        }
    }
    playerRotate(id, ts, rotation) {
        const player = this.players[id];
        if (!player) {
            return;
        }
        player.setRotation(rotation);
    }
    playerShoot(id, ts, angle) {
        const player = this.players[id];
        if (!player || !player.isAlive || this.game.state !== 'game') {
            return;
        }
        // Check if player can shoot
        const delta = ts - player.lastShootAt;
        if (player.lastShootAt && delta < __1.Constants.BULLET_RATE) {
            console.log('Dropping "shoot" action as too early:', delta, 'ms');
            return;
        }
        player.lastShootAt = ts;
        // Make the bullet start at the staff
        const bulletX = player.x + Math.cos(angle) * __1.Constants.PLAYER_WEAPON_SIZE;
        const bulletY = player.y + Math.sin(angle) * __1.Constants.PLAYER_WEAPON_SIZE;
        // Recycle bullets if some are unused to prevent instantiating too many
        const index = this.bullets.findIndex(bullet => !bullet.active);
        if (index === -1) {
            this.bullets.push(new entities_1.Bullet(id, player.team, bulletX, bulletY, __1.Constants.BULLET_SIZE, angle, player.color, Date.now()));
        }
        else {
            this.bullets[index].reset(id, player.team, bulletX, bulletY, __1.Constants.BULLET_SIZE, angle, player.color, Date.now());
        }
    }
    playerUpdateKills(playerId) {
        const player = this.players[playerId];
        if (!player) {
            console.log('-');
            return;
        }
        console.log('kill');
        player.setKills(player.kills + 1);
    }
    playerRemove(id) {
        this.onMessage(new entities_1.Message('left', {
            name: this.players[id].name,
        }));
        delete this.players[id];
    }
    // PLAYERS: multiple
    setPlayersActive(active) {
        let player;
        for (const playerId in this.players) {
            player = this.players[playerId];
            player.setLives(active ? player.maxLives : 0);
        }
    }
    setPlayersPositionRandomly() {
        let spawner;
        let player;
        for (const playerId in this.players) {
            spawner = this.getSpawnerRandomly();
            player = this.players[playerId];
            player.setPosition(spawner.x + __1.Constants.PLAYER_SIZE / 2, spawner.y + __1.Constants.PLAYER_SIZE / 2);
        }
    }
    getPositionRandomly(body, snapToGrid, withCollisions) {
        body.x = __1.Maths.getRandomInt(__1.Constants.TILE_SIZE, this.map.width - __1.Constants.TILE_SIZE);
        body.y = __1.Maths.getRandomInt(__1.Constants.TILE_SIZE, this.map.height - __1.Constants.TILE_SIZE);
        // Should we compute collisions?
        if (withCollisions) {
            while (this.walls.collidesWithRectangle(body)) {
                body.x = __1.Maths.getRandomInt(__1.Constants.TILE_SIZE, this.map.width - __1.Constants.TILE_SIZE);
                body.y = __1.Maths.getRandomInt(__1.Constants.TILE_SIZE, this.map.height - __1.Constants.TILE_SIZE);
            }
        }
        // We want the items to snap to the grid
        if (snapToGrid) {
            body.x += __1.Maths.snapPosition(body.x, __1.Constants.TILE_SIZE);
            body.y += __1.Maths.snapPosition(body.y, __1.Constants.TILE_SIZE);
        }
        return body;
    }
    setPlayersTeamsRandomly() {
        // Add all players' ids into an array
        let playersIds = [];
        for (const playerId in this.players) {
            playersIds.push(playerId);
        }
        // Shuffle players' ids
        playersIds = __1.Maths.shuffleArray(playersIds);
        const minimumPlayersPerTeam = Math.floor(playersIds.length / 2);
        const rest = playersIds.length % 2;
        for (let i = 0; i < playersIds.length; i++) {
            const playerId = playersIds[i];
            const player = this.players[playerId];
            const isBlueTeam = i < (minimumPlayersPerTeam + rest);
            player.setTeam(isBlueTeam ? 'Blue' : 'Red');
        }
    }
    getSpawnerRandomly() {
        return this.spawners[__1.Maths.getRandomInt(0, this.spawners.length - 1)];
    }
    // BULLETS
    bulletUpdate(bulletId) {
        const bullet = this.bullets[bulletId];
        if (!bullet || !bullet.active) {
            return;
        }
        bullet.move(__1.Constants.BULLET_SPEED);
        // Collisions: Players
        for (const playerId in this.players) {
            const player = this.players[playerId];
            // Check if the bullet can hurt the player
            if (!player.canBulletHurt(bullet.playerId, bullet.team) ||
                !__1.Collisions.circleToCircle(bullet.body, player.body)) {
                continue;
            }
            bullet.active = false;
            player.hurt();
            if (!player.isAlive) {
                this.onMessage(new entities_1.Message('killed', {
                    killerName: this.players[bullet.playerId].name,
                    killedName: player.name,
                }));
                this.playerUpdateKills(bullet.playerId);
            }
            return;
        }
        // Collisions: Monsters
        for (const monsterId in this.monsters) {
            const monster = this.monsters[monsterId];
            // Check if the bullet can hurt the player
            if (!__1.Collisions.circleToCircle(bullet.body, monster.body)) {
                continue;
            }
            bullet.active = false;
            monster.hurt();
            if (!monster.isAlive) {
                this.monsterRemove(monsterId);
            }
            return;
        }
        // Collisions: Walls
        if (this.walls.collidesWithCircle(bullet.body, 'half')) {
            bullet.active = false;
            return;
        }
        // Collisions: Map
        if (this.map.isCircleOutside(bullet.body)) {
            bullet.active = false;
            return;
        }
    }
    // PROPS
    propsAdd(count) {
        for (let i = 0; i < count; i++) {
            const body = this.getPositionRandomly(new __1.Geometry.RectangleBody(0, 0, __1.Constants.FLASK_SIZE, __1.Constants.FLASK_SIZE), false, true);
            const prop = new entities_1.Prop('potion-red', body.x, body.y, body.width, body.height);
            this.props.push(prop);
        }
    }
    propsClear() {
        if (!this.props) {
            return;
        }
        while (this.props.length > 0) {
            this.props.pop();
        }
    }
}
__decorate([
    schema_1.type(entities_1.Game)
], GameState.prototype, "game", void 0);
__decorate([
    schema_1.type({ map: entities_1.Player })
], GameState.prototype, "players", void 0);
__decorate([
    schema_1.type({ map: entities_1.Monster })
], GameState.prototype, "monsters", void 0);
__decorate([
    schema_1.type([entities_1.Prop])
], GameState.prototype, "props", void 0);
__decorate([
    schema_1.type([entities_1.Bullet])
], GameState.prototype, "bullets", void 0);
exports.GameState = GameState;
//# sourceMappingURL=GameState.js.map