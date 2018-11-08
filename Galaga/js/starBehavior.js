var galaga = galaga || {};

 
galaga.starBehavior = function(game,x,y){
    Phaser.Sprite.call(this,game,x,y,'spr_star');
    this.anchor.setTo(.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    
};

galaga.starBehavior.prototype = Object.create(Phaser.Sprite.prototype);

galaga.starBehavior.prototype.constructor = galaga.starBehavior;