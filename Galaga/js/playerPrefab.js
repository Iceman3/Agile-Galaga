var galaga = galaga || {};

galaga.playerPrefab = function(game,x,y,level){
    Phaser.Sprite.call(this,game,x,y,'nave');
    //this.anchor.setTo(.5);
    this.level = level;
    this.canShoot = false;
    
    this.checkWorldBounds = true;    
    this.enableBody = true; 
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
};

galaga.playerPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.playerPrefab.prototype.constructor = galaga.playerPrefab;


galaga.playerPrefab.prototype.hitBullet = function(player,bullet){
    this.canShoot = false;
    
    player.kill();
    bullet.kill();
    
    this.level.sndShipHit.play();
    this.level.sndPlayerDeath.startTime = 1.5;
    this.level.sndPlayerDeath.play();
    
    this.explosion = this.game.add.sprite(player.body.x,player.body.y,'player_explosion');
    this.explosion.animations.add('die', [0,1,2,3],5,false);
    this.explosion.animations.play('die');
    this.game.time.events.add(Phaser.Timer.SECOND*1,this.stopExplosion,this);
};

galaga.playerPrefab.prototype.stopExplosion = function(){
    this.explosion.kill();
    this.level.restartPlayer();
};


galaga.playerPrefab.prototype.update = function(){
    this.game.physics.arcade.collide(this,this.level.enemyBullets,this.hitBullet,null,this);
};
   