/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */

var preloader = {};
preloader.boot = function (game) {
	this.firstRunPortrait = false;
};
preloader.boot.prototype = {
	init: function () {
		this.input.maxPointers 				= 1;
		this.scale.scaleMode 				= Phaser.ScaleManager.SHOW_ALL;
		this.scale.setMinWidth 				= 315;
		this.scale.setMinHeight 			= 222;
		this.scale.setMaxWidth 				= 1170;
		this.scale.setMaxHeight 			= 824;
		this.scale.pageAlignHorizontally 	= true;
		this.scale.pageAlignVertically 		= true;
		this.time.desiredFps				= 50;

		this.stage.disableVisibilityChange = true;

		if(!game.device.desktop){
			this.firstRunPortrait = game.scale.isGamePortrait;
			game.scale.forceOrientation(true, false);
            game.scale.leaveIncorrectOrientation.add(handleCorrect);
			game.scale.enterIncorrectOrientation.add(handleIncorrect);
		}
	},
	preload: function () {
		this.load.path = "assets/";
		this.load.json('assets','assets.json?'+game.rnd.integer());
		this.load.spritesheet('cargador', 'spritesheets/cargador.png', 290, 355, 3);
	},
	create: function () {
		game.global.assetsJSON = game.cache.getJSON('assets');		
		console.log("create game.scale.isLandscape:",game.scale.isLandscape)
		console.log("create game.scale.isPortrait:",game.scale.isPortrait)
	},
	update: function () {
		if(game.device.desktop || game.scale.isLandscape){
			game.state.start('Preloader');
		}
	}
};

/////función que chequea si el dispositivo esa orientado de forma correcta////
function handleCorrect () {
	if(!game.device.desktop){
		console.log("correcto")
		resizeGame();
		if(game.state.current === "Boot"){
			game.state.start('Preloader');
		}else{
			console.log("Esconde mensaje de landscape")
		}
	}
}
/////función que chequea si el dispositivo esa orientado de forma incorrecta////
function handleIncorrect () {
	console.log("incorrecto")
	$("#game").hide();
}

function resizeGame () {	
	setTimeout(function() {
		$("#game").show();
		$("#game").css("width",$(window).width()+"px!important");
		$("#game").css("height",$(window).height()+"px!important");
		console.log("resize:",$(window).width(),$(window).height())
	}, 200);
}

preloader.preloader = function (game) {
	this.preloadText = null;
};
preloader.preloader.prototype = {
	init: function () {

		/////set the background color for the preload//////
		// this.stage.backgroundColor = "#fad400";
		$('body').css('backgroundImage','url()');
		game.global.bacgroundColor("#fad400");

		////setting styles to the preload text/////
		var textStyle = {font: "22px poppinssemibold", fill: "#0ba69c", align: "center"};

		this.preload = this.add.sprite(this.world.centerX, this.world.centerY,'cargador',0);
		this.preload.animations.add('cargando',[0,1,2],6,true);
        this.preload.anchor.x = .5;
        this.preload.anchor.y = .5;
        this.preload.x = game.width*.5;
        this.preload.y = game.height*.5;

        this.preload.animations.play('cargando');

		////adding preload text/////
        this.preloadText 			= this.add.text(this.world.centerX-50, this.world.centerY-50, "Loading: 0%", textStyle);
        this.preloadText.anchor.x 	= 0.5;
        this.preloadText.anchor.y 	= 0.5;
        this.preloadText.setShadow(3, 3, 'rgba(6,95,85,1)', 5);
	},
	preload: function () {
		///// setting path to the assets///
		this.load.path = 'assets/';

		var spritesheet 	= game.global.assetsJSON.spritesheet;////assets spritesheets
		var audio 			= game.global.assetsJSON.audio;////assets audio

		var images = game.global.assetsJSON.images; ////assets images

		// var homeimages 		= game.global.assetsJSON.images.home;///assts images
		// var banharimages 	= game.global.assetsJSON.images.banhar;///assts images
		// var comerimages 	= game.global.assetsJSON.images.comer;///assts images
		// var dormirimages 	= game.global.assetsJSON.images.dormir;///assts images

		////////load images assets/////////
		// for (var i = comerimages.length - 1; i >= 0; i--) {
		// 	this.load.image(comerimages[i].name, comerimages[i].path);
		// };

		// ////////load images assets/////////
		// for (var i = banharimages.length - 1; i >= 0; i--) {
		// 	this.load.image(banharimages[i].name, banharimages[i].path);
		// };
		
		// ////////load images assets/////////
		// for (var i = homeimages.length - 1; i >= 0; i--) {
		// 	this.load.image(homeimages[i].name, homeimages[i].path);
		// };

		// ////////load images assets/////////
		// for (var i = dormirimages.length - 1; i >= 0; i--) {
		// 	this.load.image(dormirimages[i].name, dormirimages[i].path);
		// };


		for( state in images ){
			////////load images assets/////////
			for (var i = images[state].length - 1; i >= 0; i--) {
				this.load.image(images[state][i].name, images[state][i].path);
			};
		}

		////////load audio assets/////////
		if ( audio.length ){
			for (var i = audio.length - 1; i >= 0; i--) {
				this.load.audio(audio[i].name, audio[i].path);
			};
		}

		////////load spritesheet assets/////////
		console.log("*************SPRITESHEET********************")
		for (var i = spritesheet.length - 1; i >= 0; i--) {
			console.log(spritesheet[i])
			// this.load.spritesheet(spritesheet[i].name, spritesheet[i].path);
			this.load.spritesheet(spritesheet[i].name, spritesheet[i].path, spritesheet[i].width, spritesheet[i].height, spritesheet[i].frames);
		};


		//////////loading script/////////

		this.load.path = "lib/";
		game.load.script('filterY', 'blury.js');
		
		// this.load.spritesheet('icon-total-bg', 'icon-drag-game-total-bg.png', 37, 45, 1);

		//////adding event load progress/////
		this.load.onFileComplete.add(this.fileComplete, this);
    	this.load.onLoadComplete.add(this.loadComplete, this);
	},

	loadComplete:function  (argument) {
		console.log("**********load complete****************")

		this.load.onFileComplete.remove(this.fileComplete, this);
    	this.load.onLoadComplete.remove(this.loadComplete, this);
	},

    fileComplete: function (progress) {

        this.preloadText.text = "" + progress + "%";
        console.log("Loading: " + progress + "%");

        var frame = Math.floor(progress%30);
        console.log("frame preload:",frame);
        this.preload.frame = frame;

    },

    loadUpdate: function () {
    	// this.preload.rotation += 0.05;
    },
	create: function () {
		console.log("Start prehome")
		this.state.start('Prehome');
		// this.state.start('Comer',true, false, "manhana");
	}
};