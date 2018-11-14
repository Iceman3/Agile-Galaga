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
  
    
    /*for(var i=0; i<2; i++){*/
        
        if(this.level.bulletScope[0].body.position.y <= 0){
            
            this.level.bulletScope[0].destroy(); 
            this.level.bulletScope.length = 0; 
            console.log(this.level.bulletScope.length);
            // this.level.bulletScope[1].destroy(); 
            //this.level.bulletScope.length -= 1; 
        }
   // }
        
   /*
     if(this.level.bulletScope[1].body.position.y <= 0){
        this.level.bulletScope[1].destroy(); 
        
        this.level.bulletScope.length = 0; 
    }*/
}