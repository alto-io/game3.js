export interface ITileSets {
    [tileId: string]: ITile;
}
export interface ISpriteLayer {
    name: string;
    tiles: ITile[];
}
export interface ITile {
    tileId: number;
    tileIds?: number[];
    type?: string;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
