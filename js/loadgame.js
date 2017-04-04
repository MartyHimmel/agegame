var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game_canvas');
var overlay = document.getElementById('overlay');
var loadGame = function() {};
var playGame = function() {};
var endGame = function() {};

loadGame.prototype = {
	preload: function() {
		overlay.style.opacity = 0.0;
		this.game.textStyle = {fontSize: "16px", fill: "#FFFFFF"};
		
		this.text = this.game.add.text(this.game.width / 2,
			this.game.height / 2, 'Loading...', this.game.textStyle);
		this.text.anchor.set(0.5, 0.5);

		// Graphics
		this.game.load.spritesheet('sprites', 'assets/DungeonCrawl.png', 32, 32);
		this.game.load.tilemap('dungeon', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);

		// Sound
		this.game.load.audio('bgMusic', 'assets/Asylum.mp3');
		this.game.music = this.game.add.audio('bgMusic', 1, true);
		this.game.music.play();

		// Set game variables
		this.game.gold = 0;
		this.game.velocity = 180;
		this.game.age = this.game.rnd.integerInRange(18, 24);
		this.game.ageTimer = 2000;
		this.game.maxAge = this.game.rnd.integerInRange(80, 100);
		this.game.playerIsAlive = true;
		this.game.velocityChange = this.game.velocity / (this.game.maxAge - this.game.age);
		this.game.opacityChange = 1 / (this.game.maxAge - this.game.age);
		this.game.volumeChange = (1 / (this.game.maxAge * 4));
		this.game.checkTime = this.game.time.now;
	},

	create: function() {
		var startText = 'You have stumbled into the wizard\'s domain. He has thrown you ';
		startText += 'into his cursed dungeon. Down here, years go by in mere moments. ';
		startText += 'You must escape from the dungeon quickly to break free of the curse!\n\n';
		startText += 'Press space to start.';

		this.text.setText(startText);
		this.text.anchor.set(0.5, 0.5);
		this.text.wordWrap = true;
		this.text.wordWrapWidth = 580;

		this.game.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function() {
		if (this.game.space.isDown) {
			this.game.state.start('PlayGame');
		}
	}
};