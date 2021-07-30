/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */

var game = null;
//sonidos
var MSfondo = new buzz.sound("assets/audio/MUSICAOP1.ogg"),
    MSalerta = new buzz.sound("assets/audio/EFECTOALERTA4.ogg"),
    MSclicgenerico = new buzz.sound("assets/audio/EFECTOCLICKBOTONES.ogg"),
    MSpuntos = new buzz.sound("assets/audio/EFECTOESTRELLA.ogg"),
    MSganar = new buzz.sound("assets/audio/EFECTOGANASTE2.ogg"),
    MSganarfin = new buzz.sound("assets/audio/EFECTOGANASTE1.ogg"),
    MSerror = new buzz.sound("assets/audio/EFECTOINTENTAOTRAVEZ.ogg");

    //MSfondo.play();
   
   // MSfondo.loop();
   // MSfondo.setVolume(20);


window.onload = function() {
 
	$('p.fonts').hide();
	game = new Phaser.Game(1170, 824, Phaser.AUTO, 'game',null,true);
   
	game.global = {
		bacgroundColor 		: function (color) {
			// $('body').css('backgroundColor',color);
			TweenMax.to($('body'),.5,{css:{backgroundColor:color},ease:Linear.easeNone});
		},
		characterSelected 	:null,
		points 				:'',
		updatePoints		:function () {
				
		},
		loaderFile 			: "assets.json?"+Math.random(),
		assetsJSON 			: null,
		homeutils			: {
			// contadorPuntos:
			itemGameSeleted 				: null,			
			dragItemContainersarray 		: null,			
			dragItemContainersGroup 		: null,			
			containerDragItemsGroupsarray 	: null,			
			containerDragItemsGroups 		: null,			
			counterStars 					: null,			
			containerItemsbgArray 			: null,
			totalItemsGameselected 			: {},
			getMenuGames					: function () {
				var menu;
				for (var i = game.stage.children.length - 1; i >= 0; i--) {
					if( game.stage.children[i].name === "menuGames" )
						menu = game.stage.children[i];
				};
				return menu;
			}
		},

		showQuestionPop:function (pregunta, puntosGame, reference) {
          	   $("#cloud-msgv").removeClass("animated shake");
			if(!$('.modal').is(':visible')){ /// Valido que no se este mostrando cualquier otro pop up
				var puntos = (puntosGame)?puntosGame:0;
				game.paused = true;
                 
				$("#pregunta").html(pregunta.pregunta);

				$("#respuestas").html('');										/// limpio el campo de las opciones de respuestas
				var opciones = Phaser.ArrayUtils.shuffle(pregunta.opciones);	/// hago un ramdon de las opciones
				$.each(opciones,function (index,value) {						/// añado caga pregunta con su respectivo valor
					var branch = (index === 0)?"<br>":"<br><br>";
					var opcion = branch+'<input type="radio" id="quest'+index+'" name="questions" value="'+value.correcta+'"> <label for="quest'+index+'">'+value.opcion+'</label>'
					$("#respuestas").append(opcion);

				})

				$("#botonPopPreguntas").bind( "click", function (event) {		/// agrego evento de click para validar la opción seleccionada
                       MSclicgenerico.stop();
                       MSclicgenerico.play();
                       MSclicgenerico.setVolume(80);
			
					var respuesta = $('input[name=questions]:checked', '#respuestas').val();
					respuesta = (respuesta === undefined )?undefined:JSON.parse(respuesta);
                 
					
					if(respuesta === undefined){	
										/// si la persona presiono el botón de responder si seleccionar una opción, muestro mensaje de elegir opción
					//	$("#error-msg").text("Elije una opción");
						$("#cloud-msgv").addClass("animated shake");
						MSerror.stop();
						MSerror.play();
                        MSerror.setVolume(80);
						
						
					}else if( respuesta === true ){								/// si elijio la respeusta correcta, muestro mensaje "Muy bien"
						//$("#error-msg").text("¡Muy bien!");
					    MSganar.stop();
						MSganar.play();
                        MSganar.setVolume(80);
					

					}else{

						$("#cloud-msgv").addClass("animated shake");
						MSerror.stop();
						MSerror.play();
                        MSerror.setVolume(80);
						//$("#error-msg").text("Respuesta incorrecta.");			

			             //.to({rotation: Math.PI*.15},50,Phaser.Easing.Exponential.Out,true,0,3,true);
					}

					$("#error-msg").show(200);

					TweenMax.delayedCall(1,function () {///hace un delay para esconder la respuesta si selecciono una
						$("#error-msg").hide(200);		/// esconde mensaje

						if(respuesta !== undefined){		/// chequea que la respuesta se haya elegido
							if( respuesta === true ){		/// si la respuesta es la correcta aumenta el contador de estrellas
								if(game.global.homeutils["counterStars"])
								   game.global.homeutils["counterStars"].updateCurrentTotal(puntos);
								   game.global.closePop();			/// Cierra pop up;
							       reference.updateTimer();						/// hago el llamado de la función
							       reference.index++;

							}							
							//game.global.closePop();			/// Cierra pop up;
							//reference.updateTimer();						/// hago el llamado de la función
							//reference.index++;
							 $("#cloud-msgv").removeClass("animated shake");

						}else{
						 $("#cloud-msgv").removeClass("animated shake");
						}
					})
                   
					//console.log("respuesta:",respuesta);
				} );

				// pregunta.pregunta
				TweenMax.from('.character',.5,{css:{bottom:-$('.character').height()+"px"}, delay:1, ease:Expo.easeOut});
				TweenMax.from('.cloud-msg',1,{css:{scaleX:0, scaleY:0}, delay:2, ease:Elastic.easeOut});

				$(".preguntas").show();
			}else{
				game.global.closePop();			/// Cierra pop up;
				reference.updateTimer();						/// hago el llamado de la función				
			}
	     	setTimeout(function(){ MSalerta.stop();
						MSalerta.play();
			            MSalerta.setVolume(80); }, 1000);
		},
		/*****recibe el texto de instrucciones y un callback******/
		showIntructionsGame:function (instrucciones,callback) {
	
            
			$("#msinicio").show();
			$("#msrespuestam").hide();
			$("#msrespuesta").hide();
			game.paused = true;
            
			var fn = (callback)?callback:this.closePop;
		
		
			$('#cloud-msg-top h1').html(instrucciones.titulo);
			$('#cloud-msg-content p').html(instrucciones.contenido);
			$('#botonPop').val(instrucciones.boton);
			$('#botonPop').bind( "click", fn );

			$('.items').hide();
			$('.modal.instructions').show();

			TweenMax.from('.character',.5,{css:{bottom:-$('.character').height()+"px"}, delay:1, ease:Expo.easeOut});
			TweenMax.from('.cloud-msg',1,{css:{scaleX:0, scaleY:0}, delay:2, ease:Elastic.easeOut});
			TweenMax.staggerFrom(['#cloud-msg-top *','#cloud-msg-content *','#cloud-msg-bottom *'],.5,{css:{opacity:0}, delay:3, ease:Linear.easeNone},.25);

			if( $(".spritesheet") ){
				
				$(".spritesheet").animateSprite({

				    fps: 3,
				    animations: {
				        presskey: [0, 1, 2]
				    },
				    loop: true
				    
				});
			}	
			setTimeout(function(){ MSalerta.stop();
						MSalerta.play();
			            MSalerta.setVolume(80); }, 2000);
				 	    		
		},
		showBanharItemsPop:function (items,callback) {
			var ok = true;
			$("#msinicio").hide();
			$("#item").hide();
			
			$('.item span').removeClass('no-ok');

			$.each(items,function(index,item) { //// recorro todos los items elegidos para bañar y valido que sean los correctos
				$( $('.item img')[index] ).attr('src','assets/images/banhar/'+item.key+'.png');
				var validItem = ( item.valid )?'':'no-ok';
				$($('.item span')[index]).addClass(validItem);

				ok = ( item.valid )?ok:false;
			
			});

			if ( ok ){ /// si los items son correctos muestro mensaje ok
				$("#msrespuesta").show();
				$("#msrespuestam").hide();
				$('#cloud-msg-top h1').html('¡Súper!<br>Ya tienes todo listo');
				$('#cloud-msg-content p').html('<br><br>Agua, champú, jabón y toalla es todo lo que necesitas :)<br>');
				$('#botonPop').val('¡Tomar la ducha!');
				MSganar.stop();
				MSganar.play();
                MSganar.setVolume(80);
			
			}else{ /// si los items son incorrectos muestro mensaje de error
			    $("#msrespuesta").hide();
			    $("#msrespuestam").show();
				$('#cloud-msg-top h1').html('¡Oh, oh!<br>Inténtalo nuevamente');
				$('#cloud-msg-content p').html('<br><br>Hay elementos que hacen falta a la hora de tomar un baño<br>');
				$('#botonPop').val('Escoger nuevamente');
				MSerror.stop();
				MSerror.play();
                MSerror.setVolume(80);
		

			}		
            $("#items").show();
			$('.items').show();
			$('.modal.instructions').show();
             
			TweenMax.from('.character',.5,{css:{bottom:-$('.character').height()+"px"}, delay:1, ease:Expo.easeOut});
			TweenMax.from('.cloud-msg',1,{css:{scaleX:0, scaleY:0}, delay:2, ease:Elastic.easeOut});
			TweenMax.staggerFrom(['#cloud-msg-top *','#cloud-msg-content *','#cloud-msg-bottom *'],.5,{css:{opacity:0}, delay:3, ease:Linear.easeNone},.25);
   
		    setTimeout(function(){ MSalerta.stop();
						MSalerta.play();
			            MSalerta.setVolume(80); }, 2000);
			return ok;
		},
		showDormirItemsPop:function (items,callback) {
			var ok = true;
			
			$("#msinicio").hide();
		    $('.item span').removeClass('no-ok');
            $("#item").show();

			$.each(items,function(index,item) { //// recorro todos los items elegidos para dormir y valido que sean los correctos
			//	alert(item.key);
				$( $('.item img')[index] ).attr('src','assets/images/dormir/'+item.key+'.png');
				var validItem = ( item.valid )?'':'no-ok';
				$($('.item span')[index]).addClass(validItem);

				ok = ( item.valid )?ok:false;
			});
          
			if ( ok ){ /// si los items son correctos muestro mensaje ok
				$("#msrespuesta").show();
				$("#msrespuestam").hide();
				$('#cloud-msg-top h1').html('¡Súper!<br>Ya lo tienes tu pinta lista');
				$('#cloud-msg-content p').html('<br><br>Mañana será otro día para vivir una nueva aventura. :)<br>');
				$('#botonPop').val('¡Hora de ir a dormir!');
				MSganar.stop();
				MSganar.play();
                MSganar.setVolume(80);
			
			}else{ /// si los items son incorrectos muestro mensaje de error
			    $("#msrespuesta").hide();
			    $("#msrespuestam").show();
				$('#cloud-msg-top h1').html('¡Oh, oh!<br>Se te acabó el tiempo');
				$('#cloud-msg-content p').html('<br><br>y no alcanzaste a alistar tu pinta para mañana. <br>');
				$('#botonPop').val('Vuelve a intentarlo');
			    MSerror.stop();
			    MSerror.play();
                MSerror.setVolume(80);
	         
			}		

		 $('.items').show();
		 $("#items").hide();

			$('.modal.instructions').show();

			TweenMax.from('.character',.5,{css:{bottom:-$('.character').height()+"px"}, delay:1, ease:Expo.easeOut});
			TweenMax.from('.cloud-msg',1,{css:{scaleX:0, scaleY:0}, delay:2, ease:Elastic.easeOut});
			TweenMax.staggerFrom(['#cloud-msg-top *','#cloud-msg-content *','#cloud-msg-bottom *'],.5,{css:{opacity:0}, delay:3, ease:Linear.easeNone},.25);

				setTimeout(function(){ MSalerta.stop();
						MSalerta.play();
			            MSalerta.setVolume(80); }, 2000);

			return ok;
		},

		showDormirItemsPop2:function (items,callback) {
			var ok = true;
			
			$("#msinicio").hide();
		    $('.item span').removeClass('no-ok');

			/*$.each(items,function(index,item) { //// recorro todos los items elegidos para dormir y valido que sean los correctos
				$( $('.item img')[index] ).attr('src','assets/images/banhar/'+item.key+'.png');
				var validItem = ( item.valid )?'':'no-ok';
				$($('.item span')[index]).addClass(validItem);

				ok = ( item.valid )?ok:false;
			});*/
          
			if ( ok ){ /// si los items son correctos muestro mensaje ok
				$("#msrespuesta").hide();
			    $("#msrespuestam").show();
				$('#cloud-msg-top h1').html('¡Oh, oh!<br>Se te acabó el tiempo');
				$('#cloud-msg-content p').html('<br><br>y no alcanzaste a alistar tu pinta para mañana. <br>');
				$('#botonPop').val('Vuelve a intentarlo');
			    MSganar.play();
                MSganar.setVolume(80);		
			}		

			$('.items').hide();
			$('.modal.instructions').show();

			TweenMax.from('.character',.5,{css:{bottom:-$('.character').height()+"px"}, delay:1, ease:Expo.easeOut});
			TweenMax.from('.cloud-msg',1,{css:{scaleX:0, scaleY:0}, delay:2, ease:Elastic.easeOut});
			TweenMax.staggerFrom(['#cloud-msg-top *','#cloud-msg-content *','#cloud-msg-bottom *'],.5,{css:{opacity:0}, delay:3, ease:Linear.easeNone},.25);
            
		
				setTimeout(function(){ MSalerta.stop();
						MSalerta.play();
			            MSalerta.setVolume(80); }, 2000);
			return ok;
		},



		/*****recibe el texto de instrucciones y un callback******/
		showFinalPopGame:function (gameIcon, callback) {

			var fn = (callback)?callback:this.closePop;
	
			$("#win-img").attr('src','assets/images/general/'+gameIcon+'-complete.png');
			$('.botonPop.win-btn').bind( "click", fn );		
			$('.modal.win').show();
            MSganarfin.stop();
		    MSganarfin.play();
            MSganarfin.setVolume(80);	
			
			//$(audio)

		},
		closePop:function () {
		//	console.log("unbind and close")
		         MSclicgenerico.stop();
		 MSclicgenerico.play();
         MSclicgenerico.setVolume(80);	 
        
			$('#botonPopPreguntas').unbind( "click" );
			$('#botonPop').unbind( "click" );
			$('.modal').hide();
     
			game.paused = false;
	
	 
            
			
		}
		 

}


	
	game.state.add('Boot', 		preloader.boot);
	game.state.add('Preloader', preloader.preloader);
	game.state.add('Prehome', 	menu.prehome);
	game.state.add('Home', 		menu.home);
	game.state.add('Bañarse', 	banhar.juego1);
	game.state.add("Bañarse2",	banhar.juego2);
	game.state.add("Comer",		comer.juego1);
	game.state.add('Comer2', 	comer.juego2);
	game.state.add('Dormir', 	dormir.juego1);
	game.state.add('Dormir2', 	dormir.juego2);
	//game.state.add('load', loadState);

  
	//game.state.add('audio',     audio.juego2);

	game.state.start('Boot');

	resizeGame();

};
