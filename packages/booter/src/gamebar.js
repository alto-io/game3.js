import { GameManager } from '.';
import { Button } from './button'

export class GameBar extends Phaser.GameObjects.Container {

    constructor(
            scene, 
            buttonNames = [
                "Events", 
                "Equip", 
                "Map", 
                "Income", 
                "Shop"
            ]) 
    {
        super(scene);

        const BUTTON_WIDTH = GameManager.world.width / buttonNames.length;
        const BUTTON_HEIGHT = GameManager.world.height * 0.12;
        const BUTTON_Y = BUTTON_HEIGHT / 2;

        this.x = BUTTON_WIDTH / 2;
        this.y = GameManager.world.height - BUTTON_HEIGHT;

        this.buttonArray = []

        // create buttons
        for (var i = 0; i < buttonNames.length; i++) {
            var button = new Button(
                i * BUTTON_WIDTH, BUTTON_Y + 20, // Y offset a bit due to button design
                'UI_PNG_ATLAS',
                null,
                scene,
                [
                    "grey_square_button_neutral.png",                   
                    "grey_square_button_hover.png",                   
                    "grey_square_button_pressed.png" 
                ]).setDisplaySize(BUTTON_WIDTH, BUTTON_HEIGHT);
            this.buttonArray.push(button);
        }

        this.add(this.buttonArray);

        scene.add.existing(this);
    }

}
