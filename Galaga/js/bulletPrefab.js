var galaga = galaga || {};

galaga.bulletPrefab = function(game,x,y,level){
    Phaser.Sprite.call(this,game,x,y,'bullet');
    this.anchor.setTo(.5);
    this.checkWorldBounds = true;
    this.level=level;
    this.outOfBoundsKill = true;
    
    this.game.physics.arcade.enable(this);
};

galaga.bulletPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.bulletPrefab.prototype.constructor = galaga.bulletPrefab;

galaga.bulletPrefab.prototype.update = function(){
  
    
};
   
