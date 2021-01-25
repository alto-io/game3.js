import { TMX } from './tmx';
import { ISpriteLayer, ITile, ITileSets } from './types';
/**
 * A class used to parse Tiled maps from JSON.
 */
export declare class Map {
    private mapWidthUnits;
    private mapHeightUnits;
    private fixedTileSize;
    imageName: string;
    tilesets: ITileSets;
    collisions: ITile[];
    spawners: ITile[];
    layers: ISpriteLayer[];
    constructor(data: TMX.IMap, fixedTileSize: number);
    private computeTileSets;
    private computeCollisions;
    private computeSpawners;
    private computeLayers;
    private parseLayer;
    readonly widthInUnits: number;
    readonly heightInUnits: number;
    readonly widthInPixels: number;
    readonly heightInPixels: number;
}
