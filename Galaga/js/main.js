var galaga = galaga || {};

var gameOptions={
    gameWidth:960,
    gameHeight:540,
    levelWidth:1280,
    levelHeight:800,
    heroSpeed:200
};

galaga.game = new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight,Phaser.AUTO,'gameFrame',this,false,false);

galaga.game.state.add('game',galaga.game);
galaga.game.state.start('game');
