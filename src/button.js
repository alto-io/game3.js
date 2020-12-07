export class Button extends Phaser.GameObjects.Image {
    constructor(x, y, texture, callback, scene, [
        framePointerOut, framePointerOver, framePointerDown
    ]) {
      super(scene, x, y, texture, framePointerOut);

      this.setInteractive({ useHandCursor: true });
      
      this.on('pointerup', function() {
        this.setFrame(framePointerOver);
      }, this);
  
      this.on('pointerdown', function() {
        this.setFrame(framePointerDown);
        callback.call(scene);
      }, this);
  
      this.on('pointerover', function() {
          this.setFrame(framePointerOver);
      }, this);
  
      this.on('pointerout', function() {
          this.setFrame(framePointerOut);
      }, this);
  
      scene.add.existing(this);
    }
  };
