var galaga = galaga || {};

galaga.enemyBulletPrefab = function(game,x,y,level){
    Phaser.Sprite.call(this,game,x,y,'enemyBullet');
    //this.anchor.setTo(.5);
    this.checkWorldBounds = true;
    this.level=level;
    this.outOfBoundsKill = true;
    
    this.game.physics.arcade.enable(this);
};

galaga.enemyBulletPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.enemyBulletPrefab.prototype.constructor = galaga.enemyBulletPrefab;
 
galaga.enemyBulletPrefab.prototype.update = function(){
  
    
};
   