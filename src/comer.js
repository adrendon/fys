/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */

// Fragment shaders are small programs that run on the graphics card and alter
// the pixels of a texture. Every framework implements shaders differently but
// the concept is the same. This shader takes the lightning texture and alters
// the pixels so that it appears to be glowing. Shader programming itself is
// beyond the scope of this tutorial.
//
// There are a ton of good resources out there to learn it. Odds are that your
// framework already includes many of the most popular shaders out of the box.
//
// This is an OpenGL/WebGL feature. Because it runs in your web browser
// you need a browser that support WebGL for this to work.


Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -3; xx <= 3; xx++) {',
                'for(int yy = -2; yy <= 2; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
        '}'
    ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;

var comer = {};
var 
    MSalerta = new buzz.sound("assets/audio/EFECTOALERTA4.ogg"),
    MSclicgenerico = new buzz.sound("assets/audio/EFECTOCLICKBOTONES.ogg"),
    MSpuntos = new buzz.sound("assets/audio/EFECTOESTRELLA.ogg"),
    MSganar = new buzz.sound("assets/audio/EFECTOGANASTE2.ogg"),
    MSganarfin = new buzz.sound("assets/audio/EFECTOGANASTE1.ogg"),
    MSerror = new buzz.sound("assets/audio/EFECTOINTENTAOTRAVEZ.ogg");




comer.juego1 = function () {


	this.glowFilter			= null;

	this.lunchBox 			= null;
	this.cursor				= null;
	this.speed				= 450;

	this.items 				= null;
	this.counterItemsGroup	= null;

	this.btnInstructions	= null;

	this.stars 				= null;
	this.counterItemsGroup	= null;

	this.timeItem				= 0;
	this.timeItemNoRecommended	= 0;

	this.throwItwems		= false;
	this.enableGame			= false;

	this.itemsCollected		= {
		P:0,
		C:0,
		V:0
	};

	this.itemsCollectedName		= {
		P:"Proteínas",
		V:"Vitaminas",
		C:"Carbohidratos",
		N:"No saludables"
	};

	this.blury 				= null;
	this.selectItem			= [];

	this.totalVitaminas		= null;
	this.totalProteinas		= null;
	this.totalCarbohidratos	= null;

	this.daytime  			= null;
	this.typeOfItem			= null;
};

comer.juego1.prototype = {
	init:function (data) {
		//console.log("data",data)
		this.daytime = data.daytime;
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.setOptions();
	},
	setOptions:function () {

		///seteo el contador del actual juego en 0///
		game.global.homeutils["counterStars"].initCurrent();

		this.throwItwems		= false;
		this.enableGame			= false;

		this.itemsCollected		= {
			P:0,
			C:0,
			V:0
		};

		this.selectItem = [this.daytime,this.daytime,this.daytime,"norecom"];

		this.typeOfItem = game.global.assetsJSON.settings.comersettings.comer1;

		if(popPreguntas)				//// valido si existe el pop de preugntas para destruirlo
			popPreguntas.destroy();
//tiempo de las preguntas 
		popPreguntas = new TimerPopPreguntas(game,40,25,game.global.assetsJSON.preguntas.comer,game.global.assetsJSON.preguntas.puntos) /// creo una nueva instancia

	//	console.log("settings comer:");
	//	console.log( this.typeOfItem );
	},
	create:function () {
		/****change bg******/
		game.global.bacgroundColor("#72b741");
		// body...
		this.startCount();

		this.createLunchbox();

		this.createCursos();

		this.createItemsGen();

		this.createInstructionsBtn();

		this.createCounterItems();

		/****adding filtros****/
		this.blury = game.add.filter('BlurY');
		this.glowFilter =  [ this.game.add.filter('Glow') ];

		this.showInstrucctions();
	},

	createInstructionsBtn:function () {
		this.btnInstructions 						= this.add.sprite(0,0,'btn-ayuda');
		this.btnInstructions.x 						= this.world.width - (this.btnInstructions.width) ;
		this.btnInstructions.y 						= 20;
		this.btnInstructions.inputEnabled 			= true;
		this.btnInstructions.input.useHandCursor 	= true;
		this.btnInstructions.events.onInputDown.add(this.showInstrucctions, this);
	},

	showInstrucctions:function () {
		/****open pop up*****/
	//	console.log("showInstrucctions de ",this.daytime);
		game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.comer1[this.daytime]);
	},

	startCount:function  () {
		this.contador = this.add.sprite(this.stage.width*.5,this.stage.height*.5,"contador-banhar");
		this.contador.anchor.setTo(.5,.5);
		this.contadorAnimation = this.contador.animations.add('countdown',[0,1,2],1,false);
		this.contadorAnimation.onComplete.add(this.endCount, this);

		this.contador.animations.play('countdown');
	},

	endCount:function (sprite, animation) {

		this.add.tween(this.lunchBox.scale).to({x:1,y:1},500,Phaser.Easing.Elastic.Out,true,500);

		this.add.tween(sprite.scale).to({x:0.01,y:0.01},500,Phaser.Easing.Elastic.In,true).onComplete.add(function () {
			sprite.destroy();
		});

		this.timeItem = game.time.now + game.rnd.integerInRange(1000,1500);
		this.throwItwems 	= true;
		this.enableGame		= true;

	//	console.log("********lanza comida*********")
	},

	createCounterItems:function () {
		this.counterItemsGroup = this.add.group();

		this.counterItemsGroup.bg 	= this.counterItemsGroup.create(0,0,"panel-dieta");
		// this.counterItemsGroup.bg.anchor.set(0.5);

		this.counterItemsGroup.x = this.stage.width - this.counterItemsGroup.bg.width;
		this.counterItemsGroup.y = (this.stage.height - this.counterItemsGroup.height*1.5)*.5;


		///textos de las proteinas totales recolectadas///
		var textStyleP = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalP = this.add.text(30, 50, "de "+ this.typeOfItem[this.daytime].totalItems.P, textStyleP);
		this.counterItemsGroup.textTotalP.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalP);

		var textStyleColected = {font: "22px poppinssemibold", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotaColectedP = this.add.text(this.counterItemsGroup.textTotalP.x - 25, this.counterItemsGroup.textTotalP.y, this.itemsCollected.P, textStyleColected);
		this.counterItemsGroup.textTotaColectedP.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedP);

		///textos de las Vitaminas totales recolectadas///
		var textStyleV = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalV = this.add.text(30, 155, "de "+ this.typeOfItem[this.daytime].totalItems.V, textStyleV);
		this.counterItemsGroup.textTotalV.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalV);

		// var textStyleColected = {font: "22px poppinssemibold", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotaColectedV = this.add.text(this.counterItemsGroup.textTotalV.x - 25, this.counterItemsGroup.textTotalV.y, this.itemsCollected.V, textStyleColected);
		this.counterItemsGroup.textTotaColectedV.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedV);

		///textos de las Carbohidratos totales recolectadas///
		var textStyleC = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalC = this.add.text(30, 255, "de "+ this.typeOfItem[this.daytime].totalItems.C, textStyleC);
		this.counterItemsGroup.textTotalC.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalC);

		// var textStyleColected = {font: "22px poppinssemibold", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotaColectedC = this.add.text(this.counterItemsGroup.textTotalC.x - 25, this.counterItemsGroup.textTotalC.y, this.itemsCollected.C, textStyleColected);
		this.counterItemsGroup.textTotaColectedC.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedC);

		this.counterItemsGroup.complete = {};
		this.counterItemsGroup.descriptionDiet = {};


		for( type in this.itemsCollected){		

			this.counterItemsGroup.complete[type] = this.counterItemsGroup.create(0,0,'advertencia',0);
			this.counterItemsGroup.complete[type].x = 107;
			this.counterItemsGroup.complete[type].y = this.counterItemsGroup["textTotal"+type].y + this.counterItemsGroup.complete[type].height*.3;
			this.counterItemsGroup.complete[type].anchor.set(.5);
			this.counterItemsGroup.complete[type].animations.add('complete',[1],1,false);
			this.counterItemsGroup.complete[type].animations.add('incomplete',[2],1,false);

			var textStyle 									= {font: "16px poppinssemibold", fill: "#508e24", align: "right"};
			this.counterItemsGroup.descriptionDiet[type] 	= this.add.text( this.counterItemsGroup["textTotal"+type].x + this.counterItemsGroup["textTotal"+type].width, this.counterItemsGroup["textTotal"+type].y + this.counterItemsGroup["textTotal"+type].height*.8,this.itemsCollectedName[type], textStyle);
			this.counterItemsGroup.descriptionDiet[type].anchor.set(1,0);
			this.counterItemsGroup.add(this.counterItemsGroup.descriptionDiet[type]);
		}


	},

	createCursos:function () {
		this.cursor = game.input.keyboard.createCursorKeys();	
	},
	createLunchbox:function () {
		this.lunchBox = this.add.sprite(0,0,"lonchera",0);
		this.lunchBox.x = this.game.width*.5;
		this.lunchBox.y = this.game.height - ( 100 + this.lunchBox.height );
		this.lunchBox.animations.add('guardar',[1,0],10,false);
		this.lunchBox.anchor.setTo(0.5, 0.5);
		this.lunchBox.scale.set(.01);

		////warning sign/////
		var warning = this.add.sprite(0,0,'advertencia',0);
		warning.animations.add('warning',[2,2,2,0],3,false);
		warning.animations.add('itemok',[1,1,1,0],6,false);

		this.lunchBox.warningSign = warning;
		this.lunchBox.warningSign.x = 131 - ( warning.width + 40);
		this.lunchBox.warningSign.y = -83;

		this.lunchBox.addChild(warning)

		////Letrero tipo de alimentos recolectado/////
		// this.typeOfItem[this.daytime].totalItems.P
		var tooltip 	= this.add.sprite(0,0,'tooltip-comida',1);
		tooltip.angle 	= 0;
		tooltip.y  		= 5;
		tooltip.animations.add('P',[1,1,1,0],3,false);
		tooltip.animations.add('V',[2,2,2,0],3,false);
		tooltip.animations.add('C',[3,3,3,0],3,false);
		tooltip.scale.set(0);
		tooltip.anchor.set(.5);

		this.lunchBox.tooltip = tooltip;
		this.lunchBox.addChild(tooltip)

		this.physics.arcade.enable(this.lunchBox);	


	},
	createItemsGen:function () {		

		this.items = this.add.group();
	    this.items.enableBody        = true;
	    this.items.physicsBodyType   = Phaser.Physics.ARCADE;
	    // this.items.setAll('anchor.x', 0.5);
	    // this.items.setAll('anchor.y', 1);
	    // this.items.setAll('checkWorldBounds', true);	
	    // this.items.setAll('outOfBoundsKill', true);	
	},
	createItem:function () {
     
		var type = game.rnd.integerInRange(100, 200)
		
	},
	createKeysInput:function () {
		// body...
	},
	createObjectsCount:function () {

		/*****elijo de manera aleatoria entre el item del día seleccionado y el no recomendable********/
		var selected = this.selectItem[game.rnd.integerInRange(0,this.selectItem.length-1)]
		/*******Genero el item de acuerdo al tipo de item seleccionado anterior********/
		var tipoAlimento = game.rnd.integerInRange(0,this.typeOfItem[selected].dieta.length-1);

		var item = this.items.create( 0, 0, this.typeOfItem[selected].key, tipoAlimento);
		item.checkWorldBounds 	= true;
		item.outOfBoundsKill  	= true;
		item.body.gravity.y 	= 600;
		item.points 			= this.typeOfItem[selected].points;
		item.anchor.x			= .5;
		item.tipoDieta			= this.typeOfItem[selected].dieta[tipoAlimento];
		item.x 					= game.rnd.integerInRange(item.width*.5, this.game.width - (item.width*.5 + this.counterItemsGroup.bg.width ) );
		item.events.onOutOfBounds.add(function (item) {
			item.filters = null;
		//	console.log("out",item)
		},this)
		item.events.onKilled.add(function (item) {
			item.filters = null;
			//console.log("muere",item)
		},this)

		item.body.velocity.y = -100;

		// item.filters = [this.blury];
		// item.filters = this.glowFilter;
		if( selected === "norecom"){
			// var toxico = this.add.sprite(0,0,'toxico');
			// toxico.y = item.height*.5;
			// toxico.anchor.set(.5);
			// item.addChildAt(toxico,0);
		}

		//console.log("item.tipoDieta:",item.tipoDieta);

		this.timeItem = game.time.now + game.rnd.integerInRange(1000,1500);

		MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);
	},

	createObjects:function () {
		// body...
	},

	update:function () {

		if( this.enableGame ){

			 ////Valido si fueron recolectados todos los objetos////
			if( this.throwItwems ){
				this.lunchBox.body.velocity.setTo(0, 0);

		        if (this.cursor.left.isDown)
		        {
		        	if( (this.lunchBox.x - this.lunchBox.width*.6) > 0 )
		            	this.lunchBox.body.velocity.x = -this.speed;
		            else
		            	this.lunchBox.body.velocity.setTo(0, 0);
		        }
		        else if (this.cursor.right.isDown)
		        {
		        	if( this.lunchBox.x  < ( this.game.width - (this.counterItemsGroup.bg.width + this.lunchBox.width*.5) ) )
		            	this.lunchBox.body.velocity.x = this.speed;
		            else
		            	this.lunchBox.body.velocity.setTo(0, 0);
		        }

		        // if( this.throwItwems ){
		        if( this.time.now > this.timeItem ){
		        	this.createObjectsCount();
		        }

		        game.physics.arcade.overlap(this.items, this.lunchBox, this.getItemLunch, null, this);
			    // }

				this.validateItemsColeted();
			}else{
				////Muestro pop up de fin de juego copmer/////
				game.global.homeutils["counterStars"].updateTotal();
				$("#botonPop").data('daytime',this.daytime);
				game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.comer2, this.onClosePopHandler);
			}

		}else{/// Detengo la lonchera

			this.lunchBox.body.velocity.setTo(0, 0);
		}
	},
	
	getItemLunch:function (lunchBox,item) {
	//	console.log("Point:",item.points);

		if( this.updateItemsColected(item.tipoDieta) ){
			game.global.homeutils["counterStars"].updateCurrentTotal(item.points);
			item.filters = null;
			item.kill();
			lunchBox.play("guardar");
		}
	},

	updateItemsColected: function (type) {

		var destroyItem = true;
		counterItemsGroup = this.counterItemsGroup



		if( type != "N"){ ////Chequeo el tipo de alimento con el que colisiono

			this.lunchBox.tooltip.play(type);
			this.lunchBox.tooltip.scale.set(0);
			this.add.tween(this.lunchBox.tooltip.scale).to({x:1,y:1},Phaser.Timer.HALF,Phaser.Easing.Elastic.Out,true,0,0,true);

			if( this.itemsCollected[type] < this.typeOfItem[this.daytime].totalItems[type]){  //incremento contador del tipo de alimento colisionado

				this.itemsCollected[type]++;
				

				this.lunchBox.warningSign.play('itemok');			//// Pongo signo de advertencia, alimento no deseado

				if( this.itemsCollected[type] === this.typeOfItem[this.daytime].totalItems[type] ){ //// Chequeo si se completo el tipo de alimento colisonado
					// this.counterItemsGroup.complete[type].frame = 1;
					this.counterItemsGroup.complete[type].play('complete');
				}

			}else{ /// si se completo dejo que el elemento siga derecho y se autodestruya al salir de los limites de la pantalla
				// destroyItem = false;				
			}

			this.counterItemsGroup["textTotaColected"+type].text = this.itemsCollected[type].toString();

		}else{/// si el alimento colisionado era un no deseado pongo contadores en cero

			this.itemsCollected.P = this.itemsCollected.C = this.itemsCollected.V = 0;

			this.counterItemsGroup.textTotaColectedP.text = this.itemsCollected.P;
			this.counterItemsGroup.complete.P.play('incomplete');
			this.counterItemsGroup.textTotaColectedC.text = this.itemsCollected.C;
			this.counterItemsGroup.complete.C.play('incomplete');
			this.counterItemsGroup.textTotaColectedV.text = this.itemsCollected.V;
			this.counterItemsGroup.complete.V.play('incomplete');

			this.lunchBox.warningSign.play('warning');			//// Pongo signo de advertencia, alimento no deseado
			this.add.tween(this.lunchBox).to({rotation: Math.PI*.15},50,Phaser.Easing.Exponential.Out,true,0,3,true);   //// Vibra la lonchera
		}

		return destroyItem;
	},

	validateItemsColeted:function () {
		

		if( this.itemsCollected.P === this.typeOfItem[this.daytime].totalItems.P 
			&& this.itemsCollected.C === this.typeOfItem[this.daytime].totalItems.C 
			&& this.itemsCollected.V === this.typeOfItem[this.daytime].totalItems.V 


		){
			this.throwItwems = false;


				
		}
	},

	onClosePopHandler:function  () {

		$('#botonPop').unbind( "click" );
		$('.modal').hide();

		game.paused = false;
	//	console.clear();
	//	console.log("daytime:",this.daytime,"this:",$(this).data("daytime"));
		game.state.start('Comer2',true,false,{daytime:$(this).data("daytime")});
	},

	shutdown:function () {
		
	}
};

