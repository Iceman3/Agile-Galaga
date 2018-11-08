var galaga = galaga || {};

galaga.bulletPrefab = function(game,x,y){
    Phaser.Sprite.call(this,game,x,y,'bullet');
    this.anchor.setTo(.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

galaga.bulletPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.bulletPrefab.prototype.constructor = galaga.bulletPrefab;