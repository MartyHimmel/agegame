playGame.prototype = {

	create: function() {
		// Set physics engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Draw the map
		this.game.map = this.game.add.tilemap('dungeon');
		this.game.map.addTilesetImage('DungeonCrawl', 'sprites');
		this.game.mapLayer = this.game.map.createLayer('Layout');
		this.game.map.setCollision([1157], true, 'Layout');
		this.game.mapLayer.resizeWorld();

		// Populate the map
		this.createTreasure();
		this.createPotions();
		this.createExit();

		// Create player
		var playerStart = this.findObjectByType('playerStart', this.game.map, 'Objects');
		this.player = this.game.add.sprite(playerStart[0].x, playerStart[0].y, 'sprites', 2895);
		// this.player = this.game.add.sprite(1750, 1800, 'sprites', 2895);

		// Scale player slightly to allow easier movement through doorways
		this.player.scale.setTo(0.92, 0.92);

		this.game.physics.arcade.enable(this.player);
		this.game.camera.follow(this.player);		
		this.player.body.collideWorldBounds = true;

		// Set up score text area
		this.goldText = this.game.add.text(16, 16, 'Gold: ' + this.game.gold, this.game.textStyle);
		this.goldText.fixedToCamera = true;

		// Set up age text area
		this.ageText = this.game.add.text(16, 48, 'Age: ' + this.game.age, this.game.textStyle);
		this.ageText.fixedToCamera = true;

		// Set up directional keys
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function() {
		// Player is not moving
		this.player.body.velocity.y = 0;
		this.player.body.velocity.x = 0;
	 
	 	// Handle movement (key presses)
		if(this.cursors.up.isDown) {
			this.player.body.velocity.y -= this.game.velocity;
		}
		else if(this.cursors.down.isDown) {
			this.player.body.velocity.y += this.game.velocity;
		}
		if(this.cursors.left.isDown) {
			this.player.body.velocity.x -= this.game.velocity;
		}
		else if(this.cursors.right.isDown) {
			this.player.body.velocity.x += this.game.velocity;
		}
		
		// Handle collision
		this.game.physics.arcade.collide(this.player, this.game.mapLayer);
		this.game.physics.arcade.overlap(this.player, this.game.items, this.collect, null, this);
		this.game.physics.arcade.overlap(this.player, this.game.potions, this.reverseAge, null, this);
		this.game.physics.arcade.overlap(this.player, this.game.exit, this.escapeDungeon, null, this);

		// Aging effects
		if (this.game.time.now >= this.game.checkTime + this.game.ageTimer) {
			this.agePlayer();
		}

		if (this.game.age >= this.game.maxAge) {
			this.playerDied();
		}
	},

	agePlayer: function() {
		this.game.checkTime = this.game.time.now;

		this.game.age++;
		this.ageText.text = 'Age: ' + this.game.age;

		this.game.velocity -= this.game.velocityChange;
		this.game.music.volume -= this.game.volumeChange;

		overlay.style.opacity = +overlay.style.opacity + this.game.opacityChange;
	},

	reverseAge: function(player, item) {
		this.game.age -= +item.value;
		this.ageText.text = 'Age: ' + this.game.age;

		this.game.velocity += (this.game.velocityChange * +item.value);
		this.game.music.volume += (this.game.volumeChange * +item.value);

		overlay.style.opacity = +overlay.style.opacity - (this.game.opacityChange * +item.value);

		item.destroy();
	},

	findObjectByType: function(type, map, layer) {
		var result = [];
		map.objects[layer].forEach(function(element) {
			if (element.properties.type === type) {
				element.y -= map.tileHeight;
				result.push(element);
			}
		});
		return result;
	},

	createFromTiledObject: function(element, group) {
		var sprite = group.create(element.x, element.y, 'sprites', element.gid - 1);

		Object.keys(element.properties).forEach(function(key) {
			sprite[key] = element.properties[key];
		});
	},

	createTreasure: function() {
		this.game.items = this.game.add.group();
		this.game.items.enableBody = true;
		var item;
		result = this.findObjectByType('treasure', this.game.map, 'Objects');
		result.forEach(function(element) {
			this.createFromTiledObject(element, this.game.items);
		}, this);
	},

	createPotions: function() {
		this.game.potions = this.game.add.group();
		this.game.potions.enableBody = true;
		var potion;
		result = this.findObjectByType('ageReversal', this.game.map, 'Objects');
		result.forEach(function(element) {
			this.createFromTiledObject(element, this.game.potions);
		}, this);
	},

	createExit: function() {
		this.game.exit = this.game.add.group();
		this.game.exit.enableBody = true;
		var exit;
		result = this.findObjectByType('exit', this.game.map, 'Objects');
		result.forEach(function(element) {
			this.createFromTiledObject(element, this.game.exit);
		}, this);
	},

	collect: function(player, item) {
		this.game.gold += +item.value;
		this.goldText.text = 'Gold: ' + this.game.gold;
		item.destroy();
	},

	escapeDungeon: function(player, exit) {
		if (this.game.gold >= 2000) {
			this.game.state.start('EndGame');
		} else {
			var message = 'A face swirls into existance from within the portal. ';
			message += 'It says, "You must pay 2000 gold if you wish to pass."';
			this.displayMessage(message);
		}
	},

	playerDied: function() {
		this.game.playerIsAlive = false;
		this.game.state.start('EndGame');
	},

	displayMessage: function(message) {
		if (!this.messageIsVisible(message)) {
			var text = this.game.add.text(this.game.camera.width / 2,
				this.game.camera.height / 2, message, this.game.textStyle);
			text.anchor.set(0.5, 0.5);
			text.fixedToCamera = true;
			text.wordWrap = true;
			text.wordWrapWidth = 580;
			this.removeTextBlock(text);
		}
	},

	messageIsVisible: function(message) {
		if (message === this.game.message) {
			return true;
		}
		this.game.message = message;
		return false;
	},

	removeTextBlock: function(text) {
		setTimeout(function() {
			text.setText('');
			this.game.message = '';
		}, 1500);
	}
};