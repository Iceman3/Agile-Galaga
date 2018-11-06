var galaga = galaga || {};

galaga.game ={
    init:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setGameSize(gameOptions.gameWidth/2,gameOptions.gameHeight/2);
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.game.world.setBounds(0,0,gameOptions.gameWidth,gameOptions.gameHeight);
    },
    preload:function(){ 
        
    },
    create:function(){
        this.bg = this.game.add.tileSprite(0,0,gameOptions.gameWidth,gameOptions.gameHeight,'bg');
    },
    update:function(){     
        
    }
};