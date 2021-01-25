/**
 * A partial definition of the TMX format in JSON.
 */
export declare namespace TMX {
    interface IMap {
        tilewidth: number;
        tileheight: number;
        width: number;
        height: number;
        tilesets: ITileSet[];
        layers: ILayer[];
    }
    /**
     * Tileset used by layers
     */
    interface ITileSet {
        name: string;
        columns: number;
        image: string;
        margin: number;
        spacing: number;
        imageheight: number;
        imagewidth: number;
        tilewidth: number;
        tileheight: number;
        tilecount: number;
        firstgid: number;
        tiles: ITile[];
    }
    interface ITile {
        id: number;
        animation?: ITileAnimFrame[];
        type?: string;
        objectgroup?: ITileObjectGroup;
    }
    interface ITileAnimFrame {
        duration: number;
        tileid: number;
    }
    interface ITileObjectGroup {
        x: number;
        y: number;
        name: string;
        draworder: string;
        visible: boolean;
        type: string;
        opacity: number;
    }
    /**
     * Different layers of the map
     */
    interface ILayer {
        id: number;
        name: string;
        type: string;
        x: number;
        y: number;
        width: number;
        height: number;
        opacity: number;
        visible: boolean;
        data: number[];
    }
}
