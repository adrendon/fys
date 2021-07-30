/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */

// La cabeza
// El cuello
// El brazo izquierdo
// El brazo derecho
// El pecho
// Los genitales
// Las axilas
// Los pies
// Las piernas

var banhar = {};
var MSburbujas = new buzz.sound("assets/audio/EFECTOBURBUJAS.ogg"),
    MSducha=new buzz.sound("assets/audio/EFECTODUCHA.ogg"),
    MSalerta = new buzz.sound("assets/audio/EFECTOALERTA4.ogg"),
    MSclicgenerico = new buzz.sound("assets/audio/EFECTOCLICKBOTONES.ogg"),
    MSpuntos = new buzz.sound("assets/audio/EFECTOESTRELLA.ogg"),
    MSganar = new buzz.sound("assets/audio/EFECTOGANASTE2.ogg"),
    MSganarfin = new buzz.sound("assets/audio/EFECTOGANASTE1.ogg"),
    MSerror = new buzz.sound("assets/audio/EFECTOINTENTAOTRAVEZ.ogg");

var itemsSelected = [];
//var loadState = {this. );},

    banhar.juego1 = function () {

    this.titleTextTop			= null;
    this.titleTextbottom		= null;

    this.containerElements		= null;

    this.draggablesItems		= [];

    this.collisionsAreas		= [];

    this.bgselected 			= null;

    itemsSelected			= [];
};

