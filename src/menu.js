/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */

 var MSfondo = new buzz.sound("assets/audio/MUSICAOP1.ogg"),
    MSalerta = new buzz.sound("assets/audio/EFECTOALERTA4.ogg"),
    MSclicgenerico = new buzz.sound("assets/audio/EFECTOCLICKBOTONES.ogg"),
    MSpuntos = new buzz.sound("assets/audio/EFECTOESTRELLA.ogg"),
    MSganar = new buzz.sound("assets/audio/EFECTOGANASTE2.ogg"),
    MSganarfin = new buzz.sound("assets/audio/EFECTOGANASTE1.ogg"),
    MSerror = new buzz.sound("assets/audio/EFECTOINTENTAOTRAVEZ.ogg");

var felix = null;
var susana = null;
var isOver = false;
var isOut = false;
var popPreguntas = null;
var menu = {};
menu.prehome = function () {
	this.susana 		= null;
	this.susanaGroup	= null;
	this.susanaText  	= null;
	this.susanaX 		=  900;

	this.felix 			= null;
	this.felixGroup 	= null;
	this.felixText 		= null;
	this.felixX 		=  280;
	
	this.background 	= null;
	this.tween 			= null;
};
menu.prehome.prototype = {
	init:function  () {
		$('body').css('backgroundImage','url(assets/images/home/bg-prehome.png)');

		// game.global.showQuestionPop(game.global.assetsJSON.preguntas.comer[5]);
	},

	create: function () {
		/////setting the background//////
		// this.background					= this.add.sprite(0, 0, 'bgPrehome');
		// this.background.x 				= this.world.centerX;
		// this.background.y 				= this.world.centerY;
		// this.background.anchor.set(.5);
		///text styles////
		var textStyle = {font: "60px poppinssemibold", fill: "#FFFFFF", align: "center"};

		////////////setting felix///////////////
		this.felix 				= this.createButton(0,this.world.centerY,'felix-pre');
		this.felixX 			= game.width * .5 - this.felix.width*.5;
		this.felix.x 			= this.felixX;
		this.felix.oriX			= this.felixX;
		felix = this.felix;
		this.felixText 			= this.add.text(this.felix.x-200, this.world.centerY, "Félix", textStyle);
		// this.felixGroup.add(this.felix);
		// this.felixGroup.add(this.felixText);


		////////////setting susana///////////////
		this.susana 			= this.createButton(0,this.world.centerY,'susana-pre');
		this.susanaX 			= game.width * .5 + this.susana.width*.6;
		this.susana.x 			= this.susanaX;
		this.susana.oriX		= this.susanaX;
		susana = this.susana;
		this.susanaText 		= this.add.text(this.susana.x+10, this.world.centerY, "Susana", textStyle);
		// this.felixGroup.add(this.susana);
		// this.felixGroup.add(this.susanaText);

		// console.log(game.debug)
	},

	createButton: function (posx, posy, key) {
		var button						= this.add.sprite(posx,posy,key);
		button.inputEnabled 			= true;
		button.input.priorityID 		= 1;
		button.input.useHandCursor 		= true;
		// button.input.pixelPerfectOver 	= true;
		// button.input.pixelPerfectOver 	= true;
		button.anchor.set(.5);
		// button.x 				= this.world.centerX + button.width;
		// button.x 						= posx;
		// button.y 						= posy;

        button.events.onInputDown.add(this.checkCharacterDown, this);
        button.events.onInputUp.add(this.checkCharacterUp, this);

        if(game.device.desktop){
	        button.events.onInputOver.add(this.onOverCharacter, this);
	        // button.game.events.onUnitMoveSelect = new Phaser.Signal();
	        // button.events.onInputOut.add(this.onOutCharacter, this);
	    }
	    return button;
	},

	onOverCharacter: function (element) {
		
		$("#game").css('cursor','pointer');
		if (this.tween && this.tween.isRunning || element.scale.x === 1.3){
			console.log("onOverCharacter return");
		 	return false;
		}
		isOver = true;
		//////////////PERSONAJE NO SELECCIONADO/////////////////////////
		var posX 					= (element.key == "felix-pre")?this.susanaX:this.felixX;
		var character 					= (element.key == "felix-pre")?this.susana:this.felix;
		// character.inputEnabled 			= false;	
		// character.input.useHandCursor 	= false;	
		this.add.tween(character.scale).to( { x: .7, y: .7 }, 700, Phaser.Easing.Exponential.Out, true);
		this.add.tween(character).to( { x:character.oriX }, 700, Phaser.Easing.Exponential.Out, true);

		////////////////PERSONAJE SELECCIONADO/////////////////////////
		this.world.bringToTop(element);
		var characterEvent 						= (element.key == "felix-pre")?this.felix:this.susana;
		// characterEvent.inputEnabled 			= false;
		// characterEvent.input.useHandCursor 		= true;
		////Callback evento OUT////////	
		var outhandler 							= this.onOutCharacter;

		var offsetX = (element.key == "felix-pre")?-element.width*.3:element.width*.4;

		this.add.tween(element.scale).to( { x: 1.3, y: 1.3 }, 700, Phaser.Easing.Exponential.Out, true);
		this.tween = this.add.tween(element).to( { x: this.world.centerX + offsetX }, 700, Phaser.Easing.Exponential.Out, true).onComplete.add(function (item) {
			// console.log(characterEvent);
			characterEvent.events.onInputOut.add(outhandler, game);
			// characterEvent.inputEnabled 		= true;
			isOver = false;	
			// characterEvent.input.useHandCursor 	= true;	

			// character.inputEnabled 				= true;	
			// character.input.useHandCursor 		= false;

			this.tween 							= null;
		});

		// this.add.tween(character).to( { x: this.world.centerX }, 700, Phaser.Easing.Exponential.Out, true);
		// this.add.tween(character).to( { scale:{x: .7, y: .7} }, 500, Phaser.Easing.Exponential.Out, true);
		MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);
	},
	onOutCharacter: function (element) {
		
		// $("#game").css('cursor','');
	

		if (this.tween && this.tween.isRunning || element.scale.x === 1 || isOver){
			// console.log("onOutCharacter return");
	 	 	return;
	 	 }
		// console.log("onOutCharacter entra");

		var character = (element.key == "felix-pre")?susana:felix;
		// console.log(character);
		// character.inputEnabled = false;
		this.add.tween(character.scale).to( { x: 1, y: 1 }, 700, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
			// character.inputEnabled = true;
		});
		
	 	var posX 					= (element.key == "felix-pre")? game.width * .5 - element.width*.5: game.width * .5 + element.width*.6;
	 	console.log(posX)
	 	console.log(game.width * .5)
	 	console.log(element.width*.5)
	 	
		var characterEvent			= (element.key == "felix-pre")?felix:susana;

		this.add.tween(element.scale).to( { x: 1, y: 1 }, 700, Phaser.Easing.Exponential.Out, true);
		this.tween = this.add.tween(element).to( { x: element.oriX }, 700, Phaser.Easing.Exponential.Out, true).onComplete.add(function (item) {
			characterEvent.events.onInputOut.removeAll();
			this.tween = null;
		});

	},
	checkCharacterDown: function(element) {
		MSalerta.stop();
	    MSalerta.play();
        MSalerta.setVolume(80);
		//console.clear();
		//console.log("checkCharacterDown");
		var seleccion 					= element.key;
		game.global.characterSelected 	= (seleccion == "felix-pre")?true:false;
		//console.log("seleccion:"+this.seleccion);
		//console.log("game.global.characterSelected:"+game.global.characterSelected);
		// debugger;
		// if(!game.device.desktop){
		this.tween = this.add.tween(element.scale).to( { x: 1.35, y: 1.35 }, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function (item) {
			game.state.start('Home',true,false,game.global.characterSelected);				 
		});
		// }
	},
	checkCharacterUp: function(element) {
		console.log("checkCharacterUp");
		if(!game.device.desktop){
			this.tween = this.add.tween(element.scale).to( { x: 1.0, y: 1.0 }, 500, Phaser.Easing.Exponential.Out, true);
		}else{
			this.tween = this.add.tween(element.scale).to( { x: 1.3, y: 1.3 }, 500, Phaser.Easing.Exponential.Out, true);			
		}
		this.tween.onComplete.add(function(item) {
			console.log("checkCharacterUp:"+element.key);
		}, element);
		// this.state.start('Prehome',true,false,this.seleccion);
	},
	render: function () {
		// game.debug.spriteBounds(this.susana, "#ff0000", false);
		// game.debug.spriteBounds(this.felix, "#ff0000", false);
	},
	resize: function (width, height) {
		console.log(width,height);
	}
};

var currenteBgGroup;
var platFormsGroups;
var platFormsGroupsObject;

var stageIsTween 			= false;
var indexStageDelete 		= 0;
var currentPosIndexStage 	= 0;
var toggleComboOption		= false;
var isAlertShowing 			= false;

