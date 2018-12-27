//Game(width,height,renderer,capa)
var galaga = galaga || {};

var gameOptions={
    gameWidth:256,
    gameHeight:512, 
    playerLifes:3,
    speedEnemies:0.015
};

galaga.game = new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight,Phaser.AUTO,null,this,false,false);

galaga.game.state.add('main', galaga.gameState);
galaga.game.state.add('mainMenu', galaga.mainMenu);
galaga.game.state.start('mainMenu');



    