banhar.juego1.prototype = {
	init: function () {

		console.log("********init bañarse**********")
		/////set the background color for the preload//////
		game.global.bacgroundColor("#fad400");

		///seteo el contador del actual juego en 0///
		game.global.homeutils["counterStars"].initCurrent();

		if(popPreguntas)				//// valido si existe el pop de preugntas para destruirlo
			popPreguntas.destroy();

		popPreguntas = new TimerPopPreguntas(game,40,30,game.global.assetsJSON.preguntas.banhar,game.global.assetsJSON.preguntas.puntos) /// creo una nueva instancia
	},
	create: function () {

		// game.state.add('Bañarse2',banhar.juego2);	
		// this.state.start('Bañarse2'); 

		/////set the background color for the preload//////
		game.global.bacgroundColor("#3e9a95");

		this.containerElements 				= this.add.group();
		this.containerElements.y 			= 150;
		this.containerElements.x 			= 0;		
	    this.containerElements.enableBody 	= true;
	    this.containerElements.physicsBodyType = Phaser.Physics.ARCADE;
		this.containerElements.name = "itemsContainer";

		this.createTitle();
		this.createItems();

		this.containerElements.btnValidar = this.containerElements.create(0,0,"btn-banhar",0);
		this.containerElements.btnValidar.x = this.bgselected.x + this.bgselected.width*.5 - 15;
		this.containerElements.btnValidar.y = this.bgselected.y + this.bgselected.height - this.containerElements.btnValidar.height - 30;
		this.containerElements.btnValidar.anchor.setTo(.5,.5);
		this.containerElements.btnValidar.events.onInputDown.add(this.checkItemSelection, this);

		this.createInstructionsBtn();

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
		console.log("showInstrucctions de ",this.daytime);
		game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.banhar1);
	},

	createTitle:function () {		

		var titleTextTopStyle 		= {font: "32px poppinssemibold", fill: "#ffffff", align: "center"};
        this.titleTextTop			= this.add.text(this.game.width*.5, 10, "¡Ya casi es el momento!", titleTextTopStyle);
        this.titleTextTop.anchor.setTo(0.5,1);

        var titleTextBottomStyle 	= {font: "20px poppinslight", fill: "#ffffff", align: "center"};
        this.titleTextbottom		= this.add.text(this.game.width*.5, this.titleTextTop.y+32, "Arrastra los elementos que necesitas para bañarte", titleTextBottomStyle);
        this.titleTextbottom.anchor.setTo(0.5,1);

        this.containerElements.add(this.titleTextTop);
        this.containerElements.add(this.titleTextbottom);

	},
	createItems:function  () {
		var bgItems = this.createbgItems();
		this.collisionsAreas = bgItems.collition;


		var j = 0;
		for (var i = 0; i < game.global.assetsJSON.images.banhar.length; i++) {

			if( game.global.assetsJSON.images.banhar[i].item ){

				var item = this.containerElements.create( bgItems.noselected[j].x + bgItems.noselected[j].width*.5 , bgItems.noselected[j].y + bgItems.noselected[j].height*.5 , game.global.assetsJSON.images.banhar[i].name);
				item.anchor.setTo(.5,.5);
			    item.originalPosition 		= item.position.clone();		///////Clono la posición original del item ///////
		        item.inputEnabled 			= true;
		        item.input.useHandCursor 	= true;
		        item.input.priorityID 		= 0;
		        item.collitonObject 		= null;
		        item.isSelected				= false;
		        item.state 					= this;
		        item.valid 					= game.global.assetsJSON.images.banhar[i].valid;

		        ////enableDrag parameter(lockCenter,bringToTop,pixelPerfect,alpha,ThresholdboundsRect/)///
		        item.input.enableDrag(false,true,false,255,null,this.game.stage);

				/////////////Crea tooltip boton/////////////////

				var tooltipBanhar 					= this.make.sprite(0,0,"tooltip-banhar");
				tooltipBanhar.visible 				= false;
				tooltipBanhar.x 					= (item.width - tooltipBanhar.width)*.5;
				tooltipBanhar.y 					= item.height*.5 ;
				tooltipBanhar.alpha = 0;
				tooltipBanhar.anchor.setTo(.5,.5);

				var textStyleTooltip 	= {font: "18px poppinslight", fill: "#FFFFFF", align: "center"};
				var textTooltip 		= this.add.text(0, tooltipBanhar.height*.2, game.global.assetsJSON.images.banhar[i].tooltipname, textStyleTooltip);
				textTooltip.anchor.x 	= 0.5;
				textTooltip.anchor.y 	= 0.5;
				tooltipBanhar.addChild(textTooltip);

				item.tooltip = tooltipBanhar;
				item.addChild(tooltipBanhar);

				///////Crea el boton de eliminar/////////////////
				var btnCerrar 					= this.make.sprite(0,0,"btn-eliminar-icon-game");
				btnCerrar.inputEnabled 			= true;
				btnCerrar.input.useHandCursor 	= true;
				btnCerrar.input.priorityID 		= 1;
				btnCerrar.visible 				= false;
				btnCerrar.x 					= (item.width - btnCerrar.width)*.5;
				btnCerrar.y 					= (btnCerrar.height-item.height)*.5 ;
				btnCerrar.scale.x = 0.01;
				btnCerrar.scale.y = 0.01;
				btnCerrar.anchor.setTo(.5,.5);
				btnCerrar.events.onInputDown.add(this.removeItem, item);

				item.btnCerrar = btnCerrar;
				item.addChild(btnCerrar);

			    //////Drag events//////
		        item.events.onDragStart.add(this.startItemDrag, this);
				item.events.onDragStop.add(this.stopItemDrag, this);

				item.events.onInputOver.add(this.dragItemOver, item); /// evento de over para mostrar el boton
				item.events.onInputOut.add(this.dragItemOut, item);  /// evento de out para esconderlo

				this.add.tween(item.scale).from({x:0,y:0},500,"Elastic.easeOut",true,250*j+1000);
				this.draggablesItems.push(item);

				j++;
			}
		};

		this.time.events.add(250*j+1000, function () {
			this.showInstrucctions();
		}, this);
	},
	createbgItems:function () {

		var bgitems 	= {
			"noselected":[],
			"collition":[]
		};

		var widthBg	= 160;
		var height 	= 140;
		var offsetY = this.titleTextbottom.y+10;
		var offsetX = 88;

		var j = 0;
		for (var i = 0; i < game.global.assetsJSON.images.banhar.length; i++) {
			if( game.global.assetsJSON.images.banhar[i].item ){
				console.log(game.global.assetsJSON.images.banhar[i].name);
				var bgItem = this.containerElements.create( j%4*widthBg + offsetX , Math.floor(j*.25)*height + offsetY, "bg-item-banhar");
				bgitems.noselected.push(bgItem);
				j++;

				
			}

	
		};

		this.bgselected = this.containerElements.create(widthBg*4.5, this.titleTextbottom.y-23, "bg-item-selected-banhar");

		var widthBgSeleted = 135; 
		var heightBgSeleted = 135;

		var bmd = this.add.bitmapData(widthBgSeleted*.1, heightBgSeleted*.1); 	///Creación del bitmap data
		bmd.ctx.beginPath(); 							/// empezar a llenar el bitmap
		bmd.ctx.rect(0, 0, widthBgSeleted*.1, heightBgSeleted*.1); 				/// se define las dimensiones del rectangulo
		bmd.ctx.fillStyle = '#000000'; 					//// color del relleno
		bmd.ctx.fill(); 								//// se llena el rectangulo


		for (var i = 0; i < 4; i++) {
			var bgItemSeleted = this.containerElements.
								create( 
										this.bgselected.x + 48 + widthBgSeleted * ( i%2 + .5 ), 
										heightBgSeleted * (Math.floor(i*.5) + .5) + this.bgselected.y + 83, 
										bmd
									); /// se crea un sprite con el bitmap data creado
			bgItemSeleted.anchor.setTo(.5,.5);
			bgItemSeleted.alpha 	= 0;		// var bgItemSeleted = this.containerElements.create(0,0, bmd); /// se crea un sprite con el bitmap data creado
			bgItemSeleted.addItem 	= this.addItem;
			bgItemSeleted.isFree 	= true;
			bgitems.collition.push(bgItemSeleted);
		
		};
	

		console.log("this.containerElements:",this.containerElements)
	

		return bgitems;
	},

	removeItem: function  (btnCerrar) {
	
		console.log("*******removeItem************")
		console.log("this:",this)
		console.log("this.stage :",this.stage )
		this.isSelected 	= false;
		this.collitonObject.isFree = true;
		this.collitonObject = null;
		game.add.tween(btnCerrar.scale).to({x:.01,y:.01},500,Phaser.Easing.Elastic.In,true);
		game.add.tween(btnCerrar).to({alpha:0},500,Phaser.Easing.Exponential.In,true);

		var item = this;
		item.state.checkSelected();
		game.add.tween(this).to( { x: this.originalPosition.x, y: this.originalPosition.y }, 550, Phaser.Easing.Elastic.Out, true).onComplete.add(function () {
			item.input.draggable 	= true;
			item.btnCerrar.visible 	= false;
		});

		/// remuevo item del array de seleccionados ///
		for (var i = itemsSelected.length - 1; i >= 0; i--) {
			if( itemsSelected[i].key === item.key ){
				itemsSelected.splice(i,1);
			}
		};
			MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);
		
	},



	/// evento de out del item para esconder el btn jugar /////
	dragItemOut: function () {
		console.log("******dragItemOut-********");
		if( !this.isSelected ){
			if( this.tooltip.visible ){
				console.log("visible toootlti")
				var tooltip = this.tooltip;
				game.add.tween(this.tooltip).to({y:this.height*.4},200,Phaser.Easing.Elastic.In,true)
				game.add.tween(this.tooltip).to({alpha:0},250,Phaser.Easing.Linear.None,true).onComplete.add(function () {
					tooltip.visible = false;
				});
			}
		}
	},

	/// evento de over del item para mostrar el btn jugar /////
	dragItemOver: function () {
		console.log("******dragItemOver-********");

		if( !this.isSelected ){
			if( !this.tooltip.visible ){
				console.log("visible toootlti")
				this.tooltip.visible = true;
				game.add.tween(this.tooltip).to({y:this.height*.2},500,Phaser.Easing.Elastic.Out,true)
				game.add.tween(this.tooltip).to({alpha:1},250,Phaser.Easing.Linear.None,true);
			}
		}
	},
	startItemDrag:function  (dragItem) {
		console.log("startItemDrag:",dragItem);
		if( !dragItem.isSelected ){
			if( dragItem.tooltip.visible ){
				console.log("visible toootlti")
				var tooltip = dragItem.tooltip;
				game.add.tween(dragItem.tooltip).to({y:dragItem.height*.4},200,Phaser.Easing.Elastic.In,true)
				game.add.tween(dragItem.tooltip).to({alpha:0},250,Phaser.Easing.Linear.None,true).onComplete.add(function () {
					tooltip.visible = false;
				});
			}
		}

	
	},
	stopItemDrag:function (dragItem) {
	

		var isCollitioning = false;
		var collisionContainer = null;
		/////////// chequeo si al soltar el item esta pegando encima de una caja ////////////////
		for (var i = this.collisionsAreas.length - 1; i >= 0; i--) {
			var collitionArea = this.collisionsAreas[i]; ///// recorro el array de las cajas
			var checkCollision = this.game.physics.arcade.overlap(dragItem, collitionArea, this.checkCollision,null,this); ///chequeo si el item toca el area de colisión(sprite) de la caja
			collisionContainer = ( checkCollision )? collitionArea : collisionContainer ; /// si está colisionando obtengo la caja con la que ésta colisiona.
		};

		if( collisionContainer ){//si colisiono con un contenedor lo agrega al contenedor

			if( collisionContainer.addItem(dragItem) ){ //// valido si el contenedor no esta lleno y agrego el item al padre el sprite con el colisiona, es decir una de de las cajas inferiores
				dragItem.btnCerrar.visible = true;

				this.checkSelected();

			}else{
				///// Contenedor lleno /////
				console.log("***** contenedor lleno *******")
				this.sendItemOriginalPos(dragItem);	
						
			}

		}else{
			console.log("****NO Colisión item********")
			this.sendItemOriginalPos(dragItem);
			
		}
	},

	checkItemSelection:function () {

		var ok = game.global.showBanharItemsPop(itemsSelected);

		$('#botonPop').unbind( "click" );
		$("#botonPop").bind('click',function () {
			if( ok ){
				game.global.homeutils["counterStars"].updateCurrentTotal(20);
				game.global.closePop();
				game.state.start('Bañarse2');
			}else{
				game.global.closePop();
			}
		})

	},

	checkSelected:function () {
		var isAllSelected = true;

		for (var i = this.collisionsAreas.length - 1; i >= 0; i--) {
			if ( this.collisionsAreas[i].isFree ) 
				isAllSelected = false
		};

		if( isAllSelected ){
			// this.add.tween(this.containerElements.btnValidar).to({alpha:1},250,Phaser.Easing.Linear.None,true)
			this.containerElements.btnValidar.frame = 1;
			this.add.tween(this.containerElements.btnValidar.scale).to({x:"+.05",y:"+.05"},500,Phaser.Easing.Elastic.Out,true,0,0,true)
			this.containerElements.btnValidar.inputEnabled = true;
			this.containerElements.btnValidar.input.useHandCursor = true;
		}else{
			if( this.containerElements.btnValidar.frame === 1 ){
				// this.add.tween(this.containerElements.btnValidar).to({alpha:.5},250,Phaser.Easing.Linear.None,true)
				this.containerElements.btnValidar.frame = 0;
				this.containerElements.btnValidar.input.useHandCursor = false;
				this.containerElements.btnValidar.inputEnabled = false;
			}
		}

		return isAllSelected;
	},

	sendItemOriginalPos:function  (dragItem) {
		this.add.tween(dragItem).to( { x: dragItem.originalPosition.x, y: dragItem.originalPosition.y }, 550, Phaser.Easing.Elastic.Out, true);
	},

	addItem:function (item) {
		console.log("addItem:",item)
		console.log("container:",this)
		if( !this.isFree ){
			return false;
		}

		this.isFree 		= false;
		item.isSelected 	= true;
		item.collitonObject = this;
		item.input.draggable = false;

		game.add.tween(item).to( { x: this.x, y: this.y }, 250, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
			game.add.tween(item.btnCerrar.scale).to({x:1,y:1},500,Phaser.Easing.Elastic.Out,true)
			game.add.tween(item.btnCerrar).to({alpha:1},500,Phaser.Easing.Exponential.Out,true);
		});
		console.log("**********added item*************:")

		itemsSelected.push(item);

		return true;
	},

	checkCollision: function (dragItem,containerDrag) {
		console.log("****Colisión item********")
		console.log(containerDrag);
	   MSclicgenerico.stop();
	   MSclicgenerico.play();
       MSclicgenerico.setVolume(80);
	},

	shutdown:function  () {
		console.clear()
		console.log("shutdown");
		itemsSelected = [];
	}
};

