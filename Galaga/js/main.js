//Game(width,height,renderer,capa)
var galaga = galaga || {};
galaga.game=new Phaser.Game(256,512,Phaser.AUTO,null,this,false,false);

galaga.game.state.add('main',galaga.gameState);
galaga.game.state.start('main');







    