menu.home = function (game) {

	this.colors 						= ["#e9c541","#fba232","#52c0d7"]; /// colors background

	this.dragItemContainersarray 		= null; ////array te items
	this.dragItemContainersGroup		= null; //// Grupo contenedor de los sprites 			Grupo

	this.containerDragItemsGroupsarray	= null; //// array contenedor de las cajas de arrastre 
	this.containerDragItemsGroups  		= null; //// Grupo contenedor de las cajas de arrastre 	Grupo
	this.containerItemsbgArray			= null; //// Grupo contenedor de las cajas de arrastre

	this.stagesItemsGameGroup			= null; /// Grupo contenedor de los escenarios de juego
	this.stagesItemsGameGroupContainer	= null; /// Grupo contenedor de los escenarios de juego
	this.stagesItemsGameArray			= null; /// Array de los escenearios de juego

	currenteBgGroup						= null; //// Fondo actualmente seleccionado 			Grupo
	platFormsGroups						= null; ////	Grupo contenedor de plataformas			Grupo
	platFormsGroupsObject				= null; //// Array contenedor de las plataformas

	this.prevStgbtn						= null; ///btn para mover slide de stages
	this.prevbtnShadow					= null; ///sombra boton
	this.nextStgbtn						= null; ///btn para mover slide de stages
	this.nextbtnShadow					= null; ///sombra boton

	this.avatarFelix					= null;
	this.avatarSusana					= null;
	this.avatarSelected					= null;

	this.comboContainerGroup			= null;
	this.toggleComboOption				= false;

	this.characterSelected 				= null;

	this.btnHome 						= null;

	this.items 							= [];

	//console.log("menu.home")
	//console.log(game)
	this.timeoutplayerInterval			= Phaser.Timer.SECOND * 60;
	this.timeoutplayer	 				= this.timeoutplayerInterval*2;
};
menu.home.prototype = {
	init: function (selectedCharacter) {
		isAlertShowing = false;
		console.clear();
		$('body').css('backgroundImage','url()');
		this.characterSelected = (selectedCharacter)?selectedCharacter:game.global.characterSelected;
		console.log("Personaje seleccionado:"+game.global.characterSelected);
		console.log("characterSelected:"+this.characterSelected);
	},
	create: function () {

		///////Crear Drag item juegos//////////
		// console.clear();
		console.log("crear contenedores de items",this.dragItemContainersarray );

		// if( !this.dragItemContainersarray ){

			////////habilita motor físico para las colisiones////////
			this.game.physics.startSystem(Phaser.Physics.ARCADE);

			////////setting background////////////
			this.changeBackground("#f8c927");

			///Contador de estrellas///
			if( !game.global.homeutils["counterStars"] ){
				this.createCounterStars();
			}else{
				this.counterStarsGroup = game.global.homeutils["counterStars"];

				///seteo el contador del actual juego en 0///
				this.counterStarsGroup.initCurrent();;
			}

			///// create back ground //////
			this.createBackgrounds();

			///// create stage groups //////
			this.createStageGroup();

			///// create control slide stages //////
			this.createControlStageGal();

			///// create character //////
			this.createAvatars();

			///// create container items //////
			if( !game.global.homeutils["containerDragItemsGroups"] ){
				this.createContainerItems();
			}else{
				this.stage.addChildAt(game.global.homeutils["containerDragItemsGroups"],0);
			}

			///////Crear Drag item juegos//////////
			this.createDragItem();

			//////Create combo select character/////
			this.createComboCharacter();

			this.changeCharacter(this.characterSelected);

			////boton home////
			if( !game.global.homeutils["btnHome"] ){
				this.createHomeBtn();				
			}else{
				this.btnHome = game.global.homeutils["btnHome"];
			}

			game.time.events.add(Phaser.Timer.SECOND * 1, this.showWelcomeMessage, this);

			this.setOriParentContainerItem();

			// if( game.global.homeutils["containerDragItemsGroups"] )
			// 	this.updateItemPos();
		// }

		///// Set overlap collision///
	},

	createCounterStars:function () {

		this.counterStarsGroup = this.add.group();
		this.counterStarsGroup.name = "starsContainer";

		this.counterStarsGroup.totalStars = 0;   ///conteo de estrellas totales
		this.counterStarsGroup.current = 0;		 /// conteo de estrellas obtenidas en cierto estado

		this.counterStarsGroup.bg 	= this.counterStarsGroup.create(0,0,"icon-game-bg");
		this.counterStarsGroup.bg.anchor.set(0.5);

		////imagen estrella////
		this.counterStarsGroup.star 	= this.counterStarsGroup.create(0,0,"estrellas");
		this.counterStarsGroup.star.x 	= -this.counterStarsGroup.bg.width*.5 + this.counterStarsGroup.star.width*.5;
		this.counterStarsGroup.star.y 	= 0;
		this.counterStarsGroup.star.anchor.set(0.5);


		////texto contador estrella////
		var textStyle = {font: "25px poppinssemibold", fill: "#FFFFFF", align: "center"};
		this.counterStarsGroup.textCount = this.add.text(5, 5, "x50", textStyle);
		this.counterStarsGroup.textCount.setShadow(-2, 2, 'rgba(0,0,0,0.3)', 0);
		this.counterStarsGroup.textCount.anchor.set(.5);
		this.counterStarsGroup.add( this.counterStarsGroup.textCount );

		this.counterStarsGroup.x = this.stage.width - this.counterStarsGroup.bg.width*1.8 ;
		this.counterStarsGroup.y = this.counterStarsGroup.bg.height*.5;

		//// pongo en cero el contador de cada juego ///
		this.counterStarsGroup.initCurrent = function () {

			///pongo en cero el current despues de actualizar///
			this.current = 0;
			this.totalStars += this.current;

			this.textCount.text = "x"+ this.totalStars.toString();
			this.star.scale.set(1);
		};

		//// actualizo contador de estrellass///
		this.counterStarsGroup.updateTotal = function () {
           // saniddo del fondo
		    MSfondo.loop();
            MSfondo.play();
            MSfondo.setVolume(30);
					
			/// actualizo contador///
			this.totalStars += this.current;
			this.textCount.text = "x"+ this.totalStars.toString();

			///actualizo total estrellas en pop up//
			$("#total-stars").text(this.totalStars.toString());

			///pongo en cero el current despues de actualizar///
			this.current = 0;

			this.star.scale.set(1);
			game.add.tween(this.star.scale).to({x:1.5,y:1.5},250,Phaser.Easing.Exponential.Out,true,0,2,true);
		};

		////actualizo el puntaje actual///
		this.counterStarsGroup.updateCurrentTotal = function (inc) {
MSerror.stop();
MSpuntos.stop();
		      if(inc > 0){
                
				MSpuntos.play();
				MSpuntos.setVolume(80);

		      }else{
		        
				MSerror.play();
				MSerror.setVolume(80);
		      }
			///Incremento el contador actual///
			this.current += inc;
			

			///valido que la suma no sea menor a cero, si lo es pongo en cero el total actual////
			var currentTotal = this.totalStars + this.current;
			if( currentTotal <= 0 ){
				currentTotal = 0;
				this.current = 0;
			
              }

			this.textCount.text = "x"+ currentTotal.toString();

            
			///Transición de la estrella////
			this.star.scale.set(1);
			game.add.tween(this.star.scale).to({x:1.5,y:1.5},250,Phaser.Easing.Exponential.Out,true,0,0,true);

		};

		this.counterStarsGroup.updateTotal();

		this.stage.addChildAt(this.counterStarsGroup,1);
		
	},

	setOriParentContainerItem:function () {

		if ( game.global.homeutils["containerDragItemsGroupsarray"] ) {

			for (var i = 0; i < game.global.homeutils["containerDragItemsGroupsarray"].length; i++) {

				console.log('********game.global.homeutils["containerDragItemsGroupsarray"][i]****')
				console.log(game.global.homeutils["containerDragItemsGroupsarray"][i])

				var containerDayGroup = game.global.homeutils["containerDragItemsGroupsarray"][i];

				for (var j = 0; j < containerDayGroup.items.length; j++) {

					var dragitem = containerDayGroup.items[j];
					dragitem.showBtnJugar = true;

					for (var k = 0; k < this.dragItemContainersarray.length; k++) {

						if( dragitem.key ===  this.dragItemContainersarray[k].parentof ){

							console.log("parentof:",dragitem);
							dragitem.oriParentContainer = this.dragItemContainersarray[k];
							this.addStage(dragitem.key,containerDayGroup.key,containerDayGroup.colorBg);		///Agrego stage del juego arrastrado
							dragitem.btnCerrar.events.onInputDown.add(this.removeDragitem, dragitem);
							this.getSlideStagesPos(dragitem);	
						}
					};
				};
			};
		}
	},

	createStarCounter:function () {
		
	},

	showWelcomeMessage:function  () {
	//	  MSclicgenerico.stop();
		if( game.global.characterSelected ){
			this.showAlertmessage(game.global.assetsJSON.alertshome.felixselectedmessage,4000);
			
	//	      MSclicgenerico.play();
    //          MSclicgenerico.setVolume(30);
		}else{			
			this.showAlertmessage(game.global.assetsJSON.alertshome.susanaselectedmessage,4000);
		
	//	      MSclicgenerico.play();
    //          MSclicgenerico.setVolume(30);
		}
	},

	createComboCharacter:function  () {

		this.comboContainerGroup = this.add.group();		

		this.comboContainerGroup.combo 						= this.comboContainerGroup.create(0,0,'combo-icon-select',0);
		this.comboContainerGroup.combo.inputEnabled 		= true;
		this.comboContainerGroup.combo.input.useHandCursor 	= true
		this.comboContainerGroup.combo.events.onInputDown.add(this.showComboOptions,this);		
		this.comboContainerGroup.combo.events.onInputOver.add(this.showComboMessage, this); /// evento de over para mostrar el boton

		var frameSelected = (game.global.characterSelected)?1:0;
		this.comboContainerGroup.characterSelected		= this.comboContainerGroup.create(this.comboContainerGroup.combo.width*.34, this.comboContainerGroup.combo.height*.35, 'combo-character',frameSelected);
		this.comboContainerGroup.characterSelected.anchor.setTo(.5,.5);
		this.comboContainerGroup.characterSelected.bringToTop();		

		var groupOption = this.add.group();
		this.comboContainerGroup.optionContainer = groupOption;
		this.comboContainerGroup.add(groupOption);
		this.comboContainerGroup.sendToBack(groupOption);

		this.comboContainerGroup.option 			= groupOption.create(0,0,'combo-icon-option');

		var frameOption = (frameSelected === 0)?1:0;
		this.comboContainerGroup.characterOption						= groupOption.create( this.comboContainerGroup.option.width*.48, this.comboContainerGroup.option.height*.34, 'combo-character',frameOption);
		this.comboContainerGroup.characterOption.alpha 					= 0;
		this.comboContainerGroup.characterOption.inputEnabled 			= true;
		this.comboContainerGroup.characterOption.input.useHandCursor 	= true
		this.comboContainerGroup.characterOption.anchor.setTo(.5,.5);
		this.comboContainerGroup.characterOption.bringToTop();
		this.comboContainerGroup.characterOption.events.onInputDown.add(this.updateCharacter,this);

		var alertas 			= this.add.group();
		alertas.background 		= alertas.create(0,0,"alertas");
		alertas.background.anchor.setTo(1,0);
		alertas.scale.x 		= 0;
		this.comboContainerGroup.add(alertas);
		this.comboContainerGroup.alertas = alertas;

		var alertTopStyle = {font: "20px poppinssemibold", fill: "#FFFFFF", align: "center"};
		var alerttextTop = this.add.text(-alertas.background.width*.5, alertas.background.height*.5+3, "hola esto es tan solo una prueba",alertTopStyle);
		alerttextTop.anchor.setTo(.5,1);
		alertas.add(alerttextTop);
		alertas.top = alerttextTop;

		var alertBottomStyle = {font: "18px poppinslight", fill: "#FFFFFF", align: "center"};
		var alerttextBottom = this.add.text(-alertas.background.width*.5, alertas.background.height*.5 - 3, "hola esto es tan solo una prueba",alertBottomStyle);
		alerttextBottom.anchor.setTo(.5,0);
		alertas.add(alerttextBottom);
		alertas.bottom = alerttextBottom;

		this.comboContainerGroup.x = game.width - ( this.comboContainerGroup.combo.width + 30);
		this.comboContainerGroup.y = 30;

		console.log("*********index combo character************")
		console.log("index",this.stage.children)
		console.log(game.global.assetsJSON.alertshome.felixselectedmessage);

		this.stage.addChild(this.comboContainerGroup);
		// this.add.tween(alertas.scale).from({x:0},750,Phaser.Easing.Elastic.Out,true,1000);		
	},

	createHomeBtn:function () {
		this.btnHome = this.add.sprite(0,0,"btn-home");

		this.btnHome.inputEnabled = true;
		this.btnHome.input.useHandCursor = true;

		this.btnHome.events.onInputDown.add(function(){
			// console.log("state:",this)
			if( game.state.getCurrentState().key != this.key)
        		game.state.start("Home");
        }, this) ;

        this.stage.addChild(this.btnHome);

	},

	showAlertmessage: function  (message,delay) {
         
					

		if( !isAlertShowing ){
			console.log("showAlertmessage");
			isAlertShowing = true;

			if( !delay )
				delay = 0;

			// debugger;
			var alertas = this.comboContainerGroup.alertas;

			alertas.top.text = message.top;
			alertas.bottom.text = message.bottom;
			// alertas.scale.x = alertas.background.width;

			game.add.tween(alertas.scale).to({x:1},750,Phaser.Easing.Elastic.Out,true,1000).onComplete.add(function  () {
				game.add.tween(alertas.scale).to({x:0},750,Phaser.Easing.Elastic.In,true,delay).onComplete.add(function  () {
					isAlertShowing = false;
				});
			})
		}
		  //  MSclicgenerico.load();
		  //  MSclicgenerico.play();
           // MSclicgenerico.setVolume(80);
	},

	showComboMessage:function () {
		console.log("this.avatarSelected:",this.avatarSelected.key)
		var message = (this.avatarSelected.key === "felix-home")?game.global.assetsJSON.alertshome.changecharactersusanamessage:game.global.assetsJSON.alertshome.changecharacterfelixmessage;
		this.showAlertmessage(message,3000);


	},

	showComboOptions:function () {
			//MSclicgenerico.stop();
		this.toggleComboOption = toggleComboOption;
		if( !this.toggleComboOption ){
			this.comboContainerGroup.combo.frame = 1;
			this.add.tween(this.comboContainerGroup.characterOption).to({alpha:1},250,"Expo.easeOut", true)
			this.add.tween(this.comboContainerGroup.optionContainer).to({y:this.comboContainerGroup.combo.height*.98+10},350,"Expo.easeOut", true).onComplete.add(function () {
				toggleComboOption = true;
	
		        
			});
		}else{
			this.comboContainerGroup.combo.frame = 0;
			this.add.tween(this.comboContainerGroup.characterOption).to({alpha:0},250,"Expo.easeOut", true)
			this.add.tween(this.comboContainerGroup.optionContainer).to({y:0},300,"Expo.easeOut", true).onComplete.add(function () {
				toggleComboOption = false;
			
		       
			});
		}
	
	//	MSclicgenerico.play();
    //    MSclicgenerico.setVolume(80);
	},

	createAvatars: function () {
		this.avatarFelix 	= 	this.add.sprite(game.width*.5-15, game.height*.5+25, 'felix-home');
		this.avatarFelix.alpha = 0;
		this.avatarFelix.anchor.setTo(0.5,0.5);

		this.avatarSusana 	= 	this.add.sprite(game.width*.5-15, game.height*.5+30, 'susana-home');
		this.avatarSusana.alpha = 0;
		this.avatarSusana.anchor.setTo(0.5,0.5);
				
	},

	updateCharacter:function  () {
		//	MSclicgenerico.stop();
		console.log("this.avatarSelected:",this.avatarSelected.key);
		var frameCombo = (this.avatarSelected.key === 'felix-home')?[0,1]:[1,0];
		this.comboContainerGroup.characterSelected.frame = frameCombo[0];
		this.comboContainerGroup.characterOption.frame	= frameCombo[1];

		console.log("frame:",frameCombo[0])
		this.characterSelected = (frameCombo[0] === 0)?false:true;
		this.changeCharacter(this.characterSelected)
		this.showComboOptions();

		var message = (this.characterSelected)?game.global.assetsJSON.alertshome.felixselectedmessage:game.global.assetsJSON.alertshome.susanaselectedmessage;

		this.showAlertmessage(message,4000);
		// MSclicgenerico.play();
        // MSclicgenerico.setVolume(80);

	},

	changeCharacter: function  (selected) {
			
		// var avatarFelix = this.avatarFelix;
		// var avatarSusana = this.avatarSusana;
		var alphaFelix = (selected)?1:0;
		var alphaSusana = (!selected)?1:0;




		this.add.tween(this.avatarFelix).to({alpha:alphaFelix},500,"Expo.easeOut", true).onComplete.add(function () {
		})
		this.add.tween(this.avatarSusana).to({alpha:alphaSusana},500,"Expo.easeOut", true).onComplete.add(function () {
		})

		this.avatarSelected	 = (selected)?this.avatarFelix:this.avatarSusana;
		   $('#msinicio').removeClass('s-inicio');
           $('#msfin').removeClass('s-fin');
           $('#mspregunta').removeClass('s-pregunta');
           $('#msrespuestam').removeClass('s-mala');
           $('#msrespuesta').removeClass('s-buena');

           $('#msinicio').removeClass('f-inicio');
           $('#msfin').removeClass('f-fin');
           $('#mspregunta').removeClass('f-pregunta');
           $('#msrespuestam').removeClass('f-mala');
           $('#msrespuesta').removeClass('f-buena');
          

		if (selected == true){
		   $('#msinicio').addClass('f-inicio'); 
           $('#msfin').addClass('f-fin');
           $('#mspregunta').addClass('f-pregunta');
           $('#msrespuestam').addClass('f-mala');
           $('#msrespuesta').addClass('f-buena');              
		}else{      
           $('#msinicio').addClass('s-inicio'); 
           $('#msfin').addClass('s-fin');
           $('#mspregunta').addClass('s-pregunta');   
           $('#msrespuestam').addClass('s-mala');
           $('#msrespuesta').addClass('s-buena');
		}

          MSclicgenerico.stop();
		  MSclicgenerico.play();
          MSclicgenerico.setVolume(80);

	},

	createBackgrounds: function  () {

		if( currenteBgGroup ){/// si existe el grupo destruya todos los elementos y/o grupos dentro de el
			currenteBgGroup.destroy(true,false);
		}

		if( platFormsGroups ){/// si existe el grupo destruya todos los elementos y/o grupos dentro de el
			platFormsGroups.destroy(true,false);
		}


		platFormsGroupsObject			= {};
		platFormsGroups				= this.add.group();

		this.bgmanhana(); 
		this.bgtarde();
		this.bgnoche();
		this.inicio(); 

		platFormsGroupsObject.inicio.visible 	= true; 
		platFormsGroupsObject.manhana.visible 	= false; 
		platFormsGroupsObject.tarde.visible 	= false; 
		platFormsGroupsObject.noche.visible 	= false; 

		// game.state.getCurrentState().world.addChildAt(platFormsGroupsObject,0)
		// this.bgmanhana(); 
	},

	inicio: function  () {

		var inicio 		= this.add.group();
		platFormsGroupsObject["inicio"] = inicio;
		inicio.x 			= 0;
		inicio.y 			= 0;
		inicio.alpha		= 1;

		platFormsGroups.add(inicio);
		
		inicio.fondo			= inicio.create(game.width*.5,game.height*.5,"bg-inicio-home");
		inicio.fondo.anchor.x 	= .5;
		// inicio.fondo.x 			= game.width + inicio.fondo.width*.5;
		inicio.fondo.x 			= inicio.width*.5;
		inicio.fondo.y 			= 50;
		inicio.fondo.alpha 		= 0;

		// game.add.tween(inicio.fondo).to( { x:inicio.width*.5, alpha:1 }, 1000, "Expo.easeOut", true,1500);
		game.add.tween(inicio.fondo).to( { alpha:1 }, 1000, "Expo.easeOut", true,500);

		currenteBgGroup = platFormsGroupsObject["inicio"];
	},

	bgmanhana: function  () {

		var manhana 		= this.add.group();
		platFormsGroupsObject["manhana"] = manhana;
		manhana.x 			= 0;
		manhana.y 			= 0;
		manhana.alpha		= 0;

		platFormsGroups.add(manhana);
		
		manhana.sol			= manhana.create(940,game.height*.4,"sol");
		manhana.sol.anchor.setTo(.5,.5);

		game.add.tween(manhana.sol.scale).to( { x:1.1,y:1.1 }, 1000, "Linear", true,0,-1,true);

	},

	bgtarde: function  () {

		var tarde 		= this.add.group();
		platFormsGroupsObject["tarde"] = tarde;
		tarde.x 			= 0;
		tarde.y 			= 0;
		tarde.alpha			= 0;
		
		platFormsGroups.add(tarde);
		
		tarde.nubes = [];
		// var positions = [new Phaser.Point(game.width-100,300),new Phaser.Point(130,350),new Phaser.Point(game.width*.5,game.height*.3+100),new Phaser.Point(game.width*.75,200),new Phaser.Point(game.width*.25,220)]
		var positions = [new Phaser.Point(game.width-100,300),new Phaser.Point(130,350),new Phaser.Point(game.width*.5,game.height*.3+100)]

		for (var i = 0; i < positions.length; i++) {
			var nubekey = "nube-"+(i%2+1);
			console.log("nubekey:",nubekey);
			var nube = tarde.create(0,0,nubekey);
			nube.position = positions[i];
			nube.anchor.setTo(.5,.5);
			tarde.nubes.push(nube);
			game.add.tween(nube).to( { y:"-"+nube.height*.5 }, 3000, "Sine.easeInOut", true,i*2000,-1,true);
		};
		
	},

	bgnoche: function  () {

		var noche 		= this.add.group();
		platFormsGroupsObject["noche"] = noche;
		noche.x 			= 0;
		noche.y 			= 0;
		noche.alpha			= 0;
		
		platFormsGroups.add(noche);

		noche.luna = noche.create(game.width*.8,250,"luna");
		
		noche.estrellas = [];

		for (var i = 0; i < game.rnd.integerInRange(8,12); i++) {
			var estrellakey = "estrella-"+(i%2+1);
			console.log("estrellakey:",estrellakey);
			var estrella = noche.create(0,0,estrellakey);
			estrella.anchor.setTo(.5,.5);
			estrella.x = game.rnd.integerInRange(estrella.width, game.width-estrella.width);
			estrella.y = game.rnd.integerInRange(game.height*.3, game.height*.6);
			noche.estrellas.push(estrella);
			game.add.tween(estrella.scale).to( { x:1.3, y:1.3 }, 100, "Expo.easeIn", true,i*125,-1,true);
		};
		
	},

	createStageGroup: function () {
		this.stagesItemsGameGroup 	= this.add.group();
		this.stagesItemsGameGroup.x = game.width*.5;
		this.stagesItemsGameGroup.y = game.height*.5;

		this.stagesItemsGameGroupContainer = this.add.group();
		this.stagesItemsGameGroupContainer.x = 0;
		this.stagesItemsGameGroupContainer.y = 0;

		this.stagesItemsGameGroup.add(this.stagesItemsGameGroupContainer);

		this.stagesItemsGameArray 	= [];
	},

	createControlStageGal: function () {

		var state = this;

		this.prevStgbtn 						= this.add.sprite(0, game.height*.5, 'prev-stage');		
        this.prevStgbtn.inputEnabled			= true;
        this.prevStgbtn.input.useHandCursor 	= true;
        this.prevStgbtn.x = this.prevStgbtn.width*.5;
        this.prevStgbtn.anchor.setTo(0.5,0.5);
        this.prevStgbtn.events.onInputDown.add(function(){
        	var nextPos = currentPosIndexStage-1;
        	if( !stageIsTween )
        		state.moveSlideStage(nextPos);
        }, this) ;
        this.prevStgbtn.alpha = 0;

		this.nextStgbtn 						= this.add.sprite(game.width, game.height*.5, 'next-stage');		
        this.nextStgbtn.inputEnabled 			= true;
        this.nextStgbtn.input.useHandCursor 	= true;
        this.nextStgbtn.x 						= game.width - this.nextStgbtn.width*.5;
        this.nextStgbtn.anchor.setTo(.5,0.5);
        this.nextStgbtn.events.onInputDown.add(function(){
        	var nextPos = currentPosIndexStage+1;
        	if( !stageIsTween )
        		state.moveSlideStage(nextPos);
        }, this) ;
        this.nextStgbtn.alpha = 0;

        this.prevbtnShadow 						= this.add.sprite(0,game.height*.5,'sombra-slide');
        this.prevbtnShadow.anchor.x 			= 0;
        this.prevbtnShadow.anchor.y 			= .5;
        this.prevbtnShadow.inputEnabled 		= false;
        this.prevbtnShadow.alpha 				= 0;

        this.nextbtnShadow 						= this.add.sprite(game.width,game.height*.5,'sombra-slide');
        this.nextbtnShadow.scale.x 				= -1;
        this.nextbtnShadow.anchor.x 			= 0;
        this.nextbtnShadow.anchor.y 			= .5;
        this.nextbtnShadow.inputEnabled 		= false;
        this.nextbtnShadow.alpha 				= 0;
	},

	createDragItem: function () {
		//MSclicgenerico.stop();
	   // MSclicgenerico.play();
       // MSclicgenerico.setVolume(80);	

		this.dragItemContainersarray = [];
		this.dragItemContainersGroup = this.add.group();

		var activeItems = 0;

		for (var i = game.global.assetsJSON.spritesheet.length - 1; i >= 0; i--) {
			// console.log("game:"+game.global.assetsJSON.spritesheet[i].game);

			if(game.global.assetsJSON.spritesheet[i].active && game.global.assetsJSON.spritesheet[i].total){ //// Valida si el item está activo para crearlo si no no lo crea
				console.log("name:"+game.global.assetsJSON.spritesheet[i].name);
				console.log("active:"+game.global.assetsJSON.spritesheet[i].active);

				///////container drag item/////////
				var dragItemContainer = this.add.group();
			    dragItemContainer.enableBody = true;
			    dragItemContainer.physicsBodyType = Phaser.Physics.ARCADE;
				dragItemContainer.name = "dragItemContainer-"+i.toString();
				dragItemContainer.parentof = game.global.assetsJSON.spritesheet[i].name;
				//////Background drags items///////
				var bgItemContainer = dragItemContainer.create(0,0,"icon-game-bg"); /// creo el BG dentro del grupo dragItemContainer ///
				dragItemContainer.bgItemContainer = bgItemContainer;
				//////total items/////
				dragItemContainer.totalItems = game.global.assetsJSON.spritesheet[i].total;
				//////counter item text/////
				dragItemContainer.counterTextcounterText = null;

				///////array de los items draggables////////
				dragItemContainer.dragItems = [];
				var totalitems = dragItemContainer.totalItems;

				if(game.global.homeutils["totalItemsGameselected"][game.global.assetsJSON.spritesheet[i].name]){
					console.log("total items:",game.global.homeutils["totalItemsGameselected"]);
					totalitems -= game.global.homeutils["totalItemsGameselected"][game.global.assetsJSON.spritesheet[i].name];
				}

				dragItemContainer.totalItems = (totalitems < 0)?0:totalitems;

				// console.log(game.global.assetsJSON.spritesheet[i].juego)
				// var juego = game.global.assetsJSON.spritesheet[i].juego;
				// debugger;

				for (var j = totalitems - 1; j >= 0; j--) {

			        ///////////////Drag item///////////////
			        // var dragItem = this.add.sprite(0,0,game.global.assetsJSON.spritesheet[i].name)
			        var dragItem = dragItemContainer.create(0,0,game.global.assetsJSON.spritesheet[i].name,0)  /// creo el Item dentro del grupo dragItemContainer ///
			        dragItem.inputEnabled 			= true;
			        dragItem.input.useHandCursor 	= true;
			        dragItem.input.priorityID 		= 1;
					// dragItem.input.pixelPerfectClick = false;
					// dragItem.input.pixelPerfectOver = false;
					dragItem.daytime = "";
			        dragItem.state = this;
			        dragItem.events.onMoveSlideStage = new Phaser.Signal();									//// creo evento para mover slides
			        dragItem.events.onMoveSlideStage.add(this.getSlideStagesPos, this);
			        console.log(dragItem);

			        ////enableDrag parameter(lockCenter,bringToTop,pixelPerfect,alpha,ThresholdboundsRect/)///
			        dragItem.input.enableDrag(false,true,true,255,null,this.game.stage);
			        dragItem.anchor.setTo(0.5, 0.5);
			        dragItem.x  			= bgItemContainer.x + bgItemContainer.width*.5
			        dragItem.y  			= bgItemContainer.y + bgItemContainer.height*.5
			        dragItem.showBtnJugar	= false; /// muestra o no el btn de jugar

			        ///////Clono la posición original del item ///////
			        dragItem.originalPosition = dragItem.position.clone();

			        //////Drag events//////
			        dragItem.events.onDragStart.add(this.startItemDrag, this);
					dragItem.events.onDragStop.add(this.stopItemDrag, this);

					///// Guardo el contenedor padre del item //////
			        dragItem.oriParentContainer = dragItemContainer;

			        ///////Crea el boton de jugar/////////////////
					var btnJugar 					= this.make.sprite(0,0,"btn-jugar-icon-game");
					btnJugar.animations.add('jugar',[0,1],6,true);
					btnJugar.anchor.setTo(0.5, 0); //// centro de pivot se pone 0.5 ya que el item tiene el pivot en 0.5 y para así centrarlo
					btnJugar.alpha 					= 0;
					btnJugar.inputEnabled 			= true;
					btnJugar.visible 				= false;
					btnJugar.input.useHandCursor 	= true;
					btnJugar.goGame					= game.global.assetsJSON.spritesheet[i].game;
			        btnJugar.bringToTop();
			        // btnJugar.events.onInputDown.add(this.startGameSelected, dragItem);
			        console.log("****************itemGame*****************",btnJugar.goGame)
			        btnJugar.events.onInputDown.add(function (btnJugar) {
			        	
						console.log("item:",this.key);		
						console.log("btn jugar:",btnJugar.key);
						console.log(this.state)

						game.global.homeutils.itemGameSeleted = this;
						this.frame = 1;
						this.hideCerrarBtn();
						// btnJugar.visible = false;   ///deshabilita el boton de cerrar
						// this.state.start("prehome",false,false);
						// game.state.start('Home',true,false);
						game.state.start(btnJugar.goGame,true,false,{daytime:this.daytime});	 
					}, dragItem);
			        // btnJugar.scale.setTo(1.3,1.3);

			        dragItem.addChild(btnJugar);
			        dragItem.btnJugar = btnJugar;

					btnJugar.x 						= 0; //// centro del item en x, pivot btn  x = 0.5
					btnJugar.y 						= dragItem.height*.5;  ////parte inferior del item en y, pivot btn  y = 1

			        ///////Crea el boton de eliminar/////////////////
					var btnCerrar 					= this.make.sprite(0,0,"btn-eliminar-icon-game");
					btnCerrar.alpha 				= 0;
					btnCerrar.inputEnabled 			= true;
					btnCerrar.visible 				= false;
					btnCerrar.input.useHandCursor 	= true;
					btnCerrar.input.priorityID 		= 0;
					btnCerrar.events.onInputDown.add(this.removeDragitem, dragItem);
					// btnCerrar.scale.setTo(1.3,1.3);			/// escalo el boton para que cuando se scale el item no se vea tan pequeño
			        btnCerrar.bringToTop();

			        dragItem.addChild(btnCerrar);
			        dragItem.btnCerrar = btnCerrar;
			        dragItem.hideCerrarBtn = function  (dragItem) {
			        	console.clear()
			        	console.log("********hide cerrar*************")
			        	console.log(this)
			        	console.log(dragItem)
			        	this.btnCerrar.visible = false;
			        }
			        dragItem.showCerrarBtn = function  () {
			        	this.btnCerrar.visible = true;
			        }
					btnCerrar.x 				= (dragItem.width - btnCerrar.width)*.5 ; //// centro del item en x, pivot btn  x = 0.5
					btnCerrar.y 				= -dragItem.height;  ////parte inferior del item en y, pivot btn  y = 1

					dragItem.events.onInputOver.add(this.dragItemOver, dragItem); /// evento de over para mostrar el boton
					dragItem.events.onInputOut.add(this.dragItemOut, dragItem);  /// evento de out para esconderlo

			        dragItemContainer.dragItems.push(dragItem);
				};
		        console.log(dragItemContainer);

		        //////////Crea el contador si el total de items es mayor que 1///////////
				if ( dragItemContainer.totalItems >= 0 ) {

					////bg counter items drag////
					var counterContainer 			= dragItemContainer.create(0,0,"icon-drag-game-total");
					counterContainer.x 				= bgItemContainer.x + bgItemContainer.width - counterContainer.width;
					counterContainer.y 				= bgItemContainer.y + 25;
					counterContainer.inputEnabled 	= true;
			        counterContainer.bringToTop();

					////adding counter text/////

					totalitems = (totalitems < 0 )?0:totalitems;

					var textStyle = {font: "18px poppinssemibold", fill: "#FFFFFF", align: "center"};
					var text = this.add.text((counterContainer.width-25)*.5, (counterContainer.height - 30)*.5, "x"+totalitems, textStyle);
					counterContainer.addChild(text);
				}				

			    dragItemContainer.counterContainer 	= counterContainer || this.add.sprite(); ////counterContainer se lo paso al contenedor padre como un parametro
				dragItemContainer.counterText 		= text || this.add.sprite() ; ////counter text se lo paso al contenedor padre como un parametro
				dragItemContainer.x 				= activeItems*( dragItemContainer.width+ 20 ) ;
				dragItemContainer.y 				= 100 ;

				///// función para actualizar el total de items dentro del contenedor//////
				dragItemContainer.udpateTotalItems 	= function (inc) {
					console.log("update total items container", this.name)
					this.totalItems 		=  this.totalItems + inc;
					this.counterText.text 	= "x" + this.totalItems;

					// if( this.totalItems )
				}

				///// tooltip name container /////
				if( game.global.assetsJSON.spritesheet[i].tooltip ){

					var tooltip = this.add.group();
					tooltip.background = tooltip.create(0,0,"icon-drag-tootlip");
					tooltip.background.anchor.setTo(.5,.5);

					var textStyleTooltip 	= {font: "18px poppinslight", fill: "#FFFFFF", align: "center"};
					var textTooltip 		= this.add.text(tooltip.background.x, tooltip.background.y+8, game.global.assetsJSON.spritesheet[i].tooltip, textStyleTooltip);
					textTooltip.anchor.x 	= 0.5;
					textTooltip.anchor.y 	= 0.5;
					tooltip.addChild(textTooltip);

					tooltip.x 		= bgItemContainer.width*.5;
					tooltip.y 		= bgItemContainer.height;
					tooltip.scale.x	= .7;
					tooltip.scale.y	= .7;
					tooltip.visible = false;

					tooltip.overY 	= bgItemContainer.height - tooltip.background.height*.15;
					tooltip.outY 	= tooltip.y;

					dragItemContainer.add(tooltip);
					dragItemContainer.tooltip = tooltip;
					dragItemContainer.sendToBack(dragItemContainer.tooltip);
					dragItemContainer.sendToBack(bgItemContainer);

					///// HOVER tooltip area /////
					var width = dragItemContainer.bgItemContainer.width; 								// ancho area de colisión;
					var height = dragItemContainer.bgItemContainer.height; 								// alto area de colisión;
					var bmd = game.add.bitmapData(width, height); 	///Creación del bitmap data
					bmd.ctx.beginPath(); 							/// empezar a llenar el bitmap
					bmd.ctx.rect(0, 0, width, height); 				/// se define las dimensiones del rectangulo
					bmd.ctx.fillStyle = '#000000'; 					//// color del relleno
					bmd.ctx.fill(); 								//// se llena el rectangulo

					dragItemContainer.tooltipHoverArea = dragItemContainer.create(0,0, bmd); /// se crea un sprite con el bitmap data creado
					dragItemContainer.tooltipHoverArea.inputEnabled 	= true;
					dragItemContainer.tooltipHoverArea.alpha = 0;
					dragItemContainer.sendToBack(dragItemContainer.tooltipHoverArea);

					dragItemContainer.tooltipHoverArea.events.onInputOver.add(this.showItemContainerTooltip, dragItemContainer); /// evento de over para mostrar el tooltip
					dragItemContainer.tooltipHoverArea.events.onInputOut.add(this.hideItemContainerTooltip, dragItemContainer);  /// evento de out para esconder el tooltip
				}

				// console.clear()
				console.log("dragItemContainer totalItems:",dragItemContainer.totalItems);
				console.log("dragItemContainer key 		:",dragItemContainer.name);
				console.log("dragItemContainer text:",dragItemContainer.counterText);
				console.log("dragItemContainer counterContainer:",dragItemContainer.counterContainer);
				console.log("dragItemContainer dragItems:",dragItemContainer.dragItems);
				console.log("*************************end dragItemContainer*********************")

				this.dragItemContainersarray.push(dragItemContainer);
				this.dragItemContainersGroup.add(dragItemContainer);
				console.log(this.dragItemContainersarray);

				activeItems++;
			}
		};
		this.dragItemContainersGroup.x = this.world.centerX - this.dragItemContainersGroup.width*.5 ;		
	},

	showItemContainerTooltip:function  (item) {
		// console.clear()
		// console.log("over dragItemContainer.name:",this)
		// if( this.totalItems > 0 ){
		// 	this.tooltip.visible = true;
		// 	game.add.tween(this.tooltip).to({y:this.tooltip.overY},500,"Expo.easeOut",true)
		// 	game.add.tween(this.tooltip.scale).to({y:1, x:1},500,"Expo.easeOut",true)
		// }
	},

	hideItemContainerTooltip:function  (item) {
		// console.log("out dragItemContainer.name:",this)
		// var tooltip = this.tooltip;
		// game.add.tween(tooltip).to({y:tooltip.outY},500,"Expo.easeOut",true)
		// game.add.tween(tooltip.scale).to({y:.7, x:.7},500,"Expo.easeOut",true).onComplete.add(function  () {
		// 	tooltip.visible = false;
		// })
	},

	startGameSelected: function (btnJugar) {
		
		console.log("item:",this.key);		
		console.log("btn jugar:",btnJugar.key);
		console.log(this.state)
		this.frame = 1;
		btnJugar.visible = false;   ///deshabilita el boton de cerrar
		// this.state.start("prehome",false,false);
		game.state.start('Home',false,false);

	//	MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);	 
	},

	removeDragitem: function  (cerrarBtn) {

		if( stageIsTween || this.frame == 2 ){  /// chequea que las plataformas de los escenearios no se este moviendo
			return false;
		}

		console.log("remove item del contenedor:",this.key);
		console.log("btn cerrar item del contenedor:",cerrarBtn.key);
		
		var itemToremove = null;
		for (var i = this.parent.items.length - 1; i >= 0; i--) {
			if ( this.parent.items[i].key === this.key ){
				itemToremove = i;
			}
		};

		this.parent.items.splice(itemToremove,1);   			/// remuevo el item del array de items del padre
		// if( !this.parent.items.length );   						/// escondo el puntero si no hay items
			// this.parent.pointer.visible = false;
		this.parent.updateItemPos();							/// actualizo las posiciones de los otros items dentro del padre

		var offsetX = this.world.x - this.parent.x; 			///comparo la distancia en x de las caja con respecto a su padre con la posición en x del escenario
		var offsetY = this.world.y - this.parent.parent.y; 		///comparo la distancia en y del contenedor padre de las cajas con la posición en Y del escenario

		this.state.removeStage(this.key+this.parent.key);		/// remuevo el stage asociado a este item;

		this.parent.remove(this);								/// lo remuevo de la caja
		this.oriParentContainer.add(this);						/// lo agrego al contenedor de items padre
		this.x = this.world.x - ( this.parent.x + this.parent.parent.x) ;
		this.y = this.world.y - ( this.parent.y + this.parent.parent.y) ;
		this.frame = 0;
		this.daytime = "";

		var item = this;
		posX = item.originalPosition.x;							/// le asigno la posición original dentro del padre contenedor
		posY = item.originalPosition.y;							/// le asigno la posición original dentro del padre contenedor

		// var outTweenTime = 500;
		// var btnJugar = item.btnJugar;			/// le asigno la posición original dentro del padre contenedor
		// game.add.tween(btnJugar).to( { alpha:0 }, outTweenTime, Phaser.Easing.Exponential.Out, true)
		// game.add.tween(btnJugar).to( { y: item.height*.5 }, outTweenTime, Phaser.Easing.Elastic.Out, true).onComplete.add(function  (btnJugar) {
		// 	btnJugar.visible != btnJugar.visible;
		// });;

		// var btnCerrar = item.btnCerrar;
		// game.add.tween(btnCerrar).to( { y: -item.height }, outTweenTime, Phaser.Easing.Elastic.Out, true).onComplete.add(function  (btnCerrar) {
		// 	btnCerrar.visible != btnCerrar.visible;
		var outTweenTime = 500;
		// game.add.tween(btnCerrar).to( { alpha:0 }, outTweenTime, Phaser.Easing.Exponential.Out, true)
		item.showBtnJugar = false;
		game.add.tween(item.btnJugar).to( { alpha:0 }, outTweenTime, Phaser.Easing.Exponential.Out, true)
		game.add.tween(item.btnJugar).to( { y: item.height*.5 }, outTweenTime, Phaser.Easing.Elastic.Out, true).onComplete.add(function  (btnJugar) {
			item.btnJugar.visible = false;
			item.btnJugar.animations.stop('jugar');
			item.btnJugar.animations.frame = 0;
		});;
		game.add.tween(item.btnCerrar).to( { alpha:0 }, outTweenTime, Phaser.Easing.Exponential.Out, true)
		game.add.tween(item.btnCerrar).to( { y: -item.height }, outTweenTime, Phaser.Easing.Elastic.Out, true).onComplete.add(function  (btnCerrar) {
			item.btnCerrar.visible = false;
		});;
		TweenMax.to(item.scale,1,{x:1,y:1,ease:Elastic.easeOut});
		TweenMax.to(item,1,{x:posX,y:posY,ease:Elastic.easeOut, onComplete:function  () {
			item.input.draggable = true; 			/// habilito el drag
			item.showBtnJugar = false;				/// deshabilito el over del boton dejugar y eliminar
			item.inputEnabled = true;
			item.input.useHandCursor = true;
			item.oriParentContainer.udpateTotalItems(1);
			item.oriParentContainer.counterContainer.bringToTop();
		} });
	},
	/// evento de out del item para esconder el btn jugar /////
	dragItemOut: function () {
		// console.log(this.width,this.height);
		var outTweenTime = 500;
		var btnJugar = this.btnJugar;
		var btnCerrar = this.btnCerrar;

		if( btnCerrar.visible ){

			// btnJugar.visible = true;
			// game.add.tween(btnJugar).to( { alpha:0 }, outTweenTime, Phaser.Easing.Exponential.Out, true)
			// game.add.tween(btnJugar).to( { y: this.height*.5 }, outTweenTime, Phaser.Easing.Elastic.Out, true).onComplete.add(function  (btnJugar) {
			// 	btnJugar.visible != btnJugar.visible;
			// });;

			btnCerrar.visible = true;
			game.add.tween(btnCerrar).to( { alpha:0 }, outTweenTime, Phaser.Easing.Exponential.Out, true)
			game.add.tween(btnCerrar).to( { y: -this.height }, outTweenTime, Phaser.Easing.Elastic.Out, true).onComplete.add(function  (btnCerrar) {
				btnCerrar.visible != btnCerrar.visible;
			});;
			// btnJugar.animations.stop('jugar');
			// btnJugar.animations.frame = 0;
		}
		if( this.parent.tooltip ){ //// chequea que el padre tenga el tooltip
			console.log("drag item tooltip OUT")
			var tooltip = this.parent.tooltip;
			tooltip.scale.set(1);
			game.add.tween(tooltip.scale).to({y:.7, x:.7},250,"Expo.easeIn",true) ///muestra el tooltip
			game.add.tween(tooltip).to({y:tooltip.outY},250,"Expo.easeIn",true).onComplete.add(function  () {
				tooltip.visible = false;
			}) ///muestra el tooltip
		}
	},
	/// evento de over del item para mostrar el btn jugar /////
	dragItemOver: function () {

		/****valida si el juego ya se jugo para uqe no se pueda remover el item*****/
		if( this.frame === 2 ){
			return false;
		}

		var overTweenTime = 500;
		var btnJugar = this.btnJugar;
		var btnCerrar = this.btnCerrar;
		// console.log(btnJugar);
		// console.log("** btnJugar visible *****",btnJugar.visible);
		// console.log(this.showBtnJugar);
		if( this.showBtnJugar ){
			// btnJugar.visible = true;
			// game.add.tween(btnJugar).to( { alpha:1 }, overTweenTime, Phaser.Easing.Exponential.Out, true)
			// game.add.tween(btnJugar).to( { y: 0}, overTweenTime, Phaser.Easing.Elastic.Out, true);

			btnCerrar.visible = true;
			game.add.tween(btnCerrar).to( { alpha:1 }, overTweenTime, Phaser.Easing.Exponential.Out, true)
			game.add.tween(btnCerrar).to( { y: -this.height*.6}, overTweenTime, Phaser.Easing.Elastic.Out, true);
			btnJugar.animations.play('jugar');

			//// disparo evento para mover slider en el over del item /////
			// this.events.onMoveSlideStage.dispatch(this);
		}
		if( this.parent.totalItems > 0 && this.parent.tooltip && this.originalPosition.x == this.x ){
			console.log("drag item tooltip OVER")
			this.parent.tooltip.scale.set(.7);
			this.parent.tooltip.visible = true;
			game.add.tween(this.parent.tooltip.scale).to({y:1, x:1},500,"Expo.easeOut",true)
			game.add.tween(this.parent.tooltip).to({y:this.parent.tooltip.overY},500,"Expo.easeOut",true)
		}
		MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);	
	},

	createContainerItems: function() {

		this.containerDragItemsGroups = this.add.group();
		this.containerDragItemsGroups.name = "menuGames";
		this.stage.addChildAt(this.containerDragItemsGroups,0);

		if( !this.containerDragItemsGroupsarray ){
			this.containerDragItemsGroupsarray = [];
		}

		if( !this.containerItemsbgArray ){
			this.containerItemsbgArray = [];
		}

		var posX = 0;
		for (var i = 0; i < game.global.assetsJSON.images.home.length; i++) {

				console.log("crea contenedores caja: ", game.global.assetsJSON.images.home[i])
			if( game.global.assetsJSON.images.home[i].containerItems ){

				console.log("crea contenedores caja")

				///Crea grupo contenedor de items arrastrados/////
				var containerDragItemsGroup 			= this.add.group();					/// creo grupo contenedor de la caja contenedora de items
				containerDragItemsGroup.name 			= "containerDragItemsGroup-"+posX;	
				containerDragItemsGroup.colorBg 		= this.colors[posX];				/// asigno un color para cambiar el bg del body html
				containerDragItemsGroup.enableBody 		= true;								/// habilito enable body para detectar colisiones
    			containerDragItemsGroup.physicsBodyType = Phaser.Physics.ARCADE;			/// Habilito el motor físico al grupo
				containerDragItemsGroup.items 			= [];								/// array que contiene los items arrojados
				containerDragItemsGroup.totalItems		= 4;								/// total de items permitidos por contenedor
				containerDragItemsGroup.key				= game.global.assetsJSON.images.home[i].key;	/// Key del contenedor de items arrastrados

				//// actualiza la posición de los items dentro de la caja/////
				containerDragItemsGroup.updateItemPos	= this.updateItemPos;

				//// Le paso el metodo para cambiar BG/////
				containerDragItemsGroup.changeBackground = this.changeBackground;

				///// agrega un item a la caja/////
				containerDragItemsGroup.addItem 		= this.addItem;

				/////Agrega imagen de bg de las cajas/////
				var containerItemsbg 				= containerDragItemsGroup.create( 0, 0, game.global.assetsJSON.images.home[i].name);
				containerItemsbg.oriParentContainer 	= containerDragItemsGroup; /// crear quien es el padre cotenedor
				containerItemsbg.sendToBack();//// la envia al fondo
				containerDragItemsGroup.add(containerItemsbg);

				////Agrego puntero/////
				// containerDragItemsGroup.pointer 		= containerDragItemsGroup.create(165, 112, "indicador-caja");
				// containerDragItemsGroup.pointer.visible = false;

				containerDragItemsGroup.x = (380*posX);
				containerDragItemsGroup.y = 0;

				///// collision area /////
				var collitionArea;
				var width = 275; 								// ancho area de colisión;
				var height = 50; 								// alto area de colisión;
				var bmd = game.add.bitmapData(width, height); 	///Creación del bitmap data
				bmd.ctx.beginPath(); 							/// empezar a llenar el bitmap
				bmd.ctx.rect(0, 0, width, height); 				/// se define las dimensiones del rectangulo
				bmd.ctx.fillStyle = '#000000'; 					//// color del relleno
				bmd.ctx.fill(); 								//// se llena el rectangulo

				collitionArea = containerDragItemsGroup.create(game.world.centerX, game.world.centerY, bmd); /// se crea un sprite con el bitmap data creado
				collitionArea.anchor.setTo(0.5, 0.5);			/// punto de pivot en el centro
				collitionArea.alpha = 0;
				collitionArea.x = 195;
				collitionArea.y = 80;
				collitionArea.oriParentContainer = containerDragItemsGroup; /// crear quien es el padre cotenedor

				containerItemsbg.collitionArea = collitionArea;

				this.containerDragItemsGroups.add(containerDragItemsGroup);
				this.containerDragItemsGroupsarray.push(containerDragItemsGroup);
				this.containerItemsbgArray.push(containerItemsbg);

				posX++;
			}			
		};

		/// this.containerDragItemsGroups  		grupo que contiene los grupos de cada caja de items
		/// containerDragItemsGroup 			grupo contenedor de cada caja
		/// containerDragItemsGroup.items 		items que se van agregando a cada caja
		/// this.containerDragItemsGroupsarray 	array que contiene cada grupo(containerDragItemsGroup) contenedor de caja

		this.containerDragItemsGroups.x = this.world.centerX - this.containerDragItemsGroups.width*.5 ;
		this.containerDragItemsGroups.y = this.world.height - (this.containerDragItemsGroups.height + 50);



	},
	//// Función que que permite agregar el item a las cajas ////
	//// Devuelve true si se agrego exitosamente, false en caso de que no /////
	addItem:  function (item) {
		// console.clear()

		if( this.items.length >= this.totalItems ){		/// Valido que el numero de items agregados no se mayor que el total de items permitidos ///
			return false;
		}

		for (var i = this.items.length - 1; i >= 0; i--) {
			// console.log("items de este contenedor:",this.items[i].key, " item a agregar:", item.key);
			if( this.items[i].key === item.key ){		/// Valido que el numero de items agregados no se mayor que el total de items permitidos ///
				return false;
			}
		};

		/// "this" hace referencia a las propiedades y metodos de la caja inferior contenedora de items (containerDragItemsGroup) y no al stage //////
		console.log("item world x:",item.world.x)
		console.log("item x:",item.x)
		console.log("group x:",this.x)
		console.log("group y:",this.y)

		item.oriParentContainer.remove(item); 					//// remuevo el item del contenedor padre, i.e. el contendor de items de la parte superior

		var offsetX = item.world.x - (this.parent.x + this.x); 	///comparo la distancia en x de las caja con respecto a su padre con la posición en x del escenario
		var offsetY = item.world.y - (this.parent.y + this.y); 	///comparo la distancia en y del contenedor padre de las cajas con la posición en Y del escenario
		console.log("offsetX:",offsetX)
		console.log("offsetY:",offsetY)

		this.add(item);
		item.x = offsetX; 								/// asigno la nueva posición al item dentro del nuevo padre(containerDragItemsGroup)
		item.y = offsetY;								/// asigno la nueva posición al item dentro del nuevo padre(containerDragItemsGroup)
		this.items.push(item);							/// agrego el nuevo item a la pila de items del contenedor

		item.input.draggable = false; 					//// desabilito el drag del item
		item.input.useHandCursor = true; 				//// habilito la manito(cursor) del item

		item.oriParentContainer.udpateTotalItems(-1);	//// actualiza el contador de items

		this.changeBackground(this.colorBg,this.key);			/// cambio color de bg

		item.showBtnJugar = true;																				/// Pongo visible el boton de jugar
		game.add.tween(item.btnCerrar).to( { alpha:1 }, 500, Phaser.Easing.Exponential.Out, true)				/// agrego una transición al aplha
		game.add.tween(item.btnCerrar).to( { y: -item.height*.6}, 500, Phaser.Easing.Elastic.Out, true);		/// agrego una transición de y

		item.btnJugar.visible = true;																			/// Pongo visible el boton de eliminar
		game.add.tween(item.btnJugar).to( { alpha:1 }, 500, Phaser.Easing.Exponential.Out, true)				/// agrego una transición al aplha
		game.add.tween(item.btnJugar).to( { y: 0}, 500, Phaser.Easing.Elastic.Out, true);						/// agrego una transición de y
		
		//// actualiza posición de los items dentro del contenedor
		this.updateItemPos();
		// this.pointer.bringToTop();

		return true;
	},

	//// Función que actuliza la posición de los items dentro de las cajas inferiores ////
	updateItemPos: function () {
		/// "this" hace referencia a las propiedades y metodos de la caja inferior contenedora de items (containerDragItemsGroup) y no al stage//////
		console.log("*********items agregadados caja ",this.name,"************")
		for (var j = 0; j < this.items.length; j++) {
			// console.log("***iteracion:******",j)
			var item = this.items[j]; 								/// array de items contenidos en el contenedor ////
			this.items[this.items.length - (j +1) ].bringToTop();			
			var originalItemWidth = 88; 							/// ancho original del item ////
			var scalewidthItem = ( 365 / this.totalItems ) / originalItemWidth;   /// Proporción de escala del item respecto a su tamaño original
			// console.log(item.key)
			// console.log("width:",scalewidthItem*j*originalItemWidth);
			game.add.tween(item.scale).to( { x: scalewidthItem, y: scalewidthItem }, 500, Phaser.Easing.Elastic.Out, true);  /// escala el item dentro del contenedor
			game.add.tween(item).to( { x: scalewidthItem*originalItemWidth*(j + 0.5), y:85}, 250, Phaser.Easing.Exponential.Out, true).onComplete.add(function  () {
				if( !item.showBtnJugar )
					item.showBtnJugar = true;						/// habilito la aparición del boton de jugar
			});
			// this.items[i];
		};
		this.getChildAt(0).sendToBack();// mando la imagen de de BG para atras
	},

	//// función que cambia el Bg del home /////
	changeBackground: function(color,key) {
		this.stage.backgroundColor = color;
		game.global.bacgroundColor(color);

		if( key ){
			console.log("*****KEY Background*****",key);

			// if( key === "inicio"){
			// 	if( this.avatarSelected.visible ){
			// 		game.add.tween(this.avatarSelected).to( {alpha:0},250,Phaser.Easing.Exponential.Out,true).onComplete(function  () {
			// 			this.avatarSelected.visible = false;
			// 		});
			// 	}else{
			// 		if( !this.avatarSelected.alpha ){
			// 			game.add.tween(this.avatarSelected).to( {alpha:0},250,Phaser.Easing.Exponential.Out,true).onComplete(function  () {
			// 				this.avatarSelected.visible = false;
			// 			});
			// 		}
			// 	}
			// }else{
			// 	this.avatarSelected	
			// }

			console.log(this); // output the bird's key
			if( currenteBgGroup && currenteBgGroup != platFormsGroupsObject[key] ){
				game.add.tween(currenteBgGroup).to({alpha:0},250,Phaser.Easing.Exponential.Out,true).onComplete.add(function(){

					console.log("************************************")
					console.log("complete")

					currenteBgGroup.visible = false;
					currenteBgGroup = platFormsGroupsObject[key];
					currenteBgGroup.visible = true;
					game.add.tween(currenteBgGroup).to({alpha:1},250,Phaser.Easing.Exponential.Out,true)

				})
			}else{
				currenteBgGroup = platFormsGroupsObject[key];
				currenteBgGroup.visible = true;
				game.add.tween(currenteBgGroup).to({alpha:1},250,Phaser.Easing.Exponential.Out,true);
			}
		}
	},

	startItemDrag: function (dragItem) {
		// console.log("********start drag********")
		dragItem.bringToTop();
		dragItem.oriParentContainer.counterContainer.bringToTop();

		if( dragItem.oriParentContainer.tooltip ){ //// chequea que el padre tenga el tooltip
			var tooltip = dragItem.oriParentContainer.tooltip;
			game.add.tween(tooltip).to({y:tooltip.outY},500,"Expo.easeOut",true) /// oculto el tooltip
			game.add.tween(tooltip.scale).to({y:.7, x:.7},500,"Expo.easeOut",true).onComplete.add(function  () {
				tooltip.visible = false;
			}) /// oculto el tooltip
		}
	},

	stopItemDrag: function (dragItem) {
		// console.clear()
		// console.log("********stop drag********")
		// console.log("dragItem:",dragItem)
		// console.log("game time:"+this.time.time)
		// console.log("pointerTimeDown:"+dragItem.input.pointerTimeDown(Phaser.Pointer.id))
		// console.log("pointerTimeOut:"+dragItem.input.pointerTimeOut(Phaser.Pointer.id))
		// console.log("pointerTimeOver:"+dragItem.input.pointerTimeOver(Phaser.Pointer.id))
		// console.log("pointerTimeUp:"+dragItem.input.pointerTimeUp(Phaser.Pointer.id))

		/////validar si hace contacto con una caja/////
		console.log("*************elemento this*********************")
		console.log(this)
		var isCollitioning = false;
		var collisionContainer = null;
		/////////// chequeo si al soltar el item esta pegando encima de una caja ////////////////
		for (var i = this.containerItemsbgArray.length - 1; i >= 0; i--) {
			// this.containerItemsbgArray[i].parent.pointer.visible = false;/// escondo el puntero de cada contenedor
			var containerDrag = this.containerItemsbgArray[i]; ///// recorro el array de las cajas
			var checkCollision = this.game.physics.arcade.overlap(dragItem, containerDrag.collitionArea, this.checkCollision,null,this); ///chequeo si el item toca el area de colisión(sprite) de la caja
			collisionContainer = ( checkCollision )? containerDrag : collisionContainer ; /// si está colisionando obtengo la caja con la que ésta colisiona.
		};

		if( collisionContainer ){//si colisiono con un contenedor lo agrega al contenedor

			if( collisionContainer.oriParentContainer.addItem(dragItem) ){ //// valido si el contenedor no esta lleno y agrego el item al padre el sprite con el colisiona, es decir una de de las cajas inferiores
				// collisionContainer.sendToBack(); 							//// envio la imagen de  BG de la caja hacia atrás para que el item agregado se vea de primero
				
				dragItem.daytime = collisionContainer.oriParentContainer.key;

				console.log(dragItem.key,dragItem.parent.key);
				console.log("************************dragItem.parent.colorBg*********************");
				console.log(dragItem.parent.colorBg);

				this.addStage(dragItem.key,dragItem.parent.key,dragItem.parent.colorBg);		///Agrego stage del juego arrastrado
				this.getSlideStagesPos(dragItem);												/// actualizo la posición del slide de stage												

				console.log("******** items contenedor ",collisionContainer.oriParentContainer.name,"************");
				console.log(collisionContainer.oriParentContainer.items);

				// collisionContainer.parent.pointer.visible = false;
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

	addStage:function (keyDragItem,keyParentDragItem,colorBg) {
		console.clear();
		console.log("*************addStage************",keyParentDragItem)
		var stageItem 	= this.stagesItemsGameGroupContainer.create(0,0,keyDragItem+"-stage");
		stageItem.name 	= keyDragItem+keyParentDragItem;
		stageItem.animations.add('manhana',[/*1,2,*/0],1,false);										/// create animation frame mañana
		stageItem.animations.add('tarde',[/*2,0,*/1],1,false);											/// create animation frame tarde
		stageItem.animations.add('noche',[/*0,1,*/2],1,false);											/// create animation frame noche
		stageItem.animations.play(keyParentDragItem);													/// set animation frame
		stageItem.colorBg 		= colorBg;																/// set animation frame
		stageItem.keyStageBg 	= keyParentDragItem;													/// set animation frame
		stageItem.anchor.setTo(0.5,0.5);

		game.add.tween(stageItem.scale).from( { x:.1,y:.1 }, 1000, Phaser.Easing.Elastic.Out, true,0);
		var isAdded = false;
		for (var i = 0; i < this.stagesItemsGameArray.length; i++) {
			if( this.stagesItemsGameArray[i].keyStageBg === keyParentDragItem && !isAdded ){
				this.stagesItemsGameArray.splice(i+1, 0, stageItem);
				isAdded = true;
			}
		};
		if(!isAdded){
			this.stagesItemsGameArray.push(stageItem);
		}

		for (var i = 0; i < this.stagesItemsGameArray.length; i++) {
			this.stagesItemsGameArray[i].bringToTop();
		}

		this.updateStagePositions();


		if( this.stagesItemsGameArray.length === 2 )
			this.showSlideControlBtns();
	},

	showSlideControlBtns:function  () {
		this.add.tween(this.prevStgbtn).to({alpha:1},1000, Phaser.Easing.Exponential.Out, true,500);
		this.add.tween(this.prevbtnShadow).to({alpha:1},1000, Phaser.Easing.Exponential.Out, true,500);
		this.add.tween(this.prevStgbtn.scale).to({x:1,y:1},1000, Phaser.Easing.Elastic.Out, true,500);

		this.add.tween(this.nextStgbtn).to({alpha:1},1000, Phaser.Easing.Exponential.Out, true,500);
		this.add.tween(this.nextbtnShadow).to({alpha:1},1000, Phaser.Easing.Exponential.Out, true,500);
		this.add.tween(this.nextStgbtn.scale).to({x:1,y:1},1000, Phaser.Easing.Elastic.Out, true,500);
		//MSclicgenerico.stop();
	   MSclicgenerico.play();
       MSclicgenerico.setVolume(80);
	},

	hideSlideControlBtns:function  () {
		this.add.tween(this.prevStgbtn).to({alpha:0},1000, Phaser.Easing.Exponential.In, true,500);
		this.add.tween(this.prevbtnShadow).to({alpha:0},1000, Phaser.Easing.Exponential.In, true,500);
		this.add.tween(this.prevStgbtn.scale).to({x:0.1,y:0.1},1000, Phaser.Easing.Elastic.In, true,500);

		this.add.tween(this.nextStgbtn).to({alpha:0},1000, Phaser.Easing.Exponential.In, true,500);
		this.add.tween(this.nextbtnShadow).to({alpha:0},1000, Phaser.Easing.Exponential.In, true,500);
		this.add.tween(this.nextStgbtn.scale).to({x:0.1,y:0.1},1000, Phaser.Easing.Elastic.In, true,500);
		//MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);
	},

	removeStage:function  (stageKeyName) {

		// console.clear();
		console.log("******************************removeStage*************************************")
		console.log("indexStageDelete:",indexStageDelete,"currentPosIndexStage",currentPosIndexStage);
		console.log(this.stagesItemsGameArray)

		var state = this;

		for (var i = state.stagesItemsGameArray.length - 1; i >= 0; i--) {
			console.log(state.stagesItemsGameArray[i].name, stageKeyName)
			if( state.stagesItemsGameArray[i].name === stageKeyName){
				indexStageDelete = i;
			}
		};
		console.log(indexStageDelete,this.stagesItemsGameArray)

		var arraySplice = this.stagesItemsGameArray.splice(indexStageDelete,1);
		var deleteStage = arraySplice[0];
		currentPosIndexStage = ( indexStageDelete<=currentPosIndexStage )?currentPosIndexStage - 1:currentPosIndexStage;
		console.log("***************deleteStage***************")
		console.log("deleteStage:",deleteStage);
		console.log("deleteStage index:",indexStageDelete);
		console.log("currentPosIndexStage:",currentPosIndexStage);
		this.add.tween(deleteStage).to({alpha:0},800,Phaser.Easing.Linear.Out,true)
		this.add.tween(deleteStage.scale).to({x:.1,y:.1},800,Phaser.Easing.Elastic.In,true).onComplete.add(function () {
			console.log("complete remove tween stage",state)
			deleteStage.destroy();
		});
		game.time.events.add(Phaser.Timer.QUARTER*3, function () {
			var isUpdate = state.updateStagePositions();
			console.log("ISUPDATE:::::::",isUpdate);
			if( !isUpdate ){
				var nextIndex;
				// debugger;
				if( indexStageDelete < state.stagesItemsGameArray.length ){
					var diff = indexStageDelete - currentPosIndexStage;
					if(diff == 1 && !currentPosIndexStage){
						state.moveSlideStage(0)
					}else{
						state.moveSlideStage(currentPosIndexStage)
					}
				}
			}				
		}, state);

		if( !this.stagesItemsGameArray.length ){
			this.hideSlideControlBtns();
			this.changeBackground("#f8c927","inicio")
		}
	   // MSclicgenerico.stop();
	    MSclicgenerico.play();
        MSclicgenerico.setVolume(80);

		return true;
		// return false;
	},

	updateStagePositions: function  () {
		console.log("------------------updateStagePositions----------------------")
		
		for (var i = 0; i < this.stagesItemsGameArray.length; i++) {
			var stage = this.stagesItemsGameArray[i];
			game.add.tween(stage).to({x: game.global.assetsJSON.settings.stageItemWidth*i, y:0},250,Phaser.Easing.Exponential.Out,true)
		};

		// stageIsTween = true;
		if(this.stagesItemsGameArray.length){
			// debugger;
			console.log("------------------updateStagePositions 1----------------------")
			if(this.stagesItemsGameArray.length <= 1 || indexStageDelete == this.stagesItemsGameArray.length ){   /// comparo si el indice del ultimo escanario borrado era el ultimo en la fila
				// indexStageDelete = (indexStageDelete === 0)?1:indexStageDelete; 								  /// si el primer item agregado seteo en 1		
				// debugger	
				console.log("------------------updateStagePositions moveSlideStage----------------------")
				var nextMove = (indexStageDelete === 0)?1:indexStageDelete;
				nextMove = (nextMove >= this.stagesItemsGameArray.length)?this.stagesItemsGameArray.length-1:nextMove;
				console.log("nextMove:",nextMove)
				this.moveSlideStage(nextMove);
				return true;
			}else{
				console.log("------------------updateStagePositions no move slide----------------------")
				console.log("currentPosIndexStage:",currentPosIndexStage)
				stageIsTween = false;
				return false;				
				// this.moveSlideStage(currentPosIndexStage);
			}
		}
		return false;
	},

	getSlideStagesPos: function  (dragItem) {
		// console.clear();
		console.log("**************getSlideStages***************")
		console.log(this)
		console.log(dragItem)
		var posIndex = null;
		var keystage = dragItem.key+dragItem.parent.key;
		for (var i = 0; i < dragItem.state.stagesItemsGameArray.length; i++) {
			if( dragItem.state.stagesItemsGameArray[i].name === keystage ){
				posIndex = i;
			}

		};
		
		this.moveSlideStage(posIndex);


	},

	moveSlideStage: function  (posIndex) {
							
		MSclicgenerico.play();
        MSclicgenerico.setVolume(80);
		// console.log("**************moveSlideStage***************")
		if( posIndex >=  this.stagesItemsGameArray.length || posIndex < 0 ){
			return false;
		} 
		
		var moveTo = game.global.assetsJSON.settings.stageItemWidth*(posIndex);
		var deltaIndex =  Math.abs(currentPosIndexStage - posIndex);

		deltaIndex = (deltaIndex)?deltaIndex:0;

		console.log("******** stage group tween**************")
		var showStage = this.stagesItemsGameArray[posIndex];

		if( !stageIsTween ){
			stageIsTween = true;
			//dragItem.state.stagesItemsGameGroupContainer
		
	

			this.changeBackground(showStage.colorBg,showStage.keyStageBg);			/// cambio el fondo de acuerdo al escenario seleccionado
			var containerStageGroup = this.stagesItemsGameGroupContainer;
			var tweenTime = 500*(deltaIndex+1);
			game.add.tween(containerStageGroup).to( {x: -moveTo }, tweenTime, Phaser.Easing.Exponential.Out,true).onComplete.add(function  () {
			// game.add.tween(containerStageGroup).to({x: -moveTo },500*(deltaIndex+1),Phaser.Easing.Exponential.Out,true).onComplete.add(function  () {
				// console.log("***********FIN stage TWEEN***************")
				// console.log("stageIsTween:",stageIsTween);
				if( (Math.abs(containerStageGroup.x) - Math.abs(moveTo)) != 0){
					console.log("not equal containerStageGroup")
					game.add.tween(containerStageGroup).to({x: -moveTo },500,Phaser.Easing.Exponential.Out,true);
				}
				currentPosIndexStage = posIndex;
				stageIsTween = false;
				console.log("_______________________________________________")
				console.log("UPDATE CURRENTPOSINDEXSTAGE:",currentPosIndexStage)

			});
		}
	},

	sendItemOriginalPos:function  (dragItem) {
		dragItem.oriParentContainer.add(dragItem);////agrega a contedor del padre si no hace contacto con caja
		dragItem.oriParentContainer.counterContainer.bringToTop();/////pone contador de elementos en el top
		this.add.tween(dragItem).to( { x: dragItem.originalPosition.x, y: dragItem.originalPosition.y }, 550, Phaser.Easing.Elastic.Out, true);
	},

	checkCollision: function (dragItem,containerDrag) {
		console.log("****Colisión item********")
		console.log(containerDrag);
		console.log(containerDrag.oriParentContainer.position);
	},

	update:function () {

		if( game.input.activePointer.leftButton.isDown ){
			this.timeoutplayer = game.time.now + this.timeoutplayerInterval;
		}

		if( game.time.now > this.timeoutplayer){
			this.showAlertmessage(game.global.assetsJSON.alertshome.timeoutmessage,4000);
			this.timeoutplayer = game.time.now + this.timeoutplayerInterval;
		}
	},

	render: function() {
		 // game.debug.spriteInfo(this.dragItemContainersarray[0].dragItems[0], 0, 30);
		 for (var i = this.dragItemContainersarray.length - 1; i >= 0; i--) {
		 	for (var j = this.dragItemContainersarray[i].dragItems.length - 1; j >= 0; j--) {
		 		
		 		// game.debug.spriteBounds(this.dragItemContainersarray[i].dragItems[j], "#ff0000", false);
		 		// game.debug.spriteBounds(this.dragItemContainersarray[i].dragItems[j].getChildAt(0), "#ffff00", false);
		 	};
		 };
	},

	shutdown:function  () {
		// alert("Cambia de estado");
		console.clear()
		//////////guardo el estado de los items///////////
		game.global.homeutils["dragItemContainersarray"] = this.dragItemContainersarray;
		for (var i = this.dragItemContainersarray.length - 1; i >= 0; i--) {
			var dragItems = this.dragItemContainersarray[i].dragItems;
			for (var j = 0; j < dragItems.length; j++) {
				console.log(dragItems[j].key);
				dragItems[j].hideCerrarBtn();
				dragItems[j].showBtnJugar = false;
			};
		};


		////Cierro el boton de eliminar item de los items antiguas si los hay////
		if ( game.global.homeutils["containerDragItemsGroupsarray"] ) {
			for (var i = 0; i < game.global.homeutils["containerDragItemsGroupsarray"].length; i++) {
				var containerDayGroup = game.global.homeutils["containerDragItemsGroupsarray"][i];
				for (var j = 0; j < containerDayGroup.items.length; j++) {
					var dragitem = containerDayGroup.items[j];
					dragitem.hideCerrarBtn();
					dragitem.showBtnJugar = false;					
				};
			};
		}

		game.global.homeutils["dragItemContainersGroup"] = this.dragItemContainersGroup;
		this.dragItemContainersGroup.visible = false;

		game.global.homeutils["containerDragItemsGroupsarray"]	= this.containerDragItemsGroupsarray;
		game.global.homeutils["containerDragItemsGroups"]		= this.containerDragItemsGroups;			
		game.global.homeutils["containerItemsbgArray"]			= this.containerItemsbgArray;

		game.global.homeutils["stagesItemsGameGroup"]			= this.stagesItemsGameGroup;	
		game.global.homeutils["stagesItemsGameArray"]			= this.stagesItemsGameArray;	
		this.stagesItemsGameGroup.visible = false;

		game.global.homeutils["avatarSelectedSprite"]			= this.avatarSelected;
		this.avatarSelected.visible = false;

		game.global.characterSelected 							= this.characterSelected;

		game.global.homeutils["platFormsGroups"]				= platFormsGroups;
		platFormsGroups.visible = false;

		game.global.homeutils["comboContainerGroup"]			= this.comboContainerGroup;
		this.comboContainerGroup.destroy();

		game.global.homeutils["counterStars"]					= this.counterStarsGroup;
		game.global.homeutils["btnHome"]						= this.btnHome;
		// this.comboContainerGroup.visible = false;

		this.saveTotalItemsGameselected();

		this.prevStgbtn.visible = false;			
		this.prevbtnShadow.visible = false;		
		this.nextStgbtn.visible = false;			
		this.nextbtnShadow.visible = false;		
	},

	saveTotalItemsGameselected:function () {
		console.clear();

		for (var i = game.global.assetsJSON.spritesheet.length - 1; i >= 0; i--) {
			if( game.global.assetsJSON.spritesheet[i].active ){
				if( !game.global.homeutils["totalItemsGameselected"][game.global.assetsJSON.spritesheet[i].name] && game.global.homeutils["totalItemsGameselected"][game.global.assetsJSON.spritesheet[i].name] != 0 ){
					game.global.homeutils["totalItemsGameselected"][game.global.assetsJSON.spritesheet[i].name] = 0;
				}
			}
		}

		for (key in game.global.homeutils["totalItemsGameselected"]) { 
			game.global.homeutils["totalItemsGameselected"][key] = 0;
		}

		console.log(game.global.homeutils["totalItemsGameselected"]);
		for (var i = game.global.homeutils["containerDragItemsGroups"].children.length - 1; i >= 0; i--) {
			for (var j = 0; j < game.global.homeutils["containerDragItemsGroups"].children[i].items.length; j++) {
				var key  = game.global.homeutils["containerDragItemsGroups"].children[i].items[j].key;
				game.global.homeutils["totalItemsGameselected"][key]++;				
			};
			// game.global.homeutils["containerDragItemsGroups"].children[i]
		};
		console.log(game.global.homeutils["totalItemsGameselected"]);
		// debugger;
	}
};

questionsTimerPop = function (game, minTime, maxTime) {

    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Time.call(this, game, game.world.randomX, game.world.randomY, 'bunny');

    this.anchor.setTo(0.5, 0.5);

    this.rotateSpeed = rotateSpeed;

    var randomScale = 0.1 + Math.random();

    this.scale.setTo(randomScale, randomScale)

    game.add.existing(this);

};