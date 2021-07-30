/**
 * Author Carlos Figueroa
 * Contact carlosfh87@gmail.com
 * Web Developer
 */


/*******Clases*******/

/*****pop up pregutnas clases*****/
TimerPopPreguntas = function (game,minTime,maxTime,preguntas,puntos) {

	this.index 		= 0;
	this.puntos 	= puntos?puntos:0;
	this.preguntas 	= Phaser.ArrayUtils.shuffle(preguntas);		/// pasamos las preguntas al objeto TimerPopPreguntas
	this.initTime 	= game.time.now;	/// tiempo de inicio

	this.minTime 	= Phaser.Timer.SECOND*minTime; 	/// tiempo minimo
	this.maxTime 	= Phaser.Timer.SECOND*maxTime;	/// tiempo máximo

	this.limitTime 	= this.initTime + game.rnd.integerInRange(this.minTime, this.maxTime); /// tiempo limite del contador

	console.log(this.minTime,this.maxTime);

	this.updateTimer = function () {
		// console.log("tiempo bencido");
		console.log(this);
		this.initTime 	= game.time.now;															/// Obtengo el tiempo inicial
		this.limitTime 	= this.initTime + game.rnd.integerInRange(this.minTime, this.maxTime);		/// Elijo un tiempo random entre el minTime y maxTime
		// console.log("this.limitTime:",this.limitTime)
		// this.index++
		// debugger;
	}

	var bmd = game.add.bitmapData(1, 1); 		///Creación del bitmap data
	bmd.ctx.beginPath(); 						/// empezar a llenar el bitmap
	bmd.ctx.rect(0, 0, 1, 1); 					/// se define las dimensiones del rectangulo
	bmd.ctx.fillStyle = '#000000'; 				//// color del relleno
	bmd.ctx.fill(); 

	var callreturn = Phaser.Sprite.call(this,game,0,0,bmd);			/// Instancio el objeto basado en la clase sprite
	// debugger;
	// game.state.getCurrentState().add.existing(this);				/// agrego el elemento al estado actual
	game.state.getCurrentState().stage.addChild(this);				/// agrego el elemento al stage

	this.visible = false;											/// ocultamos el sprite para uqe no sea visible ya que su función es solo de timer
}

TimerPopPreguntas.prototype = Object.create(Phaser.Sprite.prototype);	/// instancio el prototipo de la clase Sprite
TimerPopPreguntas.prototype.constructor = TimerPopPreguntas;			/// Le paso mi propio construsctor
TimerPopPreguntas.prototype.update = function () {						/// hago una instancia de la función update del Sprite

	if(this.index < this.preguntas.length && game.state.getCurrentState().key !== "Home"){ 	/// chequeo si hay preguntas  pendientes por mostrar
		
		this.currentTime = game.time.now;								/// actualizo el contador
		// console.clear()
		// console.log("update time:",this.currentTime,this.limitTime);

		if(this.currentTime>this.limitTime){							/// valido si se supero el tiempo para mostrar la pregunta
			// console.log("show question")
			game.paused = true;
			game.global.showQuestionPop(this.preguntas[this.index],this.puntos,this);	/// muestro la pregunta
			// this.updateTimer();											/// actualizo tiempo y busco siguiente pregunta
		}
	}else{																/// si se acabaron las preguntas destruyo el objeto
		this.destroy();
	}
}