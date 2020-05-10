export interface LeaderboardEntry {
  username: string;
  score: number;
  replay: ReplayEntry;
}

export interface ReplayEntry {
  timestamp: Date;
  seed: number;
  entities: string[];
  frameData: FrameData[];
}

export interface EntityCommand {
  entityid: number;
  command: string;
  commandValue: number;
}

export interface FrameData {
  deltaTime: number;
  entityCommand: EntityCommand;
}
