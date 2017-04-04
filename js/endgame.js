endGame.prototype = {
	create: function() {
		overlay.style.opacity = 0.0;
		var endText = '';
		if (this.game.playerIsAlive) {
			endText = 'A face swirls into existance from within the portal. ';
			endText += 'It says, "You must pay 2000 gold if you wish to pass." ';
			endText += 'You pay the fee, escape through the portal, and are free ';
			endText += 'from the wizard\'s curse.\n';
			if (this.game.gold > 2000) {
				endText += 'You looted ' + (this.game.gold - 2000) + ' gold from the dungeon.';
			}
		} else {
			endText = 'The wizard\'s curse has taken it\'s toll.\n';
			endText += 'You have died of old age.';
		}

		endText += '\n\n Press space to play again.';

		this.game.message = this.game.add.text(this.game.width / 2,
			this.game.height / 2, endText, this.game.textStyle);
		this.game.message.anchor.set(0.5, 0.5);
		this.game.message.wordWrap = true;
		this.game.message.wordWrapWidth = 580;
	},

	update: function() {
		if (this.game.space.isDown) {
			this.game.state.start('LoadGame');
		}
	}
};

game.state.add('LoadGame', loadGame);
game.state.add('PlayGame', playGame);
game.state.add('EndGame', endGame);
game.state.start('LoadGame');