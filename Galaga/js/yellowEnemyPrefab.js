var galaga = galaga || {};


galaga.yellowEnemyPrefab = function(game,x,y,level){
    Phaser.Sprite.call(this,game,x,y,'enemyYellow');
    this.anchor.setTo(1);
    this.animations.add('fly',[0,1],2,true);
    this.animations.play('fly');
   // this.checkWorldBounds = true;
   // this.outOfBoundsKill = true;
    this.level = level;
    
    
    this.game.physics.arcade.enable(this);
    
};

galaga.yellowEnemyPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.yellowEnemyPrefab.prototype.constructor = galaga.yellowEnemyPrefab;