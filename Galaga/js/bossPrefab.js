var galaga = galaga || {};


galaga.bossPrefab = function(game,x,y,level){
    Phaser.Sprite.call(this,game,x,y,'boss');
    this.anchor.setTo(.5);
    this.animations.add('fly',[0,1,2,3],15,true);
    this.animations.play('fly');
    this.level = level;
        
    this.lifes = 20;
    
    this.game.physics.arcade.enable(this);
    
};

galaga.bossPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.bossPrefab.prototype.constructor = galaga.bossPrefab;

galaga.bossPrefab.prototype.hitBullet = function(enemy,bullet)
{
    if(--this.lifes <= 0){
       
        
        enemy.kill();
        this.explosion = this.game.add.sprite(enemy.body.x+50,enemy.body.y+50,'enemy_explosion');
        
        this.explosion.scale.setTo(5);
        this.explosion.anchor.setTo(.5);
        this.explosion.animations.add('die', [0,1,2,3,4],30,false);
        this.explosion.animations.play('die');

        this.game.time.events.add(Phaser.Timer.SECOND/5,this.stopExplosion,this);
        this.level.score += 5000;

        this.level.sndEnemyHit.play();
        this.level.sndEnemy2Death.play();
        this.level.isBossTime = false;
    }
    else{
       
        this.level.sndEnemyHit.play();
    }
    bullet.kill();
    this.level.numberHits++;
};

galaga.bossPrefab.prototype.stopExplosion = function(){
    this.explosion.kill();
};

galaga.bossPrefab.prototype.update = function(){
    this.game.physics.arcade.overlap(this,this.level.bullets,this.hitBullet,null,this);   
     if(this.level.endGame){
        this.kill();
       
    }
    
};