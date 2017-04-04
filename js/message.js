message.prototype = {
	init: function(message) {
		this.message = message;
	},

	create: function() {
		console.log(this.message);
		var text = this.game.add.text(this.game.world.centerX,
			this.game.world.centerY, this.message, this.game.textStyle);
		text.anchor.set(0.5, 0.5);
		this.game.state.start('PlayGame');
	}
};