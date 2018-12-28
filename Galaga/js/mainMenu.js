var galaga = galaga || {};

  
galaga.mainMenu = {
    
    preload:function(){
        //cargamos assets
        this.stage.backgroundColor = "#000000";
        this.load.image('star', 'assets/img/spr_star.png');
        this.load.spritesheet('nave', 'assets/img/spr_player.png', 22, 24);
        this.game.load.audio('sndStart', 'assets/sounds/snd_start.wav');
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
        var numStars = 100;
        this.stars = [];
        
        for(var i = 0; i <= numStars; i++){
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
       for(var i = 0; i < this.stars.length; i++){
           if(this.stars[i].active){
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
        this.infoStyle = { font: "18px galaga", fill: "#00FFFF"};
        this.topStyle = { font: "18px galaga", fill: "#FF0000"};
        this.namcoStyle = { font: "22px galaga", fill: "#FF0000", font_weight:"bold" };
        this.lifeStyle = { font: "18px galaga", fill: "#FFFF00"};
        this.scoreStyle = { font: "18px galaga", fill: "#FFFFFF", align: "center" };
        
        this.playerText = this.game.add.text(20,0, "1UP", this.topStyle);
        
        this.topText = this.game.add.text(gameOptions.gameWidth/2 - 30,0, "HIGH SCORE", this.topStyle); 
        this.playerHighScore = this.game.add.text(gameOptions.gameWidth/2-5,15, gameOptions.highScore, this.scoreStyle); 
        
        this.startInfo = this.game.add.text(gameOptions.gameWidth/2 -75,gameOptions.gameHeight/2 -60, "PUSH START BUTTON", this.infoStyle);
        this.lifesBonus1 = this.game.add.text(gameOptions.gameWidth/2 -95,gameOptions.gameHeight/2 , "1ST BONUS FOR 30000 PTS", this.lifeStyle);
        this.lifesBonus2 = this.game.add.text(gameOptions.gameWidth/2 -95,gameOptions.gameHeight/2 +30, "2ND BONUS FOR 120000 PTS", this.lifeStyle);
        this.lifesBonus3 = this.game.add.text(gameOptions.gameWidth/2 -95,gameOptions.gameHeight/2 +60, "AND FOR EVERY 120000 PTS", this.lifeStyle);
        
        this.companyInfo = this.game.add.text(gameOptions.gameWidth/2 -110,gameOptions.gameHeight/2 +120, "©2018 RAMPAGE GAMES INC.\nALL RIGHTS RESERVED", this.scoreStyle); 
        
        this.namcoText = this.game.add.text(gameOptions.gameWidth/2 -30,gameOptions.gameHeight/2 +165, "namco®", this.namcoStyle); 

        this.creditText = this.game.add.text(0,gameOptions.gameHeight-20, "CREDITS 9", this.scoreStyle); 
        
        this.xOffset = 30;
        for(var i = 0; i < 3; i++){
            this.playerIcon= this.game.add.sprite(gameOptions.gameWidth/2 - 125,gameOptions.gameHeight/2-10 + (i * this.xOffset),'nave');
        }
    },
    
    startGame:function(){
        galaga.game.state.start('main');
    },
    
    update:function(){
        if(this.space.isDown){
            this.sndStart.play();
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
        }
    }
}