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
        this.load.spritesheet('nave', 'assets/img/player.png', 22, 24);
        this.load.image('insignia1', 'assets/img/insignia_1.png' );
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bulletSpeed = -100; 
        this.speed = 2;
        
        this.score=0;
        this.highScore= 20000;
        this.numberStage=1;
        this.lifes = 3;
        
        this.isPaused = false;
        //this.enemyMediumSpeed=20;
        
        
    },
    
    create:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       
      
        
       
        /*this.bg1 =  this.game.add.tileSprite(0,0,128,256,'bg1');
        this.bg2 =  this.game.add.tileSprite(0,0,128,256,'bg2');
        this.bg1.scale.setTo(2);
        this.bg2.scale.setTo(2);*/
        this.initStars();
        this.initHud(); 
        
        this.nave = this.game.add.sprite(this.game.world.centerX,this.game.world.height - 50,'nave');
      
       // this.nave.scale.setTo(2);
        this.nave.anchor.setTo(.5);
        this.cursores = this.input.keyboard.createCursorKeys();
        
        
       
        
      
        this.game.physics.arcade.enable(this.nave);
        this.nave.body.collideWorldBounds = true;
        
        this.pKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        
       // this.loadBullets();
       // this.loadEnemyMedium();
        
      
    },
    
    initHud:function(){
        this.stageOffset = 10;
        for(var i=1; i<=this.numberStage;i++){
        this.insigniaStage = this.game.add.sprite(gameOptions.gameWidth - (i*this.stageOffset), gameOptions.gameHeight - 20,'insignia1');
        }
        
        this.lifesOffset = 24;
        for(var i=1; i<this.lifes;i++){
        this.insigniaStage = this.game.add.sprite(i*this.lifesOffset-20, gameOptions.gameHeight - 28,'nave');
        }
        
        this.topStyle = { font: "15px arcade", fill: "#FF0000",};
        this.scoreStyle = { font: "15px arcade", fill: "#FFFFFF", align: "center",};
        this.playerText = this.game.add.text(0,0, "1UP", this.topStyle); 
        this.playerScore = this.game.add.text(15,15, this.score, this.scoreStyle); 
        
        this.topText = this.game.add.text(gameOptions.gameWidth/2 - 30,0, "HIGHSCORE", this.topStyle); 
        this.playerScore = this.game.add.text(gameOptions.gameWidth/2,15, this.highScore, this.scoreStyle); 
        
        

    },
    
    initStars:function(){
        // this.stars = this.add.group();
       
         this.stars = [];
         
         for(var i=0; i<=100; i++)
         {
             this.isVisible = Math.floor(Math.random() * 2);
             this.active = false;
         
             if(this.isVisible == 0){
                 this.active = false;
               
             }
             else{
                 this.active = true;
                
             }
             
                          
             
            this.star = new galaga.starBehavior(this.game,Math.random() * gameOptions.gameWidth,Math.random() * gameOptions.gameHeight,this.active);
             
           
             if(this.isVisible == 0){
                 
                 this.star.visible = false;
             }
             else{
               
                 this.star.visible = true;
             }
            
             
           this.stars.push( this.game.add.existing(this.star));
             
            // this.game.add.existing(this.star);
            
            
         } 
        
       this.starFlareTimer = this.game.time.events.loop(Phaser.Timer.SECOND/2,this.flareStar,this);
        
    },
    
   flareStar:function(){
       for(var i=0; i<=100; i++)
         {
             
             if(this.stars[i].active)
                 {
                     this.stars[i].active = false;
                     
                 this.stars[i].visible = false;
                 }
             else{
                     this.stars[i].active = true;   
                 
                 this.stars[i].visible = true;
             }
             
              
         }
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
            
             this.nave.body.velocity.x =0;
        }
        
        if(this.pKey.isDown){
            console.log("·hola"); 
            if(!this.isPaused)
            {
                this.pauseText = this.game.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight/2, 'Paused', this.scoreStyle);

                this.game.paused = true; 
                
            }
            else{
                this.pauseText.destroy();
                this.game.paused = false;
            }
        }
        
        
        
    },
     
    
}