comer.juego2 = function (game) {



	this.typeOfItem				= null;
	this.daytime				= null;

	this.btnInstructions 		= null;

	this.pieces					= null;
	this.containerButtons		= null;
	
	this.allPiecesCheched		= null;

	this.slideImages			= null;
	this.containerSlidesGroup	= null;

	this.leftBtn 				= null;
	this.rightBtn 				= null;

	this.currentSlide 			= null;

	this.checkBtn 				= null;
	this.title 					= null;

	this.itemsCollected			= {
		P:0,
		C:0,
		V:0,
		N:0
	};

	this.itemsCollectedName		= {
		P:"Proteínas",
		V:"Vitaminas",
		C:"Carbohidratos",
		N:"No saludables"
	};

	this.itemsCollectedTween	= {
		P:null,
		C:null,
		V:null,
		N:null
	};
}

comer.juego2.prototype = {

	init:function (data) {

	//	console.log("comer2:",data)
		this.daytime = data.daytime;
		this.setOptions();
	},

	setOptions:function () {

		///seteo el contador del actual juego en 0///
		game.global.homeutils["counterStars"].initCurrent();

		this.itemsCollected		= {
			P:0,
			C:0,
			V:0,
			N:0
		};

		this.typeOfItem = game.global.assetsJSON.settings.comersettings.comer2;

		this.pieces 			= [];
		this.slideImages 		= {};
		this.containerButtons	= null;

		this.allPiecesCheched	= false;

		this.leftBtn 			= null;
		this.rightBtn 			= null;

		this.currentSlide 		= null;
	},

	create:function () {
		// body...

		/****crea boton de instrucciones****/
		this.createInstructionsBtn();

		/****crea contador de proteinas, vitaminas y carbo****/
		this.createCounterItems();

		/****crea botones de selección de las partes del plato****/
		this.createItemsCheck();

		/****crea partes del plato****/
		this.createImagesSlides();

		/****crea control de los sprites de las partes del plato****/
		this.createImageSlidesControls();

		/****creo el botón para validar el plato****/
		this.createCheckBoton();

		///Disparo el evento de click del btn del plato////
		this.time.events.add(Phaser.Timer.QUARTER * 1, function () {
			this.pieces[0].btnSelect.events.onInputDown.dispatch(this.pieces[0].btnSelect,game.input.activePointer);
			this.createTitle();
		}, this);
	},

	createTitle:function () {

		this.title = {};

		var titleStyle = {font: "26px poppinssemibold", fill: "#FFFFFF", align: "center"};
		this.title.first = this.add.text(this.stage.width*.5, 55, this.typeOfItem.titleGame.first, titleStyle);
		this.title.first.anchor.set(.5);
		
		var titleStyle = {font: "22px poppinslight", fill: "#FFFFFF", align: "center"};
		this.title.second = this.add.text( this.title.first.x, this.title.first.height*.8 + this.title.first.y, this.typeOfItem.titleGame.second, titleStyle);
		this.title.second.anchor.set(.5);

		this.add.tween(this.title.first.scale).from({x:0,y:0},Phaser.Timer.HALF,Phaser.Easing.Exponential.Out,true,Phaser.Timer.HALF);
		this.add.tween(this.title.first).from({alpha:0},Phaser.Timer.HALF,Phaser.Easing.Linear.None,true,Phaser.Timer.QUARTER);

		this.add.tween(this.title.second.scale).from({x:0,y:0},Phaser.Timer.HALF,Phaser.Easing.Exponential.Out,true,Phaser.Timer.SECOND);
		this.add.tween(this.title.second).from({alpha:0},Phaser.Timer.HALF,Phaser.Easing.Linear.None,true,Phaser.Timer.SECOND);
	},

	createInstructionsBtn:function () {
		this.btnInstructions 						= this.add.sprite(0,0,'btn-ayuda');
		this.btnInstructions.x 						= this.world.width - (this.btnInstructions.width) ;
		this.btnInstructions.y 						= 20;
		this.btnInstructions.inputEnabled 			= true;
		this.btnInstructions.input.useHandCursor 	= true;
		this.btnInstructions.events.onInputDown.add(this.showInstrucctions, this);
	},

	createCheckBoton:function () {

		this.checkBtn 	= this.add.sprite(0,0,"plato-servido");
		this.checkBtn.x = this.containerSlidesGroup.x;
		this.checkBtn.y = this.containerSlidesGroup.y + 449*.5;
		this.checkBtn.anchor.set(.5);
		this.checkBtn.scale.set(0);
		this.checkBtn.inputEnabled 			= true;
		this.checkBtn.input.useHandCursor 	= true;
		this.checkBtn.events.onInputDown.add(this.validateSelectedPieces, this);
	},

	showInstrucctions:function () {
		/****open pop up*****/
	//	console.log("showInstrucctions de ",this.daytime);
		game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.comer2);
	},

	createCounterItems:function () {
		this.counterItemsGroup = this.add.group();

		this.counterItemsGroup.bg 	= this.counterItemsGroup.create(0,0,"panel-dieta-2");
		// this.counterItemsGroup.bg.anchor.set(0.5);

		this.counterItemsGroup.x = this.stage.width - this.counterItemsGroup.bg.width;
		this.counterItemsGroup.y = (this.stage.height - this.counterItemsGroup.height*1.15)*.5;


		///textos de las proteinas totales recolectadas///
		var textStyleP = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalP = this.add.text(30, 50, "de "+ this.typeOfItem[this.daytime].totalItems.P, textStyleP);
		this.counterItemsGroup.textTotalP.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalP);

		var textStyleColected = {font: "22px poppinssemibold", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotaColectedP = this.add.text(this.counterItemsGroup.textTotalP.x - 25, this.counterItemsGroup.textTotalP.y, this.itemsCollected.P, textStyleColected);
		this.counterItemsGroup.textTotaColectedP.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedP);

		///textos de las Vitaminas totales recolectadas///
		var textStyleV = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalV = this.add.text(30, 155, "de "+ this.typeOfItem[this.daytime].totalItems.V, textStyleV);
		this.counterItemsGroup.textTotalV.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalV);

		this.counterItemsGroup.textTotaColectedV = this.add.text(this.counterItemsGroup.textTotalV.x - 25, this.counterItemsGroup.textTotalV.y, this.itemsCollected.V, textStyleColected);
		this.counterItemsGroup.textTotaColectedV.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedV);

		///textos de las Carbohidratos totales recolectadas///
		var textStyleC = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalC = this.add.text(30, 255, "de "+ this.typeOfItem[this.daytime].totalItems.C, textStyleC);
		this.counterItemsGroup.textTotalC.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalC);

		this.counterItemsGroup.textTotaColectedC = this.add.text(this.counterItemsGroup.textTotalC.x - 25, this.counterItemsGroup.textTotalC.y, this.itemsCollected.C, textStyleColected);
		this.counterItemsGroup.textTotaColectedC.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedC);

		///textos de los no recomendables totales recolectados///
		var textStyleN = {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		this.counterItemsGroup.textTotalN = this.add.text(30, 355, "de "+ this.typeOfItem[this.daytime].totalItems.N, textStyleN);
		this.counterItemsGroup.textTotalN.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotalN);

		this.counterItemsGroup.textTotaColectedN = this.add.text(this.counterItemsGroup.textTotalN.x - 25, this.counterItemsGroup.textTotalN.y, this.itemsCollected.N, textStyleColected);
		this.counterItemsGroup.textTotaColectedN.setShadow(-2, 2, 'rgba(0,0,0,0.2)', 0);
		this.counterItemsGroup.add(this.counterItemsGroup.textTotaColectedN);

		this.counterItemsGroup.complete = {};
		this.counterItemsGroup.descriptionDiet = {};


		for( type in this.itemsCollected){		

			this.counterItemsGroup.complete[type] = this.counterItemsGroup.create(0,0,'advertencia',0);
			this.counterItemsGroup.complete[type].x = 107;
			this.counterItemsGroup.complete[type].y = this.counterItemsGroup["textTotal"+type].y + this.counterItemsGroup.complete[type].height*.3;
			this.counterItemsGroup.complete[type].anchor.set(.5);
			this.counterItemsGroup.complete[type].animations.add('complete',[1],1,false);
			this.counterItemsGroup.complete[type].animations.add('incomplete',[2],1,false);

			var textStyle 									= {font: "16px poppinssemibold", fill: "#508e24", align: "right"};
			this.counterItemsGroup.descriptionDiet[type] 	= this.add.text( this.counterItemsGroup["textTotal"+type].x + this.counterItemsGroup["textTotal"+type].width, this.counterItemsGroup["textTotal"+type].y + this.counterItemsGroup["textTotal"+type].height*.8,this.itemsCollectedName[type], textStyle);
			this.counterItemsGroup.descriptionDiet[type].anchor.set(1,0);
			this.counterItemsGroup.add(this.counterItemsGroup.descriptionDiet[type]);
		}

		// this.itemsCollectedTween.p = this.add.tween(this.counterItemsGroup.complete.P);
		// this.itemsCollectedTween.C = this.add.tween(this.counterItemsGroup.complete.C);
		// this.itemsCollectedTween.V = this.add.tween(this.counterItemsGroup.complete.V);
	},

	createItemsCheck:function () {

		this.containerButtons = this.add.group();

		this.containerButtons.x = 140;
		this.containerButtons.y = 210;

		var j = 0;

		/****creo el plato****/		
		var pieza = this.createPiece("platos",j);
		this.pieces.push(pieza)
		this.containerButtons.add(pieza);

		j++;

		for ( var dieta in this.typeOfItem[this.daytime].dieta){
			for (var i = 0; i < this.typeOfItem.partes.length; i++) {
				if ( this.typeOfItem.partes[i] == dieta ){

					console.log("key dieta:",dieta)

					/*****creo los botones que activan las piezas de acuerdo a la sección del día escogido*******/					
					var pieza = this.createPiece(dieta,j);

					this.pieces.push(pieza)
					this.containerButtons.add(pieza);

					this.add.tween(pieza).from({alpha:0},Phaser.Timer.HALF,Phaser.Easing.Linear.None,true,Phaser.Timer.QUARTER*j);

					j++;
				}
			};
		}
		
	},

	createPiece:function  (dieta,j) {

		var deltaY = 50;

		/*****creo los botones que activan las piezas de acuerdo a la sección del día escogido*******/					
		var pieza = this.add.group();
		pieza.dieta = dieta;

		/******creo que el botón******/
		pieza.btnCheck = pieza.create(0,0,"pieza-plato-ok",1);
		// pieza.btnCheck.inputEnabled 		= true;
		// pieza.btnCheck.input.useHandCursor 	= true;
		pieza.btnCheck.visible 				= false;
		pieza.btnCheck.dieta 				= dieta;
		pieza.btnCheck.checked 				= false;
		// pieza.btnCheck.events.onInputDown.add(this.checkPieceDownHandler, this);
		// pieza.btnCheck.events.onInputOver.add(this.checkPieceOverHandler, this);
		// pieza.btnCheck.events.onInputOut.add(this.checkPieceOutHandler, this);.

		// pieza.btnCheck.events.onInputUp.add(this.changePieceUpHandler, this);

		/****texto del nombre de la pieza*****/
		// var textStyle 	= {font: "22px poppinslight", fill: "#FFFFFF", align: "left"};
		var textStyle 	= {font: "18px poppinssemibold", fill: "#FFFFFF", align: "left"};
		// pieza.btnText 	= this.add.text(pieza.btnCheck.x + pieza.btnCheck.width + 10, 5, capitalizeFirstLetter(dieta), textStyle);
		pieza.btnText 	= this.add.text(pieza.btnCheck.x + pieza.btnCheck.width + 10, 5, this.typeOfItem.partesName[dieta], textStyle);
		pieza.add(pieza.btnText);

	//	console.log("texto width:", pieza.btnText.width);
	//	console.log("texto height:", pieza.btnText.height);

		/*****Create underline ******/
		var bmdUnder = this.add.bitmapData(pieza.btnText.width, pieza.btnText.height*.05); 	///Creación del bitmap data
		bmdUnder.ctx.beginPath(); 							/// empezar a llenar el bitmap
		bmdUnder.ctx.rect(0,0, pieza.btnText.width, pieza.btnText.height*.05); 				/// se define las dimensiones del rectangulo
		bmdUnder.ctx.fillStyle = '#FFFFFF'; 					//// color del relleno
		bmdUnder.ctx.fill(); 

		var underlineText			= pieza.create(pieza.btnCheck.x + pieza.btnCheck.width + 10,pieza.btnText.height*.95,bmdUnder);
		underlineText.visible 		= false;

		/****boton de selección pieza sobre texto*****/
		var bmd = this.add.bitmapData(pieza.btnText.width, pieza.btnText.height); 	///Creación del bitmap data
		bmd.ctx.beginPath(); 							/// empezar a llenar el bitmap
		bmd.ctx.rect(0,0, pieza.btnText.width, pieza.btnText.height); 				/// se define las dimensiones del rectangulo
		bmd.ctx.fillStyle = '#000000'; 					//// color del relleno
		bmd.ctx.fill(); 

		pieza.btnSelect 					= pieza.create(pieza.btnCheck.x + pieza.btnCheck.width + 10,5,bmd);
		pieza.btnSelect.isSelected 			= false;
		pieza.btnSelect.alpha 				= 0;
		pieza.btnSelect.underlineText 		= underlineText;
		pieza.btnSelect.inputEnabled 		= true;
		pieza.btnSelect.input.useHandCursor = true;
		pieza.btnSelect.dieta 				= dieta;		
		pieza.btnSelect.events.onInputDown.add(this.changePieceDownHandler, this);

		pieza.x = 0;
		pieza.y = deltaY*j;

		/****posiciono el boton con pivot en el centro*****/
		pieza.btnCheck.anchor.set(.5);
		pieza.btnCheck.x = pieza.btnCheck.width*.5;
		pieza.btnCheck.y = pieza.btnCheck.height*.5;

		return pieza
	},

	createImagesSlides:function () {

		//// contenedor de las partes(imagenes) del cadaver exquisito ////
		this.containerSlidesGroup = this.add.group();
		
		for (var i = this.pieces.length - 1; i >= 0; i--) {
		// for (var i = 0; i < this.pieces.length; i++) {

		//	console.log("crae imagenes de:",this.pieces[i].dieta);

			this.containerSlidesGroup.x = this.stage.width*.5;
			this.containerSlidesGroup.y = this.stage.height*.45;

			/// se crea cada parte de la cara del plato ///
			var imageKey = (this.pieces[i].dieta === 'platos')? "comer-"+this.pieces[i].dieta:this.daytime+"-"+this.pieces[i].dieta;

			var corpsImage = this.containerSlidesGroup.create(0,0,imageKey,0);
			corpsImage.dieta = this.pieces[i].dieta;
			corpsImage.anchor.set(.5);

			//// se guarda cada sprite de imagenes en un objeto cuya key es la misma parte de la cara a la que pertenece para tener una referencia de cada parte del plato ///
			this.slideImages[this.pieces[i].dieta] = corpsImage;
		};

		for ( dieta in this.slideImages ){
			if( dieta === "platos" ){
				this.slideImages[dieta].sendToBack();
			}
		}

		console.log(this.slideImages);

		/****posiciones las partes en su respectivas posiciones*****/
		this.setImagesPositions();
	},

	setImagesPositions:function () {

		/****se posiciona cada parte del plato*****/
		for (piece in this.slideImages){
			console.log("setImagesPositions of:",piece);
			console.log("partesPosiciones of:",this.typeOfItem.partesPosiciones[piece]);

			this.slideImages[piece].x = this.typeOfItem.partesPosiciones[piece].x ;
			this.slideImages[piece].y = this.typeOfItem.partesPosiciones[piece].y ;
			
			//// se escala a 0 para que no aparezca y se haga una transición ///
			this.slideImages[piece].scale.set(0);
			this.slideImages[piece].alpha = 0;

		}
	},

	createImageSlidesControls:function () {

		this.leftBtn 						= this.containerSlidesGroup.create(0,0,'left-btn');
		this.leftBtn.inputEnabled 			= true;
		this.leftBtn.input.useHandCursor	= true;
		// this.leftBtn.alpha					= 0;
		this.leftBtn.anchor.set(.5);
		this.leftBtn.events.onInputDown.add(this.moveCurrentSlide,this);
		this.leftBtn.position.set(-this.leftBtn.width*.5,0)

		this.rightBtn 						= this.containerSlidesGroup.create(0,0,'right-btn');
		this.rightBtn.inputEnabled 			= true;
		this.rightBtn.input.useHandCursor 	= true;
		// this.rightBtn.alpha					= 0;
		this.rightBtn.anchor.set(.5);
		this.rightBtn.events.onInputDown.add(this.moveCurrentSlide,this);
		this.rightBtn.position.set(this.rightBtn.width*.5,0)



	},

	moveCurrentSlide:function (btn,pointer) {
		console.log("move to:",btn.key);

		
		var inc = ( btn.key === "left-btn" )?-1:1;

		var totalFrames = this.currentSlide.animations.frameTotal - 1;
		var currentFrame = this.currentSlide.frame;
		var nextFrame;

		console.log("(currentFrame + inc )",(currentFrame + inc )," totalFrames:",totalFrames)

		if( (currentFrame + inc ) > totalFrames ){
			nextFrame = 0;
			// this.currentSlide.frame = 0;
		}else if( (currentFrame + inc ) < 0 ){
			nextFrame = totalFrames;
			// this.currentSlide.frame = totalFrames;
		}else{
			nextFrame = currentFrame + inc;
		}

		this.currentSlide.scale.set(1);
		this.add.tween(this.currentSlide.scale).to({x:0,y:0},Phaser.Timer.QUARTER,Phaser.Easing.Exponential.Out,true,0,0,true);

		this.time.events.add(Phaser.Timer.QUARTER*1.5, function () {///delay de 1 seg mientras la parte aparece en pantalla y tome sus medidas originales				
			this.currentSlide.frame = nextFrame;	
			// this.validateSelectedPieces(); /// chequeo las partes del plato
		}, this);		

		console.log("frame selected",this.currentSlide.frame)

		if( this.typeOfItem[this.daytime].dieta[this.currentSlide.dieta] )
			console.log("dieta actual:", this.typeOfItem[this.daytime].dieta[this.currentSlide.dieta][this.currentSlide.frame])


       MSclicgenerico.stop();
	   MSclicgenerico.play();
       MSclicgenerico.setVolume(80);
	},

	changePieceDownHandler:function (piezaBtn, pointer) {
		 MSclicgenerico.stop();
		 MSclicgenerico.play();
         MSclicgenerico.setVolume(80);	 

		/***** hago visible el boton de chequear de la pieza selecionada****/
		piezaBtn.parent.btnCheck.visible = true;
		piezaBtn.parent.btnCheck.checked = true;

		/****obtengo el sprite del slide que seleccione para controlar los frames*****/
		this.currentSlide = this.slideImages[piezaBtn.dieta];

		////transición del botón btnSelect.underlineText.visible

		this.clearSelectionPiece();

		piezaBtn.parent.btnText.font = "poppinssemibold";
		piezaBtn.parent.btnText.addColor('#ffffff', 0);

		piezaBtn.underlineText.visible = true;
		// this.add.tween(piezaBtn.underlineText.scale).to({x:1.3,y:1.3},375,Phaser.Easing.Elastic.Out,true,0,0,true);

		///Valida si el boton no ha sido aún seleccionado y lo pone como seleccionado
		if( piezaBtn.isSelected === false){

			console.log("activa pieza:",piezaBtn.dieta)

			piezaBtn.isSelected = true;				///pone el btn en el isSelected seleccionado
			this.showPiece(piezaBtn.dieta);	///muestra la parte del plato si aún no ha sido seleccionada

			/****actualizo posición de los controles de los sprites*****/
			this.time.events.add(Phaser.Timer.QUARTER*2, function () {///delay de 1 seg mientras la parte aparece en pantalla y tome sus medidas originales				
				this.updateSlideControPos(this.currentSlide);
			}, this);

		}else{///Solo hace la transición si el elemento ya aparecio en escena

			/****actualizo posición de los controles de los sprites*****/
			this.updateSlideControPos(this.currentSlide);

			this.currentSlide.scale.set(1);
			this.add.tween(this.currentSlide.scale).to({x:1.1,y:1.1},250,Phaser.Easing.Exponential.Out,true,0,0,true);
		}


		console.log("parte seleccionada:", this.currentSlide.dieta)
		console.log("total frame parte seleccionada:", this.currentSlide.animations.frameTotal)
		console.log("dieta parte:", this.typeOfItem[this.daytime].dieta[this.currentSlide.dieta])

		var allPiecesOk = this.ckeckPiecesSlected(); //// chequeo que todas las partes hayan sido seleccionadas para habilitar el boton de validar el plato
		// console.log("todas las partes están seleccionadas?",allPiecesOk);
		if( allPiecesOk ) ///si se mostraron todas las piezas muestro el botón de validar el plato
			this.add.tween(this.checkBtn.scale).to({x:1,y:1},Phaser.Timer.HALF,Phaser.Easing.Elastic.Out,true,Phaser.Timer.QUARTER*3);


		// if( this.typeOfItem[this.daytime].dieta[this.currentSlide.dieta] )
		// 	console.log("dieta actual:", this.typeOfItem[this.daytime].dieta[this.currentSlide.dieta][this.currentSlide.frame])
	},


	checkPieceDownHandler:function (btn,pointer) {
		console.log("check dieta:",btn.dieta)


		////disparo el evento de seleccionar la parte a checkear /////

		if( btn.parent.btnSelect.isSelected ){///valido si la parte que voy a chequear ya fue seleccionada///
			btn.frame = 0;
			btn.checked = true;
			btn.scale.set(1);
			this.add.tween(btn.scale).to({x:1.3,y:1.3},375,Phaser.Easing.Elastic.Out,true,0,0,true);
			btn.parent.btnSelect.events.onInputDown.dispatch(btn.parent.btnSelect,game.input.activePointer);
		}

	},

	validateSelectedPieces:function (btn,pointer) {

		console.clear()
		console.log("validateSelectedPieces");

		btn.scale.set(1);
		this.add.tween(btn.scale).to({x:1.15,y:1.15},Phaser.Timer.QUARTER,Phaser.Easing.Exponential.Out,true,0,0,true);
		
		///limpio los contadores///
		this.cleanTotalCollected();

		for (var i = this.pieces.length - 1; i >= 0; i--) {

			if( this.pieces[i].btnCheck.checked ){

				// slide.frame;   /// frame en el que esta el spritesheet
				// slide.dieta;   /// parte a la que pertenece el slide(cara, ojos, orejas, boca, nariz, pelo)
				var slide = this.slideImages[this.pieces[i].btnCheck.dieta];  /// obtengo el sprite de los slide que están ok

				if( slide.dieta != "platos" ){

					console.log("Valida parte",slide.dieta)

					var type = this.typeOfItem[this.daytime].dieta[slide.dieta][slide.frame];
					console.log("tipo de alimento:",type);

					// if ( type != "N" ){		/// Valido que no sea  un alimento no saludable
						this.itemsCollected[type]++;
			
					 //}


				}else{
					console.log("no valida platos");
							
				}

			}else{

			}
		};

		////actualizo la informacion de la tabla nutricional de acuerdo a los elementos seleccionados
		this.updateCounters();

		///valido que el plato cumpla la dieta
		var dietaOk = this.validateDietOk();
		console.log("termino dieta:",dietaOk);

		if( dietaOk ){
			      MSganar.stop();
	              MSganar.play();
                  MSganar.setVolume(80);
			this.time.events.add(Phaser.Timer.SECOND, function () {
				this.endGame();
			}, this);
		}else{
				  MSerror.stop();
	              MSerror.play();
                  MSerror.setVolume(80);
		}
	},

	updateCounters:function () {

		for ( type in this.itemsCollected ){			
			this.counterItemsGroup["textTotaColected"+type].text = this.itemsCollected[type].toString();

			console.log("tipo de alimento:"+type+"----total de ese tipo:"+this.typeOfItem[this.daytime].totalItems[type]+"----"+"acumulado de ese tipo:"+this.itemsCollected[type])

			// if( this.itemsCollectedTween[type] )/// destruyo la transición de scala de la advertencia
				// this.itemsCollectedTween[type].remove();

			this.counterItemsGroup.complete[type].scale.set(1);

			if( this.itemsCollected[type] <  this.typeOfItem[this.daytime].totalItems[type] ){

				// console.warn(this.counterItemsGroup.complete[type])
				this.counterItemsGroup.complete[type].play('incomplete');
				this.itemsCollectedTween[type] = this.add.tween(this.counterItemsGroup.complete[type].scale).to({x:1.3,y:1.3},Phaser.Timer.QUARTER*.5,Phaser.Easing.Exponential.Out,true,0,10,true)				

				console.log("tween "+type,this.itemsCollectedTween[type])

			}else if( this.itemsCollected[type] ==  this.typeOfItem[this.daytime].totalItems[type] ) {

				this.counterItemsGroup.complete[type].play('complete');

			}else{

				this.counterItemsGroup.complete[type].frame = 0;

			}
		}

	},

	validateDietOk:function () {

		var contDieta = 0;
		var totalItemsDieta = 0;

		for( type in this.counterItemsGroup.complete ){
			if( this.counterItemsGroup.complete[type].frame === 1 ){
				contDieta++;
			}
			totalItemsDieta++;
		};

		console.log("contDieta completada:",contDieta);

		var dietaOk = (contDieta === totalItemsDieta)?true:false;

		return dietaOk;

	},

	cleanTotalCollected:function () {

		for (type in this.itemsCollected){

			this.itemsCollected[type] = 0;

			// if ( type != "N" )
				this.counterItemsGroup["textTotaColected"+type].text = this.itemsCollected[type].toString();
		}
	},

	checkPieceOverHandler:function (btn,pointer) {
		console.log("oveeeeeeeer:",btn.dieta)
		btn.frame = 0;
	},

	checkPieceOutHandler:function (btn,pointer) {
		console.log("ouuuuuuuut:",btn.dieta)
		if( !btn.checked ){
			btn.frame = 1;
		}
	},

	ckeckPiecesSlected:function () {

		var totalSelected = this.pieces.length;
		var currentSelected = 0;

		for (var i = this.pieces.length - 1; i >= 0; i--) {

			if( this.pieces[i].btnSelect.isSelected ){
				currentSelected++;
			}
		};

		var allSelected = (totalSelected === currentSelected)?true:false;

		///chequeo si ya todos las partes fueron seleccionadas y la marco como checkeadas////
		if( allSelected && !this.allPiecesCheched){
			for (var i = 0; i < this.pieces.length; i++) {
				this.pieces[i].btnCheck.frame = 0;
				this.pieces[i].btnCheck.scale.set(1);
				this.add.tween(this.pieces[i].btnCheck.scale).to({x:1.3,y:1.3},Phaser.Timer.QUARTER,Phaser.Easing.Exponential.Out,true,i*Phaser.Timer.QUARTER,0,true)	
			};
			this.allPiecesCheched = true;
		}

		return allSelected;
	},

	/**** función que remueve la selección de los botones de activación de cada parte del plato****/
	clearSelectionPiece:function () {
		for (var i = this.pieces.length - 1; i >= 0; i--) {
			this.pieces[i].btnSelect.underlineText.visible = false;
			// this.pieces[i].btnText.font = "poppinslight";
			this.pieces[i].btnText.addColor('#508e24', 0);
		};

	},

	updateSlideControPos:function (currentSlide) {

		console.log("updateSlideControPos:")
		console.log(currentSlide.width)

		this.add.tween(this.leftBtn).to({x:-currentSlide.width*.5},500,Phaser.Easing.Elastic.Out,true);
		this.add.tween(this.leftBtn).to({y:currentSlide.y},500,Phaser.Easing.Exponential.Out,true);

		this.add.tween(this.rightBtn).to({x:currentSlide.width*.5},500,Phaser.Easing.Elastic.Out,true);
		this.add.tween(this.rightBtn).to({y:currentSlide.y},500,Phaser.Easing.Exponential.Out,true);
		
	},

	showPiece:function (piece) {
		this.add.tween(this.slideImages[piece].scale).to({x:1,y:1},500,Phaser.Easing.Elastic.Out,true,0);
		this.add.tween(this.slideImages[piece]).to({alpha:1},250,Phaser.Easing.Linear.None,true,0);
	},

	changePieceUpHandler:function (piezaBtn, pointer) {
		piezaBtn.frame = 0;
		this.add.tween(piezaBtn.scale).to({x:1,y:1},250,Phaser.Easing.Exponential.Out,true);
		console.log("up pieza:",piezaBtn.dieta)

	},

	update:function () {
		// body...
	},

	endGame:function () {

		game.global.homeutils["counterStars"].updateCurrentTotal(60);
		game.global.homeutils["counterStars"].updateTotal();

		game.global.showFinalPopGame('comer',this.onClosePopHandler);

		game.global.homeutils.itemGameSeleted.frame 			= 2;
		game.global.homeutils.itemGameSeleted.btnJugar.visible 	= false;
	},

	onClosePopHandler:function () {

		$('#botonPop').unbind( "click" );
		$('.modal').hide();
		game.state.start('Home',true,false,game.global.characterSelected);
	},

	shutdown:function () {
		if(popPreguntas)	/// destruyo el popup de preguntas
			popPreguntas.destroy();
	}
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}