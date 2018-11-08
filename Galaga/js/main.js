//Game(width,height,renderer,capa)
var galaga = galaga || {};

var gameOptions={
    gameWidth:256,
    gameHeight:512, 
    
};

galaga.game=new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight,Phaser.AUTO,null,this,false,false);

galaga.game.state.add('main',galaga.gameState);
galaga.game.state.start('main');







    