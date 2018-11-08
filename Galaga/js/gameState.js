var galaga = galaga || {};

  
galaga.gameState = {
    
    preload:function(){
        //cargamos assets
        this.stage.backgroundColor = "#000000";
        /*this.load.image('bg1','assets/img/background_back.png');
        this.load.image('bg2','assets/img/background_frontal.png');*/
        this.load.image('star', 'assets/img/spr_star.png');
        this.load.image('bullet', 'assets/img/spr_bullet_0.png');
        this.load.spritesheet('enemyMedium','assets/img/enemy-medium.png', 32, 16);
        this.load.spritesheet('nave', 'assets/img/spr_player.png', 16, 24);
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bulletSpeed = -100; 
        this.speed = 2;
        //this.enemyMediumSpeed=20;
        
        
    },
    
    create:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       
        
       
        
       
        /*this.bg1 =  this.game.add.tileSprite(0,0,128,256,'bg1');
        this.bg2 =  this.game.add.tileSprite(0,0,128,256,'bg2');
        this.bg1.scale.setTo(2);
        this.bg2.scale.setTo(2);*/
        this.initStars();
         
        
        this.nave = this.game.add.sprite(this.game.world.centerX,this.game.world.height - 50,'nave');
        this.nave.animations.add('stand',[0,1],10,true);
        this.nave.animations.add('left',[2,3],10,true);
        this.nave.animations.add('right',[4,5],10,true);
        this.nave.scale.setTo(2);
        this.nave.anchor.setTo(.5);
        this.cursores = this.input.keyboard.createCursorKeys();
        
        
       
        
      
        this.game.physics.arcade.enable(this.nave);
        this.nave.body.collideWorldBounds = true;
       // this.loadBullets();
       // this.loadEnemyMedium();
        
      
    },
    
    initStars:function(){
         this.stars = this.add.group();
       
        
         for(var i=0; i<=100; i++)
         {
            
            this.stars.create(Math.random() * gameOptions.gameWidth,Math.random() * gameOptions.gameHeight, 'star');
            
         } 
        this.starFlareTimer = this.game.time.events.loop(Phaser.Timer.SECOND*2,this.flareStar,this);
        
    },
    
    flareStar:function( ){
     
        
         /*for(var i=0; i<100; i+=2)
             {
                 this.stars.remove(item);
             }*/
    },
    
    loadBullets:function(){
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/5,this.createBullet,this);
        
    },
    
    createBullet:function(){
       var bullet =  this.bullets.getFirstExists(false);
        if(!bullet){
            bullet = new galaga.bulletPrefab(this.game, this.nave.x, this.nave.top);
            this.bullets.add(bullet);
            
        }else{
            bullet.reset(this.nave.x, this.nave.top);
        }
        
        bullet.body.velocity.y = this.bulletSpeed;
        
    },
    
      loadEnemyMedium:function(){
        this.enemyMediums = this.add.group();
        this.enemyMediums.enableBody = true;
        this.spawnTimer = this.game.time.events.loop(Phaser.Timer.SECOND*2,this.createEnemyMedium,this);
        
    },
    
     createEnemyMedium:function(){
       var enemyMedium =  this.enemyMediums.getFirstExists(false);
        if(!enemyMedium){
            enemyMedium = new galaga.enemyMediumPrefab(this.game,Math.random()*this.game.width,Math.random()*this.game.height/3);
            this.enemyMediums.add(enemyMedium);
            
        }else{
            enemyMedium.reset(Math.random()*this.game.width,Math.random()*this.game.height/3);
        }
         enemyMedium.body.velocity.y = this.enemyMediumSpeed;
        
        
    },
    
    update:function(){
        
        /*this.bg1.tilePosition.y += .95;
        this.bg2.tilePosition.y += .50;*/
        
         if(this.cursores.right.isDown){
            this.nave.animations.play('right');
             this.nave.body.velocity.x += this.speed;
        }else
        
        if(this.cursores.left.isDown){
            this.nave.animations.play('left');
             this.nave.body.velocity.x -= this.speed;
        }else{
            this.nave.animations.play('stand');
        }
        
        
        
    }
}