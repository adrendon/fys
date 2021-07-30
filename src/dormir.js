/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */

var dormir = {};
var itemsSelecteddormir = [];



dormir.juego1 = function (game) {

	this.daytime				= null;

	this.oldCounterPositionX 	= null;
	this.oldCounterPositionY 	= null;

	this.timerEvent 			= null;	
	this.totalTimerCount		= null;
	this.timeIsOver				= null;

	this.timerContainer			= null;

	this.bgCloset				= null;
	this.puertas 				= null;

	this.maskItems 				= null;

	this.dormirSettings			= null;
	this.itemSpeed 				= null;
	this.itemSpeedInc			= null;

	this.startToMove			= false;

	this.panelItemsSelected		= null;

	this.assetsCharacter 		= null;
	this.assetsOthers	 		= null;
	this.items 					= null;

	    itemsSelecteddormir			= [];
};

dormir.juego1.prototype = {

	init:function (data) {

		console.log("init dormir 1:",data);

		this.daytime = data.daytime;

		/////set the background color for the preload//////
		game.global.bacgroundColor("#0080b8");

		///seteo el contador del actual juego en 0///
		game.global.homeutils["counterStars"].initCurrent();

		this.initOptions();
	},

	initOptions:function (argument) {

		/// get the total timer count
		this.dormirSettings 	= game.global.assetsJSON.settings.dormirSettings.dormir1;

		this.totalTimerCount 	= this.dormirSettings.timerDuration;
		this.itemSpeed			= this.dormirSettings.itemSpeed;
		this.itemSpeedInc 		= this.dormirSettings.itemSpeedInc;

		this.assetsCharacter 	= (game.global.characterSelected)?this.dormirSettings.prendas.ninho:this.dormirSettings.prendas.ninha;
		this.assetsOthers 		= this.dormirSettings.prendas.otros;

		this.items				= [];

		this.maskItems			= null;

		this.timeIsOver = false;
       
		if(popPreguntas)				//// valido si existe el pop de preugntas para destruirlo
			popPreguntas.destroy();

		popPreguntas = new TimerPopPreguntas(game,20,40,game.global.assetsJSON.preguntas.dormir,game.global.assetsJSON.preguntas.puntos) /// creo una nueva instancia

	},

	create:function () {

		///Intrucciones///
		this.createInstructionsBtn();

		///change counter position///
		this.changePointsCounterPos();

		///create closet///
		this.createCloset();

		///create mask///
		this.createMask();

		///Creo panel de items seleccionados///
		this.createPanelSelectedItems();

		///Init timer////
		this.initTimer();

		///crete kids clothes///
		this.createItems();

		///mask items////
		this.addMask();

		///Instrucciones///
		// this.showInstrucctions();

		///Disparo el evento de click del btn del plato////
		// this.time.events.add(Phaser.Timer.SECOND*5, function () {
		// }, this);

		this.stage.addChild(game.global.homeutils["containerDragItemsGroups"]);

		this.startTimer();
	},

	addMask:function () {
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].mask = this.maskItems;
		};
	},

	startTimer:function () {
		
		this.time.events.add(Phaser.Timer.QUARTER, function () {
			this.puertas.animations.play('openDoors');			
		}, this);
	},

	createInstructionsBtn:function () {
		this.btnInstructions 						= this.add.sprite(0,0,'btn-ayuda');
		this.btnInstructions.x 						= this.world.width - this.btnInstructions.width ;
		this.btnInstructions.y 						= 20;
		this.btnInstructions.inputEnabled 			= true;
		this.btnInstructions.input.useHandCursor 	= true;
		this.btnInstructions.events.onInputDown.add(this.showInstrucctions, this);
	},

	showInstrucctions:function () {
		/****open pop up*****/
		console.log("showInstrucctions de ",this.daytime);
		game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.dormir1);
	},

	changePointsCounterPos:function  () {

		// previousPosition

		///le paso la posición///
		this.previusCounterPositionX =  game.global.homeutils["counterStars"].x;
		this.previusCounterPositionY =  game.global.homeutils["counterStars"].y;

		game.global.homeutils["counterStars"].y = this.btnInstructions.y + this.btnInstructions.height*1.45;
		game.global.homeutils["counterStars"].x = this.world.width - game.global.homeutils["counterStars"].width*.5 ;
	},

	createCloset:function () {

		this.bgCloset = this.add.sprite(this.world.width*.5,15,"bg-closet");
		this.bgCloset.anchor.set(.5,0);
		this.bgCloset.sendToBack();

		this.puertas 			= this.add.sprite(0,0,"puerta-closet");
		this.puertas.x 			= this.bgCloset.x - 57;
		this.puertas.y 			= this.bgCloset.y + this.bgCloset.height*.5 + 40;
		this.puertas.inputEnabled 				= true;
		this.puertas.input.pixelPerfectClick 	= true;
		this.puertas.input.pixelPerfectOver 	= true;
		this.puertas.anchor.setTo(.5);
		this.puertas.scale.set(1,1.12);

		var totalFramePuertas = 11;
		var frames = [];
		for (var i = 0; i < totalFramePuertas; i++) {
			frames.push(i);
		};

		this.puertasAnimation 	= this.puertas.animations.add('openDoors',frames,16,false);
		this.puertasAnimation.onComplete.add(this.endOpenDoors, this);

		this.puertas.animations.add('closeDoors',frames.reverse(),16,false);
	
	},

	endOpenDoors:function () {
		this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this); ///start counter
		this.startToMove = true;																///habilito el movimiento de las prendas

		for (var i = 0; i < this.items.length; i++) {
			this.items[i].body.velocity.x 	= this.itemSpeed;
		};

		/*this.time.events.add(Phaser.Timer.SECOND * 1, function () {
			this.puertas.animations.play('closeDoors');
		}, this);*/
	},

	createMask:function () {
		console.log("createMask")
		this.maskItems = this.add.graphics(0, 0);
	    this.maskItems.itemType = "mask";
	    this.maskItems.beginFill(0xffffff);
	    this.maskItems.drawRect(0, 0, this.dormirSettings.maskWidth, this.dormirSettings.maskHeight);
	    // this.maskItems.alpha = 0;
	    this.maskItems.x = this.bgCloset.x - 280;
	    this.maskItems.y = this.bgCloset.y + 115;
	},

	createItems:function  () {

		console.log("*******************Create items*******************")

		this.addItems(this.assetsCharacter);
		this.addItems(this.assetsOthers);

		this.items = Phaser.ArrayUtils.shuffle(this.items);

		this.setItemsPos();


		console.log(this.items);

			this.showInstrucctions();
		

	},

	addItems:function (itemsAssets) {
		for (var i = 0; i < itemsAssets.tipo.length; i++) {

			var item 						= this.add.sprite(0,this.maskItems.y,itemsAssets.key);
			item.frame 						= i;
			item.tipo 						= itemsAssets.tipo[i];
			item.inputEnabled 				= true;
			item.input.useHandCursor 		= true;		
			item.input.pixelPerfectAlpha 	= 255;
			// item.input.pixelPerfectClick 	= true;
			item.input.pixelPerfectOver  	= true;
			item.anchor.set(.5,0);
			item.events.onInputDown.add(this.selectedClothesType, this);

			this.physics.arcade.enable(item);  ////habilito motor físico para agregarle velocidad a los elementos

			this.items.push(item);
		};
	},

	setItemsPos:function () {

		for (var i = 0; i < this.items.length; i++) {
			this.items[i].x = this.maskItems.x + this.dormirSettings.itemWidth*( i + .5);
			this.items[i].sendToBack();
			// this.items[i].body.velocity.x 	= this.itemSpeed;
			this.items[i].arrayPos 			= i;
			
		};

		this.bgCloset.sendToBack();
	},

	selectedClothesType:function (item, pointer) {
		if( this.startToMove ){
			console.log("prenda tipo:",item.tipo)
       //   console.log("mirar posicion:", item.tipo, pointer);

			if( item.tipo != "otros" ){ ///chequeo que sea una prenda valida

				if( this.panelItemsSelected[item.tipo].frame === 1 ){ 		///chequeo si la prenda no ha sido elegida aún

					game.global.homeutils["counterStars"].updateCurrentTotal(this.dormirSettings.points);

					var tipo = item.tipo;									/// cojo el tipo de categoria del elemento seleccionado
					this.panelItemsSelected[tipo].frame 	= 0;			/// cambio el frame en el panel de seleccionado de la categoria del item seleccionado
					this.panelItemsSelected[tipo].scale.set(1);				/// me aseugro de poner la escala en 1 y realizo una transición de escala
					this.add.tween(this.panelItemsSelected[tipo].scale).to({x:1.5,y:1.5},Phaser.Timer.QUARTER,Phaser.Easing.Elastic.Out,true,0,0,true);	

					var gancho = this.add.sprite(item.x,item.y,"gancho");	/// Creo una imagen del gancho vacio
					gancho.anchor.set(.5,0);								/// seteo el punto de rotación del elemento
					gancho.mask = this.maskItems;							/// meto dentro de la mascara el gancho
					this.physics.arcade.enable(gancho);						/// habilito el motor físico para agregarle velocidad al gancho
					gancho.body.velocity.x 	= this.itemSpeed;				/// asigno la velodcidad por defecto

					var arrayPos = item.arrayPos;							/// busco la posición en el array de objetos del item para actualizar la posición del gancho

					//console.log("posicion",arrayPos);
					
					item.events.onInputDown.remove(this.selectedClothesType, this); /// remuevo evento de click del item
					item.visible = false;									/// oculto el item seleccionado para que sea visible el gancho
					
					// item.destroy();
					
					this.items[arrayPos] = gancho;							/// le asigno al gancho la posicón del item dentro del array de elementos

					this.puertas.bringToTop();								/// Jalo la puerta hacía al frente para que el gancho no quede por encima de la puerta

					this.updateSpeed();										/// actualizo la velocidad de los items

				}else{

				}
			}

			/// chequeo si todas los elementos del panel de seleccionados ya fueron elegidos
			this.allItemsSelectedChecker();

		}
	},

	allItemsSelectedChecker:function () {		
		var allItemsSelected = this.checkSelectedItems();			

		if(allItemsSelected){ ////si todas las categorias fueron elegidas paro el juego
			// this.startToMove = false;
			this.stopTimer();				
			console.log("*******************************************")
			console.log("Todas las prendas han sido seleccionadas")
             var ok = game.global.showDormirItemsPop(itemsSelecteddormir);
	               $('#botonPop').unbind( "click" );
		           $("#botonPop").bind('click',function () {			
                    if( ok ){                      
			           game.global.homeutils["counterStars"].updateCurrentTotal(20);
					   game.global.closePop();
					   //this.create();
					   game.state.start('Dormir2');
					}else{
				
						   game.global.closePop();	
						 
						 }
					})	

		}
	},

	updateSpeed:function () {

		console.log("*********************************");
		console.log("updateSpeed:",this.itemSpeed);
		this.itemSpeed += this.itemSpeedInc; 

		for (var i = 0; i < this.items.length; i++) {
			this.items[i].body.velocity.setTo(0, 0);
			this.items[i].body.velocity.x = this.itemSpeed;
		};
		console.log("Speed updated:",this.itemSpeed);
	},

	checkSelectedItems:function () {

		var noCheckItem = 0;

		for (var i = 0; i < this.dormirSettings.tiposPrendas.length; i++) {

			noCheckItem += this.panelItemsSelected[this.dormirSettings.tiposPrendas[i]].frame;				/// chequeo si ya han sido selecionadas prendas de cada categoria
		}

		return (!noCheckItem)?true:false;
	},

	initTimer:function () {

		///create timer container
		this.timerContainer = this.add.group();
		this.timerContainer.bg = this.timerContainer.create(0,0,"bg-timer");
		this.timerContainer.bg.scale.set(1.18);

		this.timerContainer.currentTimerCount = 0;
		this.timerContainer.totalTimerCount = this.totalTimerCount ;
		this.timerContainer.remainingTimerCount = 0;


		var counterStyle = {font: "26px poppinssemibold", fill: "#FFFFFF", align: "center"};
		this.timerContainer.counterText = this.add.text(80, 62, this.timerContainer.totalTimerCount, counterStyle);
		this.timerContainer.counterText.anchor.set(.5);

		this.timerContainer.add(this.timerContainer.counterText);

		this.timerContainer.updateCounter = function () {

			var timeOut = false;

			this.currentTimerCount++;

			this.remainingTimerCount = this.totalTimerCount - this.currentTimerCount;

			this.counterText.text = this.remainingTimerCount.toString();

			if( this.currentTimerCount === this.totalTimerCount ){
				timeOut = true;
			}

			console.log("current timer count:",(this.totalTimerCount - this.currentTimerCount) );

			return timeOut;
		}

		this.timerContainer.x = game.world.width - this.timerContainer.bg.width - 12;
		this.timerContainer.y = 200;

		///init timer
		// this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

	},

	updateCounter:function () {
		var isTimeOut = this.timerContainer.updateCounter();
		if( isTimeOut ){///chequeo si el tiempo termino
			this.stopTimer();
			var ok = game.global.showDormirItemsPop2(itemsSelected);
	               $('#botonPop').unbind( "click" );
		           $("#botonPop").bind('click',function () {			             
                    if( ok ){ 
                      game.global.closePop();			           
					}
					})	
		}

	},

	stopTimer:function () {
		game.time.events.remove(this.timerEvent);   ////remuevo el timer
		this.timeIsOver = true;						//// activo bandera de tiempo terminado
		this.puertas.animations.play('closeDoors'); //// cierro el closet
	},

	createPanelSelectedItems:function () {

		this.panelItemsSelected = this.add.group();
		this.panelItemsSelected.x = this.puertas.x + 20;
		this.panelItemsSelected.y =  this.puertas.y + this.puertas.height*.33;

		this.panelItemsSelected.bg = this.panelItemsSelected.create(0,0, "bg-items-selected")
		this.panelItemsSelected.bg.anchor.set(0.5,0);

		var offsetX = 58;
		for (var i = 0; i < this.dormirSettings.tiposPrendas.length; i++) {

			var key = this.dormirSettings.tiposPrendas[i];
			var vo = this.panelItemsSelected[key] = this.panelItemsSelected.create(-this.panelItemsSelected.bg.width*.5 + offsetX + i*68,25,key+"-dormir",1);
			this.panelItemsSelected[key].anchor.set(0.5,0);

		};
	

	},

	update:function  () {
		
		if( !this.timeIsOver && this.startToMove ){
			this.updateSpeedItems();
		}else if( this.timeIsOver ){
			this.stopItems();
			// console.log("Fin de juego");
		}

	},

	updateSpeedItems:function () {

		for (var i = 0; i < this.items.length; i++) {

			if(this.items[i].x <= -(this.dormirSettings.itemWidth*.5) ){
				var newI = ( (i-1) < 0 )?this.items.length-1: i-1; 
                this.items[i].x = this.items[newI].x+ this.dormirSettings.itemWidth;

			}
			
		};
	},

	stopItems:function () {

		for (var i = 0; i < this.items.length; i++) {

			this.items[i].body.velocity.setTo(0, 0);
			this.items[i].inputEnabled = false;
		};
	},

	shutdown:function  () {		
		console.log("return to old pos counterStars",this.previusCounterPosition)
		game.global.homeutils["counterStars"].x = this.previusCounterPositionX;
		game.global.homeutils["counterStars"].y = this.previusCounterPositionY;
	}
};

///parte 2

dormir.juego2 = function (game) {

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

	
}

dormir.juego2.prototype = {

	init:function (data) {

	//	console.log("comer2:",data)
		//this.daytime = data.daytime;
		this.setOptions();
	},

	setOptions:function () {

		///seteo el contador del actual juego en 0///
		game.global.homeutils["counterStars"].initCurrent();
		
		this.typeOfItem = game.global.assetsJSON.settings.dormirSettings.dormir2;
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
		game.global.showIntructionsGame(game.global.assetsJSON.messagespop.instrucciones.dormir2);
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