banhar.juego2 = function () {

	this.bodyPartText 		= 	null;
	this.banho 				= 	null;

	this.contador 			= 	null;
	this.contadorAnimation	= 	null;

	this.cleanAreas			= 	[];
	this.character 			= 	null;
	this.characterContainer = 	null;

	this.bubbles 			= 	null;
	this.waterBaths			= 	[];

	this.posBodyPart 		= 	0;
	this.bodyParts			= 	null;
	this.currentCleanSide	= 	null;

	this.cleanBodyTime		= 	null;
	this.cleanAreaOut		=	true;
	this.cleaningArea		=	false;

	this.limitTime			=	2.5;
	this.timeDown			=	0;
	this.startTime			= 	0;


	this.menu				= 	null;

};

banhar.juego2.prototype = {

	init: function (selectedCharacter) {
		$('body').css('backgroundImage','url()');
		game.global.bacgroundColor("#5eb9ae");
		this.initVars();
	},


	initVars:function () {

		this.bodyPartText 		= 	null;
		this.banho 				= 	null;

		this.contador 			= 	null;
		this.contadorAnimation	= 	null;

		this.cleanAreas			= 	[];
		this.character 			= 	null;
		this.characterContainer = 	null;

		this.bubbles 			= 	null;
		this.waterBaths			= 	[];

		this.posBodyPart 		= 	0;
		this.bodyParts 			= 	game.global.assetsJSON.settings.banharsetting.banhar2.bodyparts;

		this.cleanBodyTime		= 	null;
		this.cleanAreaOut		=	true;
		this.cleaningArea		=	false;

		this.limitTime			=	2.5;
		this.timeDown			=	0;
		this.startTime			= 	0;

		this.menu				= 	null;		
	},

	create: function () {

		this.createBanho();

		this.createWaterBath();

		this.createCharacter();

		this.createCleanAreas();

		this.createBubbles();

		this.createText();

		this.startCount();

		this.createTimer();

		this.createInstructionsBtn();

		this.getMenu();

		console.log("add menu to top")
		this.menu.parent.addChildAt(this.menu,2);

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
		console.log("showInstrucctions de ",this.daytime);
		game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.banhar2);
	},

	getMenu:function () {
		this.menu = game.global.homeutils.getMenuGames();
	},

	createTimer: function () {
		//  Create our Timer
	    timer = this.cleanBodyTime = game.time.create(false);

	    //  Set a TimerEvent to occur after 2 seconds
	    this.cleanBodyTime.add(Phaser.Timer.SECOND * 4, this.endCleanTime, this);
        
	    //  Start the timer running - this is important!
	    //  It won't start automatically, allowing you to hook it to button events and the like.
	    // timer.start();
	},

	createBanho:function () {
		this.banho = this.add.image(0,0,"ducha");
		this.banho.x = this.game.width - ( this.banho.width + 155 );
		this.banho.y = 0
		this.banho.sendToBack();

		banho = this.banho;
	},

	createCharacter:function () {

		this.characterContainer = this.add.group();

		var frameSelected 	= ( game.global.characterSelected )?1:0;										/// true->felix, false->susana
		var keyCharacter	= ( game.global.characterSelected )?"felix-ducha":"susana-ducha";
		this.character 		= this.characterContainer.create( 0, 0, keyCharacter, frameSelected );	/// carga el sprite del caracter	

		this.character.animations.add('front',[0],1,false);
		this.character.animations.add('back',[1],1,false);

		this.characterContainer.x 	= 480;
		this.characterContainer.y 	= 215-92; 

		this.character.animations.play("front");

	},

	createText:function () {

        var titleTextBottomStyle 	= {font: "20px poppinslight", fill: "#ffffff", align: "center"};
        this.titleTextTop		= this.add.text(250, 240, "", titleTextBottomStyle);
        this.titleTextTop.anchor.setTo(0.5,0);
        this.titleTextTop.lineSpacing = -5;

		var titleTextTopStyle 		= {font: "70px poppinssemibold", fill: "#ffffff", align: "center"};
        this.bodyPartText			= this.add.text(250, 320, "", titleTextTopStyle);
        this.bodyPartText.lineSpacing = -25;
        this.bodyPartText.anchor.setTo(0.5,0);
	},

	startCount:function  () {

		game.global.closePop();

		this.contador = this.add.sprite(250,360,"contador-banhar");
		this.contador.anchor.setTo(.5,.5);
		this.contadorAnimation = this.contador.animations.add('countdown',[0,1,2],1,false);
		this.contadorAnimation.onComplete.add(this.endCount, this);

		this.contador.animations.play('countdown');
	},

	endCount:function (sprite, animation) {
		this.add.tween(sprite.scale).to({x:0.01,y:0.01},500,Phaser.Easing.Elastic.In,true).onComplete.add(function () {
			sprite.destroy();
			game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.banhar2);
		});
		this.updateBodyPart();
	},

	updateBodyPart:function  () {

		console.log("***************updateBodyPart**************");
		console.log(this.cleanAreas[this.posBodyPart],this.posBodyPart);

		// this.titleTextTop.text = "Haz clic y sin soltar,\nmueve el mouse en círculos\n hasta lavar";
		this.titleTextTop.text = "";
		this.bodyPartText.text = this.cleanAreas[this.posBodyPart].name;

        this.add.tween(this.titleTextTop.scale).from({x:0.01},500,Phaser.Easing.Elastic.Out,true,500);
        this.add.tween(this.titleTextTop).from({alpha:0},500,"Linear",true,500);

        this.add.tween(this.bodyPartText.scale).from({x:0.01},500,Phaser.Easing.Elastic.Out,true,1000);
        this.add.tween(this.bodyPartText).from({alpha:0},500,"Linear",true,1000);

		this.cleanAreas[this.posBodyPart].inputEnabled 			= true;
		this.cleanAreas[this.posBodyPart].input.useHandCursor 	= true;

        this.cleanAreas[this.posBodyPart].events.onInputDown.add(this.startCleaning, this);
        this.cleanAreas[this.posBodyPart].events.onInputUp.add(this.stopCleaning, this);
        this.cleanAreas[this.posBodyPart].events.onInputOver.add(this.onBodyPartOver, this);
        this.cleanAreas[this.posBodyPart].events.onInputOut.add(this.onBodyPartOut, this);

        var side 		= this.cleanAreas[this.posBodyPart].side;
        if( this.currentCleanSide != side){
	        /*var character 	=  this.character;
	        var tweenCharacterhide = this.add.tween(character).to({alpha:0},Phaser.Timer.HALF,Phaser.Easing.Linear.None,true,0,0,true).onComplete.add(function () {
	        	if( side == "back")
	        		character.frame = 1;
	        	else
	        		character.frame = 0;	        		
	        	// character.animations.play(side);
	        	// character.alpha = 0;
			});*/
			// var tweenCharactershow = this.add.tween(character).to({alpha:1},Phaser.Timer.HALF,Phaser.Easing.Linear.None,true,Phaser.Timer.HALF+Phaser.Timer.QUARTER,0,true);
			// tweenCharacterhide.chain(tweenCharactershow);
	       	this.character.animations.play(side);
			this.currentCleanSide = side;
		}

		// this.cleanAreas[this.posBodyPart].alpha 	= .8;

        // this.waterBath.on = false;
        this.turnOnOfbath(false);

        // this.posBodyPart++;
      
	},

	createCleanAreas: function () {

		// var this.bodyParts = game.settings.banharsetting.banhar2.bodyParts;

		for (var i = this.bodyParts.length - 1; i >= 0; i--) {
			
			var bmd = this.add.bitmapData(this.bodyParts[i].width, this.bodyParts[i].height); 	///Creación del bitmap data
			bmd.ctx.beginPath(); 													/// empezar a llenar el bitmap
			bmd.ctx.rect(0, 0, this.bodyParts[i].width, this.bodyParts[i].height); 				/// se define las dimensiones del rectangulo
			bmd.ctx.fillStyle = '#000000'; 											/// color del relleno
			bmd.ctx.fill();

			var cleanArea 	= this.characterContainer.create( 0, 0, bmd );
			cleanArea.x 	= this.bodyParts[i].x;
			cleanArea.y 	= this.bodyParts[i].y;
			cleanArea.alpha = 0;
			cleanArea.name 	= this.bodyParts[i].parte;
			cleanArea.side  = this.bodyParts[i].side;
			cleanArea.inputEnabled 			= false;
			// cleanArea.input.useHandCursor 	= false;

			this.cleanAreas.push(cleanArea);
		};

		this.cleanAreas = Phaser.ArrayUtils.shuffle(this.cleanAreas);

		console.clear();
		console.log(this.cleanAreas);

	},

	createWaterBath: function () {

		var totalShower = 6;

		for (var i = 0; i < totalShower; i++) {

			var waterBath =  this.add.emitter(game.world.centerX, 200, 200);

		    //	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
		    waterBath.width = 50;

		    waterBath.makeParticles(['gota-ducha']);

		    waterBath.minParticleSpeed.set(-25, 50);
		    waterBath.maxParticleSpeed.set(25, 50);

		    waterBath.setRotation(0, 0);
		    waterBath.setAlpha(1, 1);
		    waterBath.setScale(0.1, 1, 0.1, 1, 1500, Phaser.Easing.Quintic.Out,true);
		    waterBath.gravity = 200;

		    waterBath.start(false, 1500,  5);

		    this.physics.enable( waterBath, Phaser.Physics.ARCADE);

		    waterBath.x = this.banho.x + 450;
		    waterBath.y = this.banho.y + 156;

		    waterBath.on = false;

		    this.waterBaths.push(waterBath);
		};
	    
	    console.log("createBubbles")
	},

	turnOnOfbath:function (on) {

		// this.waterBath.on = on;
	 	// this.waterBath2.on = on;

	    for (var i = this.waterBaths.length - 1; i >= 0; i--) {
	    	this.waterBaths[i].on = on;
	    };
	},

	createBubbles:function () {
		//	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
	    this.bubbles =  this.add.emitter(game.world.centerX, 200, 200);

	    //	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
	    // this.bubbles.width = 50;

	    this.bubbles.makeParticles('burbuja');

	    this.bubbles.minParticleSpeed.set(-50, -50);
	    this.bubbles.maxParticleSpeed.set(50, 50);

	    this.bubbles.setRotation(0, 0);
	    this.bubbles.setAlpha(0.5, 1);
	    this.bubbles.setScale(0.1, 1,0.1, 1, 2000,Phaser.Easing.Linear.None, true);
	    this.bubbles.gravity = 20;

	    //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
	    //	The 5000 value is the lifespan of each particle before it's killed
	    this.bubbles.start(false, 1500, 100, 30);

	    this.physics.enable( this.bubbles, Phaser.Physics.ARCADE);

	    this.bubbles.on = false;
	    //load

	   

	    console.log("createBubbles")

	},

	endCleanTime:function  () {
		 console.log("***********quedo limpio*********");
	},

	onBodyPartOver:function (button, pointer) {
		

		if ( this.cleaningArea ){
			this.cleanAreaOut = false;
			// this.cleaningArea = true;
			// 	this.bubbles.on = true;
	//    this.explosion = this.game.add.audio('explosion'); //Nombre del archivo de sonido
	//	this.explosion.volume = 0.3; //Cambiar el volumen
	//	this.explosion.loop = true; //Si se repite cuando finalice de reproducir
    //		this.explosion.play();//Reproducir
		
			console.log("**********onBodyPartOver**************")
		}
	},

	onBodyPartOut:function (button, pointer) {

		if ( this.cleaningArea ){

			this.cleanAreaOut = true;			
		// 	this.cleaningArea = false;
		// 	this.bubbles.on = false;
			console.log("**********onBodyPartOut**************")
		}
	},

	startCleaning:function () {
		// console.log(Phaser.Pointer.x,Phaser.Pointer.x)
		this.cleaningArea = true;
		this.cleanAreaOut = false;
		// this.cleanBodyTime.start();
        MSducha.stop();
        MSducha.play();
        MSducha.setVolume(80);
        MSburbujas.stop();
        MSburbujas.play();
        MSburbujas.setVolume(80);
		// this.waterBath.on = true;
		this.turnOnOfbath(true);

		this.startTime	= this.time.now;
	},

	stopCleaning:function () {
		this.cleaningArea = false;
		this.cleanAreaOut = true;
		  MSducha.stop();
		  MSburbujas.stop();
	},

	update:function () {
		// if (this.input.mousePointer.isDown){
		if ( this.cleaningArea && !this.cleanAreaOut ){

	    	if( !this.bubbles.on ){
	    		this.bubbles.on = true;
	    		this.turnOnOfbath(true);
	    	}

	    	if( game.device.desktop ){
		    	this.bubbles.x = this.input.activePointer.x;
		    	this.bubbles.y = this.input.activePointer.y;
		    }else{
		    	this.bubbles.x = this.input.pointer1.x;
		    	this.bubbles.y = this.input.pointer1.y;
		    }
	    }else{
	    	this.bubbles.on = false;
	    	this.turnOnOfbath(false);
	    	this.startTime	= this.time.now;
	    }

	    if( this.bubbles.on ){
	    	this.timeDown = ( this.time.now - this.startTime ) / 1000;
			if( this.timeDown > this.limitTime ){
				console.log("**********cambiar de pierna*********")
				this.stopCleaning();

				this.cleanAreas[this.posBodyPart].inputEnabled 			= false;
				this.cleanAreas[this.posBodyPart].alpha 				= 0;

				this.posBodyPart++;
				if( this.posBodyPart < this.cleanAreas.length ){
					game.global.homeutils["counterStars"].updateCurrentTotal(5);
					this.updateBodyPart();
				}else{
					// this.waterBath.on = false;
					this.turnOnOfbath(false);
					this.endGame();
				}
			}
		}
	},

	endGame:function () {

		game.global.homeutils["counterStars"].updateTotal();

		game.global.showFinalPopGame('banhar', this.onClosePopHandler);

		game.global.homeutils.itemGameSeleted.frame 			= 2;
		game.global.homeutils.itemGameSeleted.btnJugar.visible 	= false;
	},

	onClosePopHandler:function () {

		$('#botonPop').unbind( "click" );
		$('.modal').hide();
		game.state.start('Home',true,false,game.global.characterSelected);
	},

	shutdown:function () {

		if(popPreguntas)				//// valido si existe el pop de preugntas para destruirlo
			popPreguntas.destroy();
	}
};