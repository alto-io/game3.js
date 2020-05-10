import { Client, Room } from 'colyseus';
import { Constants, Maths, Types } from '..';
import { Message } from '../entities/message';
import { GameState } from '../states/GameState';

export class ShooterGameRoom extends Room<GameState> {

  // LIFECYCLE
  onCreate(options: Types.IRoomOptions) {
    // Set max number of clients for this room
    this.maxClients = Maths.clamp(
      options.roomMaxPlayers || 0,
      Constants.ROOM_PLAYERS_MIN,
      Constants.ROOM_PLAYERS_MAX,
    );

    // Init Metadata
    this.setMetadata({
      playerName: options.playerName.slice(0, Constants.PLAYER_NAME_MAX),
      roomName: options.roomName.slice(0, Constants.ROOM_NAME_MAX),
      roomMap: options.roomMap,
      roomMaxPlayers: this.maxClients,
      mode: options.mode,
    });

    // Init State
    this.setState(new GameState(
      options.roomMap,
      this.maxClients,
      options.mode,
      this.handleMessage,
    ));

    this.setSimulationInterval(() => this.handleTick());

    this.onMessage('action', (client: Client, data: any) => {
      const playerId = client.sessionId;
      const type: Types.ActionType = data.type;

      // Validate which type of message is accepted
      switch (type) {
        case 'name':
        case 'move':
        case 'rotate':
        case 'shoot':
          this.state.playerPushAction({
            playerId,
            ...data,
            ts: Date.now(),
          });
          break;
        default:
          break;
      }
    });

    console.log('Room created', options);
  }

  onJoin(client: Client, options: Types.IPlayerOptions) {
    this.state.playerAdd(client.sessionId, options.playerName);
    console.log(`Player joined: id=${client.sessionId} name=${options.playerName}`);
  }

  onLeave(client: Client) {
    this.state.playerRemove(client.sessionId);
    console.log(`Player joined: id=${client.sessionId}`);
  }

  onDispose() {
    console.log('Room deleted');
  }


  // HANDLERS
  handleTick = () => {
    this.state.update();
  }

  handleMessage = (message: any) => {
    this.broadcast(message.type, message);
  }
}
