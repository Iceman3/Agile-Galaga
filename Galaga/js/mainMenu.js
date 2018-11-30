var galaga = galaga || {};

  
galaga.mainMenu = {
    
    preload:function(){
        //cargamos assets
        this.stage.backgroundColor = "#000000";
        this.load.image('star', 'assets/img/spr_star.png');
        this.load.spritesheet('nave', 'assets/img/spr_player.png', 22, 24);
        this.game.load.audio('sndStart', 'assets/sounds/snd_start.wav');
        this.game.load.bitmapFont('galaga', 'assets/fonts/galaga.png', 'assets/fonts/galaga.fnt');
    },
    
    
    create:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.initStars();
        this.initHud(); 
        
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        this.sndStart = this.game.add.audio('sndStart');
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
    
    initHud:function(){
        
        /*this.infoStyle = { font: "18px galaga", fill: "#00FFFF"};
        this.topStyle = { font: "18px galaga", fill: "#FF0000"};
        this.namcoStyle = { font: "22px galaga", fill: "#FF0000", font_weight:"bold" };
        this.lifeStyle = { font: "18px galaga", fill: "#FFFF00"};
        this.scoreStyle = { font: "18px galaga", fill: "#FFFFFF", align: "center"};*/
        this.playerText = this.game.add.bitmapText(20, 0, 'galaga','1UP',18);
        this.playerText.tint = 0xFF0000;
        this.topText = this.game.add.bitmapText(gameOptions.gameWidth/2 - 30,0, 'galaga','HIGH SCORE',18);
        this.topText.tint = 0xFF0000;
        this.playerHighScore = this.game.add.bitmapText(gameOptions.gameWidth/2-5,15, 'galaga',gameOptions.highScore.toString(),18);
        this.playerHighScore.tint = 0xFFFFFF;
        this.startInfo = this.game.add.bitmapText(gameOptions.gameWidth/2 -75,gameOptions.gameHeight/2 -60, 'galaga','PUSH START BUTTON',18);
        this.startInfo.tint = 0x00FFFF;
        this.lifesBonus1 = this.game.add.bitmapText(gameOptions.gameWidth/2 -95,gameOptions.gameHeight/2, 'galaga','1ST BONUS FOR 30000 PTS',18);
        this.lifesBonus1.tint = 0xFFFF00;
        this.lifesBonus2 = this.game.add.bitmapText(gameOptions.gameWidth/2 -95,gameOptions.gameHeight/2 +30, 'galaga','2ND BONUS FOR 120000 PTS',18);
        this.lifesBonus2.tint = 0xFFFF00;
        this.lifesBonus3 = this.game.add.bitmapText(gameOptions.gameWidth/2 -95,gameOptions.gameHeight/2 +60, 'galaga','AND FOR EVERY 120000 PTS',18);
        this.lifesBonus3.tint = 0xFFFF00;
        this.companyInfo = this.game.add.bitmapText(gameOptions.gameWidth/2 -110,gameOptions.gameHeight/2 +120, 'galaga','©2018 RAMPAGE GAMES INC.\nALL RIGHTS RESERVED',18);
        this.companyInfo.tint = 0xFFFFFF;
        this.namcoText = this.game.add.bitmapText(gameOptions.gameWidth/2 -30,gameOptions.gameHeight/2 +165, 'galaga','namco®',22);
        this.namcoText.tint = 0xFF0000;
        this.creditText = this.game.add.bitmapText(0,gameOptions.gameHeight-20, 'galaga','CREDITS 9',18);
        this.creditText.tint = 0xFFFFFF;
        
        this.xOffset =30;
        for(var i=0;i<3;i++)
            {
                this.playerIcon= this.game.add.sprite(gameOptions.gameWidth/2 -125,gameOptions.gameHeight/2-10 +(i *this.xOffset),'nave');
            }

    },
    
    startGame:function(){
        galaga.game.state.start('main');
    },
    
    update:function(){
        if(this.space.isDown)
        {
            this.sndStart.play();
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
        }
    }
}