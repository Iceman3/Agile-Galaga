var galaga = galaga || {};


galaga.greenEnemyPrefab = function(game,x,y,level){
    Phaser.Sprite.call(this,game,x,y,'enemyGreen');
    this.anchor.setTo(.5);
    this.animations.add('fly',[0,1],2,true);
    this.animations.play('fly');
    this.animations.add('hit',[2,3],2,true);
   // this.checkWorldBounds = true;
   // this.outOfBoundsKill = true;
    this.level = level;
    this.startPosition = new Phaser.Point(x,y);
    this.path = [];
    this.interpolate = 0;
    this.currentPath = 0;
    
    this.lifes = 2;
    
    this.game.physics.arcade.enable(this);
    
};

galaga.greenEnemyPrefab.prototype = Object.create(Phaser.Sprite.prototype);

galaga.greenEnemyPrefab.prototype.constructor = galaga.greenEnemyPrefab;

galaga.greenEnemyPrefab.prototype.hitBullet = function(enemy,bullet)
{
    if(--this.lifes <= 0){
        this.level.Enemies.splice(this.level.Enemies.indexOf(enemy),1);
        enemy.kill();
        bullet.kill();
        this.explosion = this.game.add.sprite(enemy.body.x+8,enemy.body.y+8,'enemy_explosion');

        this.explosion.anchor.setTo(0.5);
        this.explosion.animations.add('die', [0,1,2,3,4],30,false);
        this.explosion.animations.play('die');

        this.game.time.events.add(Phaser.Timer.SECOND/5,this.stopExplosion,this);
        this.level.score +=100;

        this.level.sndEnemyHit.play();
        this.level.sndEnemy2Death.play();
    }
    else{
        this.animations.play('hit');
        this.level.sndEnemyHit.play();
    }
};

galaga.greenEnemyPrefab.prototype.stopExplosion = function(){
    this.explosion.kill();
};

galaga.greenEnemyPrefab.prototype.update = function(){
    this.game.physics.arcade.collide(this,this.level.bullets,this.hitBullet,null,this);   
};