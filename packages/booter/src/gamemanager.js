IMAGE_PIXEL_DATAURI =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBFNUJGMUI5NjEwRjExRTdCNTdDQUEzMzM1RTIyRjg2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBFNUJGMUJBNjEwRjExRTdCNTdDQUEzMzM1RTIyRjg2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEU1QkYxQjc2MTBGMTFFN0I1N0NBQTMzMzVFMjJGODYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEU1QkYxQjg2MTBGMTFFN0I1N0NBQTMzMzVFMjJGODYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4FxQZlAAAAHElEQVR42mL8//8/AymAiYFEMKphVMPQ0QAQYABVbQMd0MbiHwAAAABJRU5ErkJggg==";

BASE64_ATLAS =
{
    UI_PNG: require('./assets/uipng')
}

cacheImageViaUri = function(context, imagename, datauri, callback = null, args = null) {

    context.textures.once('addtexture', function (key) {
        callback(args, key);
    }, context);

    context.textures.addBase64(imagename, datauri);
}

loadAtlasJson = function(context, key) {
        // check if it's a base64 atlas
        var b64atlas = BASE64_ATLAS[key];

        // load the atlas as [key]_ATLAS
        if (b64atlas) {
            var source = context.textures.get(key).source[0].source;
            var atlas = b64atlas.data.ATLAS;

            // listener for when atlas is loaded
            context.textures.once('addtexture', function (key) {
                updateProgressBar(context, key);
            }, context);

            context.textures.addAtlasJSONArray(key + "_ATLAS", source, atlas);
        }

}

startPreloaderScene = function(context, key = null) {
    context.scene.start('Preloader');
}

class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        cacheImageViaUri(this, 'background', IMAGE_PIXEL_DATAURI, startPreloaderScene, this);
        // this.load.image('background', 'assets/background.png');
        // this.load.image('logo-enclave', 'img/logo-enclave.png');
        // this.load.image('loading-background', 'img/loading-background.png');
        // WebFont.load({ custom: { families: ['Berlin'], urls: ['fonts/BRLNSDB.css'] } });
    }
    create() {
        GameManager.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
    }
}

var PreloadResources = {
    'base64-spritesheet': [
        [BASE64_ATLAS.UI_PNG]
    ],            
    // 'image': [
    //     ['title', 'img/title.png']
    // ],
    // 'spritesheet': [
    //     ['button-start', 'img/button-start.png', {frameWidth:180,frameHeight:180}],
    //     ['button-settings', 'img/button-settings.png', {frameWidth:80,frameHeight:80}],
    //     ['loader', 'img/loader.png', {frameWidth:45,frameHeight:45}]
    // ]
};

var PROGRESS_MAX = 1;
var currentProgress = 0;
var grayBg, progressBarBg, progressIndicator;

updateProgressBar = function(context, key) {

    // console.log("loaded " + key);
    currentProgress++;
    var value = currentProgress / PROGRESS_MAX;
    progressIndicator.clear();
    progressIndicator.fillStyle(0xffde00, 1);
    progressIndicator.fillRect(
        GameManager.world.width * 0.15, 
        GameManager.world.height / 2 - (GameManager.world.height * 0.0175),
        GameManager.world.width * 0.70 * value,
        GameManager.world.height * 0.035);

    if (value >= PROGRESS_MAX)
    {
        var nextScene = 'ExampleMainMenu';

        try {
            var keys = Object.keys(context.scene.manager.keys);

            console.log(keys);

            if (keys.length > 2)
            {
                nextScene = keys[2];
            }
        } catch (e)
        {
            console.log(e);
        }
        
		GameManager.fadeOutScene(nextScene, context);
    }
}

class PreloaderScene extends Phaser.Scene {

    constructor() {
        super('Preloader');
    }

    preload() {
		grayBg = this.add.sprite(
                GameManager.world.centerX, 
                GameManager.world.centerY, 
                'background')
            .setDisplaySize(
                GameManager.world.width, 
                GameManager.world.height)
            .setTintFill(0x000000, 0x000000, 0x888888, 0x888888);

        progressBarBg = this.add.sprite(
                GameManager.world.centerX, 
                GameManager.world.centerY, 
                'background')
            .setDisplaySize(
                GameManager.world.width * 0.75, 
                GameManager.world.height * 0.05)
            .setOrigin(0.5, 0.5);

        progressIndicator = this.add.graphics();

		for(var method in PreloadResources) {
			PreloadResources[method].forEach(function(args) {
                switch (method)
                {
                    case 'base64-spritesheet':
                        var id = args[0].data.ID;
                        var datauri = args[0].data.DATAURI;
                        cacheImageViaUri(this, id, datauri, loadAtlasJson, this);   
                        break;

                    default:
                        var loader = this.load[method];
                        loader && loader.apply(this.load, args);
                        break;
                }
			}, this);
		};                
    }

    create() {

	}
}

var GameManager = {}

GameManager.fadeOutIn = function(passedCallback, context) {
    context.cameras.main.fadeOut(250);
    context.time.addEvent({
      delay: 250,
      callback: function() {
        context.cameras.main.fadeIn(250);
        passedCallback(context);
      },
      callbackScope: context
    });  
  }
  GameManager.fadeOutScene = function(sceneName, context) {
    context.cameras.main.fadeOut(250);
    context.time.addEvent({
        delay: 250,
        callback: function() {
          context.scene.start(sceneName);
        },
        callbackScope: context
    });
  };

  GameManager.config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
		width: 540, // 1366, 768, 360 // most common resolutions: desktop, tablet, mobile
		height: 960 // 768 1024 640
    },
    scene: [BootScene, PreloaderScene]
};

GameManager.startGame = function(canvas = null, configOverride = null,
    scenes = null) {

   var config = 
    {
        ...GameManager.config,
        canvas
    }

    if (canvas === null) {
        config.scale.autoCenter = Phaser.Scale.CENTER_BOTH
    }

    if (configOverride) {
        config = {
            ...config,
            ...configOverride
        }
    }

    if (scenes) {
        config.scene = GameManager.config.scene.concat(scenes);
    }

    GameManager.game = new Phaser.Game(config);
}

module.exports.GameManager = GameManager;