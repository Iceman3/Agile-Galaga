var galaga = galaga || {};

  
galaga.gameState = {
    
    preload:function(){
        //cargamos assets
        this.stage.backgroundColor = "#000000";
        
        this.load.image('star', 'assets/img/spr_star.png');
        this.load.image('bullet', 'assets/img/spr_playerBullet.png');
        this.load.image('enemyBullet', 'assets/img/spr_enemyBullet.png');
        this.load.image('insignia1', 'assets/img/spr_insignia_1.png' );
        
        this.load.spritesheet('enemyGreen','assets/img/spr_enemyGreen.png', 16, 17);
        this.load.spritesheet('enemyYellow','assets/img/spr_enemyYellow.png', 14, 12);
        this.load.spritesheet('enemyRed','assets/img/spr_enemyRed.png', 14, 12);
        this.load.spritesheet('nave', 'assets/img/spr_player.png', 22, 24);
        this.load.spritesheet('enemy_explosion', 'assets/img/spr_enemy_explosion.png',32,32);
        this.load.spritesheet('player_explosion', 'assets/img/spr_player_explosion.png',32,32);
        
        this.game.load.audio('sndStageIntro', 'assets/sounds/stage_intro.wav');
        this.game.load.audio('sndEnemyShoot', 'assets/sounds/snd_enemy_shoot.wav');
        this.game.load.audio('sndEnemyHit', 'assets/sounds/snd_enemy_hit.wav');
        this.game.load.audio('sndEnemy1Death', 'assets/sounds/snd_enemy1_death.wav');
        this.game.load.audio('sndEnemy2Death', 'assets/sounds/snd_enemy2_death.wav');
        this.game.load.audio('sndPlayerShoot', 'assets/sounds/snd_player_shoot.wav');
        this.game.load.audio('sndPlayerDeath', 'assets/sounds/snd_player_death.wav');
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.bulletSpeed = -500; 
        this.enemyBulletSpeed = 100; 
        this.speed = 2;
        this.score = 0;
        this.highScore = gameOptions.highScore;
        this.numberStage = 1;
        
        this.gameStarted = false;
        this.isPaused = false;
        
        this.playerLifes = gameOptions.playerLifes;
        
        
        this.initialMovement = true;
        
        this.timeToSpawnEnemy = 0.065;
        this.currTimeToSpawnEnemy = 0.0;
        this.currIndexEnemyToSpawn = 0;
        
        this.numEnemiesPerWave = [8, 8, 8, 10, 10];
        this.currEnemiesPerWave = 0;
        this.currIndexEnemiesPerWave = 0;
        this.nextWave = true;
        this.timeToSpawnWave = 5.0;
        this.currTimeToSpawnWave = 0.0;
    },
    
    create:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;    
        
        this.nave = new galaga.playerPrefab(this.game,this.game.world.centerX,this.game.world.height - 50,this);
        this.time = 0;
       
        //Puntos para Movimiento de Enemigos
        this.rightSpawnPoint = new Phaser.Point(gameOptions.gameWidth +20, gameOptions.gameHeight * 0.7);
        this.centerPoint = new Phaser.Point(gameOptions.gameWidth/2, gameOptions.gameHeight/2);
        
        this.sndStageIntro = this.game.add.audio('sndStageIntro');
        this.sndEnemyShoot = this.game.add.audio('sndEnemyShoot');
        this.sndEnemyHit = this.game.add.audio('sndEnemyHit');
        this.sndEnemy1Death = this.game.add.audio('sndEnemy1Death');
        this.sndEnemy2Death = this.game.add.audio('sndEnemy2Death');
        this.sndPlayerShoot = this.game.add.audio('sndPlayerShoot');
        this.sndPlayerDeath = this.game.add.audio('sndPlayerDeath');
        
        this.initStars();
        this.sndStageIntro.play();
        this.initHud();

        this.cursores = this.input.keyboard.createCursorKeys();
        this.pKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        
        this.bullets = this.add.group();
    },
    
    initGrid:function(){
        this.EnemiesGrid = [
            'xxxGGGGxxx',
            'RRRRRRRRRR',
            'RRRRRRRRRR',
            'YYYYYYYYYY',
            'YYYYYYYYYY',            
        ];
            
        this.Enemies = [];
        this.enemyBullets = this.add.group();
        
        for(var i = 0; i < this.EnemiesGrid.length; i++)
        {
            for(var j = 0; j < this.EnemiesGrid[i].length; j++)
            {
                switch(this.EnemiesGrid[i][j])
                {
                    case 'Y':
                        var finalPoint = new Phaser.Point(50+(16*j),80+(16*i));
                        this.yellowEnemy = new galaga.yellowEnemyPrefab(this.game,this.rightSpawnPoint.x,this.rightSpawnPoint.y,finalPoint.x,finalPoint.y,this);

                        this.yellowEnemy.path.push(this.rightSpawnPoint);
                        this.yellowEnemy.path.push(this.centerPoint);
                        this.yellowEnemy.path.push(finalPoint);
                        

                        this.yellowEnemy.enableBody = true;
                        this.yellowEnemy.vel = 20 * this.numberStage;
                        this.Enemies.push(this.game.add.existing(this.yellowEnemy));

                        break;

                    case 'R':
                        var finalPoint = new Phaser.Point(50+(16*j),80+(16*i));
                        this.redEnemy = new galaga.redEnemyPrefab(this.game,this.rightSpawnPoint.x,this.rightSpawnPoint.y,finalPoint.x,finalPoint.y,this);

                        this.redEnemy.path.push(this.rightSpawnPoint);
                        this.redEnemy.path.push(this.centerPoint);
                        this.redEnemy.path.push(finalPoint);

                        this.redEnemy.enableBody = true;
                        this.redEnemy.vel = 20 * this.numberStage;
                        this.Enemies.push(this.game.add.existing(this.redEnemy));

                        break;

                    case 'G':
                        var finalPoint = new Phaser.Point(50+(16*j),80+(16*i));
                        this.greenEnemy = new galaga.greenEnemyPrefab(this.game,this.rightSpawnPoint.x,this.rightSpawnPoint.y,finalPoint.x,finalPoint.y,this);

                        this.greenEnemy.path.push(this.rightSpawnPoint);
                        this.greenEnemy.path.push(this.centerPoint);
                        this.greenEnemy.path.push(finalPoint);

                        this.greenEnemy.enableBody = true;
                        this.greenEnemy.vel = 20 * this.numberStage;
                        this.Enemies.push(this.game.add.existing(this.greenEnemy));

                        break;

                    case 'x':
                        

                        break;
                }
            }
        }

        this.spawnEnemyBulletsTimer = this.game.time.events.loop(Phaser.Timer.SECOND*4 ,this.enemyShoot,this);
        this.gameStarted = true;
    },
    
    initHud:function(){        
        this.infoStyle = { font: "15px galaga", fill: "#00FFFF",};
        this.topStyle = { font: "15px galaga", fill: "#FF0000",};
        this.scoreStyle = { font: "15px galaga", fill: "#FFFFFF", align: "center",};
        this.playerText = this.game.add.text(20,0, "1UP", this.topStyle); 
        this.playerScore = this.game.add.text(40,15, this.score, this.scoreStyle); 
        
        this.topText = this.game.add.text(gameOptions.gameWidth/2 - 30,0, "HIGH SCORE", this.topStyle); 
        this.playerHighScore = this.game.add.text(gameOptions.gameWidth/2-15,15, this.highScore, this.scoreStyle); 
        
        this.playerinfoStarts = this.game.add.text(gameOptions.gameWidth/2 - 30, gameOptions.gameHeight/2, "PLAYER 1", this.infoStyle); 

        this.game.time.events.add(Phaser.Timer.SECOND, this.changeInfo, this);
    },
    
    changeInfo:function(){
        this.playerinfoStarts.destroy();
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.stageInfo,this);
    },
    
    stageInfo:function(){
         this.stageinfoStarts = this.game.add.text(gameOptions.gameWidth/2 - 30, gameOptions.gameHeight/2, "STAGE " + this.numberStage, this.infoStyle); 
         this.game.time.events.add(Phaser.Timer.SECOND * 3.75, this.initGame, this);
    },
    
    initGame:function(){
        this.stageinfoStarts.destroy();
        this.stageOffset = 10;
        
        for(var i=1; i<=this.numberStage;i++){
            this.insigniaStage = this.game.add.sprite(gameOptions.gameWidth - (i*this.stageOffset), gameOptions.gameHeight - 20,'insignia1');
        }
        
        this.lifesOffset = 24;       
       // for(var i=1; i<gameOptions.playerLifes;i++){
        if(this.playerLifes >= 3)
        {
            this.playerlife1= this.game.add.sprite(1*this.lifesOffset-20, gameOptions.gameHeight - 28,'nave');
        }
        if(this.playerLifes >= 2)
        {
            this.playerlife2= this.game.add.sprite(2*this.lifesOffset-20, gameOptions.gameHeight - 28,'nave');
        }
        
        //this.initEnemies();
        
        this.game.add.existing(this.nave);
        
        this.initGrid();
        
        this.nave.canShoot = true;
    },
    
    updateHUD: function(){
        this.playerScore.setText(this.score); 
        if(this.score > this.highScore)
        {
            this.playerHighScore.setText(this.score);
        }
        
        
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
     
    restartPlayer:function()
    {
        if(this.playerLifes==3){
            this.playerlife2.destroy();
        }
        else if(this.playerLifes == 2){
            this.playerlife1.destroy();
        }
        
        this.playerLifes--;
        if(this.playerLifes != 0){
            this.nave = new galaga.playerPrefab(this.game,this.game.world.centerX,this.game.world.height - 50,this);
            this.nave.canShoot = true;
            this.game.add.existing(this.nave);
        }
        else{
            this.endGameText = this.game.add.text(gameOptions.gameWidth/2 - 40,gameOptions.gameHeight/2, "GAME OVER", this.infoStyle);
        }
    },
    
    createBullet:function(){
        this.bullet = this.bullets.getFirstExists(false);
        if(!this.bullet){
            this.bullet = new galaga.bulletPrefab(this.game, this.nave.body.x+12, this.nave.top,this);
            this.bullet.enableBody = true;
            this.bullets.add(this.bullet);
        }
        else{
            this.bullet.reset(this.nave.body.x+12, this.nave.top);
        }    
        
        this.bullet.body.velocity.y = this.bulletSpeed;
        this.sndPlayerShoot.play();
    },
    
    enemyShoot:function(){ 
        if(this.Enemies.length !=0){
            var rndIndex = Math.floor(Math.random() * this.Enemies.length);

            this.enemyBullet = new galaga.enemyBulletPrefab(this.game,this.Enemies[rndIndex].body.x+6,this.Enemies[rndIndex].body.y+8,this);
            this.enemyBullet.enableBody = true;
            this.enemyBullet.body.velocity.y = this.enemyBulletSpeed;
            this.enemyBullets.add(this.enemyBullet);
            this.sndEnemyShoot.play();
        }
    },
    
    updateEnemies:function(){
        if(this.initialMovement){
            for(var i = 0; i < this.currIndexEnemyToSpawn; i++){
                if(this.Enemies[i].currentPath < this.Enemies[i].path.length - 1){
                    var firstPoint = this.Enemies[i].path[this.Enemies[i].currentPath];
                    var secondPoint = this.Enemies[i].path[this.Enemies[i].currentPath + 1];

                    var point = Phaser.Point.add(firstPoint, Phaser.Point.subtract(secondPoint, firstPoint).setMagnitude(Phaser.Point.subtract(secondPoint, firstPoint).getMagnitude() * this.Enemies[i].interpolate));

                    this.Enemies[i].body.x = point.x;
                    this.Enemies[i].body.y = point.y;

                    this.Enemies[i].interpolate += gameOptions.speedEnemies;
                    if(this.Enemies[i].interpolate >= 1.0){
                        this.Enemies[i].interpolate = 0.0;
                        this.Enemies[i].currentPath++;
                    }
                }
            }
            
            if(this.nextWave){
                if(this.currTimeToSpawnEnemy >= this.timeToSpawnEnemy){
                    var i = this.currIndexEnemyToSpawn;
                    if(i >= this.Enemies.length){
                        if(this.Enemies[i - 1].currentPath >= this.Enemies[i - 1].path.length - 1){
                            this.initialMovement = false;
                        }
                    }
                    else{
                        this.currIndexEnemyToSpawn++;

                        var indexWave = this.currIndexEnemiesPerWave;
                        if(++this.currEnemiesPerWave >= this.numEnemiesPerWave[indexWave]){
                            this.currEnemiesPerWave = 0;
                            if(++this.currIndexEnemiesPerWave < this.numEnemiesPerWave.length - 1){
                                this.nextWave = false;
                            }
                        }
                    }
                    this.currTimeToSpawnEnemy = 0.0;
                }
                else{
                    this.currTimeToSpawnEnemy += this.game.time.elapsed / 1000.0;
                }
            }
            else{
                if(this.currTimeToSpawnWave >= this.timeToSpawnWave){
                    this.nextWave = true;
                    this.currTimeToSpawnWave = 0.0;
                }
                else{
                    this.currTimeToSpawnWave += this.game.time.elapsed / 1000.0;
                }
            }
        }
        else{
            ///Movimineto Separacion
            for(var i = 0; i < this.Enemies.length; i++){
                var point = Phaser.Point.add(this.Enemies[i].finalPosition, Phaser.Point.normalize(Phaser.Point.subtract(
                            this.Enemies[i].finalPosition, new Phaser.Point(gameOptions.gameWidth/2,80))).setMagnitude(
                            Math.abs(Math.sin(this.game.time.totalElapsedSeconds()))*20));

                this.Enemies[i].body.x = point.x;
                this.Enemies[i].body.y = point.y;
            }
        }
    },
    
    update:function(){
        this.updateHUD();
        
        if(this.gameStarted){
            this.updateEnemies();
                
            if(this.cursores.right.isDown){
                this.nave.body.x += this.speed;
            }
            else if(this.cursores.left.isDown){
                this.nave.body.x -= this.speed;
            }else{
                this.nave.body.velocity.x =0;
            }

            if(this.pKey.isDown){ 
                if(!this.isPaused){
                    this.pauseText = this.game.add.text(gameOptions.gameWidth/2-40, gameOptions.gameHeight/2, 'Paused', this.scoreStyle);
                    this.game.paused = true; 
                }
                else{
                    this.pauseText.destroy();
                    this.game.paused = false;
                }
            }
            if(this.rKey.isDown){
                galaga.game.state.start('main');
            }

            if(this.nave.canShoot && (this.space.isDown && this.space.downDuration(1))){
                this.createBullet();
            }

            this.time++;
        }
    },
    
            
}