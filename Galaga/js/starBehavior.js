var galaga = galaga || {};

 
galaga.starBehavior = function(game,x,y,active){
    Phaser.Sprite.call(this,game,x,y,'star');
    this.anchor.setTo(.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.active = active;
 
};

galaga.starBehavior.prototype = Object.create(Phaser.Sprite.prototype);

galaga.starBehavior.prototype.constructor = galaga.starBehavior;

 