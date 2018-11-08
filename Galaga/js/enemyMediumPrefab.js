var galaga = galaga || {};


galaga.enemyMediumPrefab = function(game,x,y){
    Phaser.Sprite.call(this,game,x,y,'enemyMedium');
    this.anchor.setTo(1);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    
};

galaga.enemyMediumPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.enemyMediumPrefab.prototype.constructor = galaga.enemyMediumPrefab;