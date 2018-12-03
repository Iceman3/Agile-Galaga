var galaga = galaga || {};

  
galaga.gameState = {
    
    preload: function (){
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
        this.isChangingStage = false;
        this.playerLifes = gameOptions.playerLifes;
        
        this.gridDistance = 16;
        this.gridDistanceMultiplier = 4;


    },
    
    create:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;    
        
        this.nave = new galaga.playerPrefab(this.game,this.game.world.centerX,this.game.world.height - 50,this);
        this.time = 0;
       
        //Puntos para Movimiento de Enemigos
        this.rightSpawnPoint = new Phaser.Point(gameOptions.gameWidth +20, gameOptions.gameHeight * 0.8);
        this.leftSpawnPoint = new Phaser.Point(-20, gameOptions.gameHeight * 0.8);
        this.topSpawnPoint = new Phaser.Point(gameOptions.gameWidth/2, -20);
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
        
                
        this.isChangingStage = true;

        
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

        this.numEnemiesAttack = 2;
        this.indxEnemiesAttack = [];
        
        this.EnemiesGrid = [
            'xxxGGGGxxx',
            'RRRRRRRRRR',
            'RRRRRRRRRR',
            'YYYYYYYYYY',
            'YYYYYYYYYY',            
        ];
            
        this.Enemies = [];
        this.enemyBullets = this.add.group();
        this.p=0;
        for(var i = 0; i < this.EnemiesGrid.length; i++)
        {
            for(var j = 0; j < this.EnemiesGrid[i].length; j++)
            {
                
             var finalPoint = new Phaser.Point(gameOptions.gameWidth/2  +(this.gridDistance*j) - (this.gridDistance * 5.5) ,80+(this.gridDistance*i));

                
                switch(this.EnemiesGrid[i][j])
                {
                    case 'Y':
                       
                        var spawnPoint = new Phaser.Point(this.topSpawnPoint.x,this.topSpawnPoint.y);
                        
                        this.yellowEnemy = new galaga.yellowEnemyPrefab(this.game,spawnPoint.x,spawnPoint.y,finalPoint.x,finalPoint.y,this);

                        this.yellowEnemy.path.push(spawnPoint);
                        this.yellowEnemy.path.push(this.centerPoint);
                        this.yellowEnemy.path.push(finalPoint);
                        this.yellowEnemy.indexX = j;
                        this.yellowEnemy.indexY = i;

                        

                        this.yellowEnemy.enableBody = true;
                        this.yellowEnemy.vel = 20 * this.numberStage;
                        this.Enemies.push(this.game.add.existing(this.yellowEnemy));

                        break;

                    case 'R':
                        var spawnPoint = new Phaser.Point(0,0);
                        
                        if(this.p<4)
                            {
                                spawnPoint = this.leftSpawnPoint;
                            }
                        else if(this.p>=4 && this.p <12 ){
                            spawnPoint = this.rightSpawnPoint;
                        }
                        else{
                            spawnPoint = this.topSpawnPoint;
                        }
                        this.redEnemy = new galaga.redEnemyPrefab(this.game,spawnPoint.x,spawnPoint.y,finalPoint.x,finalPoint.y,this);

                        this.redEnemy.path.push(spawnPoint);
                        this.redEnemy.path.push(this.centerPoint);
                        this.redEnemy.path.push(finalPoint);
                        this.redEnemy.indexX = j;
                        this.redEnemy.indexY = i;

                        this.redEnemy.enableBody = true;
                        this.redEnemy.vel = 20 * this.numberStage;
                        this.Enemies.push(this.game.add.existing(this.redEnemy));
                        this.p++;

                        break;

                    case 'G':
                        var spawnPoint = new Phaser.Point(this.leftSpawnPoint.x,this.leftSpawnPoint.y);

                        this.greenEnemy = new galaga.greenEnemyPrefab(this.game,spawnPoint.x,spawnPoint.y,finalPoint.x,finalPoint.y,this);

                        this.greenEnemy.path.push(spawnPoint);
                        this.greenEnemy.path.push(this.centerPoint);
                        this.greenEnemy.path.push(finalPoint);
                        this.greenEnemy.indexX = j;
                        this.greenEnemy.indexY = i;

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
        this.infoStyle = { font: "15px galaga", fill: "#00FFFF"};
        this.topStyle = { font: "18px galaga", fill: "#FF0000", align: "center" };
        this.scoreStyle = { font: "18px galaga", fill: "#FFFFFF", align: "center" };
        
        this.playerText = this.game.add.text(20,0, "1UP", this.topStyle); 
        this.playerScore = this.game.add.text(30,15, this.score, this.scoreStyle); 
        
        this.topText = this.game.add.text(gameOptions.gameWidth/2 - 30,0, "HIGH SCORE", this.topStyle); 
        this.playerHighScore = this.game.add.text(gameOptions.gameWidth/2-5,15, this.highScore, this.scoreStyle);
        
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
        console.log(this.playerLifes);
        this.lifesOffset = 24;       
       // for(var i=1; i<gameOptions.playerLifes;i++){
        if(this.playerLifes >= 3)
        {
            this.playerlife1= this.game.add.sprite(2*this.lifesOffset-20, gameOptions.gameHeight - 28,'nave');
        }
        if(this.playerLifes >= 2)
        {
            this.playerlife2= this.game.add.sprite(1*this.lifesOffset-20, gameOptions.gameHeight - 28,'nave');
        }
        
        //this.initEnemies();
        
        this.game.add.existing(this.nave);
        
        this.initGrid();
        
        this.nave.canShoot = true;
    },
    
    whoEnemiesAttack:function(){
        var randomNumber;
        for(var i = 0; i < this.numEnemiesAttack; i++){
            randomNumber = Math.floor(Math.random() * this.Enemies.length);
            this.indxEnemiesAttack.push(randomNumber);
            console.log("who: " + randomNumber);//
        }
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
            this.playerlife1.destroy();
        }
        else if(this.playerLifes == 2){
            this.playerlife2.destroy();
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
        
        
        
        for(var i = 0; i < this.Enemies.length ; i++)
            
        {
            var offset =  Math.sin(this.game.time.now/ 1000) * this.gridDistanceMultiplier;// + this.gridDistanceMultiplier/2;
            //console.log(this.game.time);
            
            
                    var finalPoint = new Phaser.Point(gameOptions.gameWidth/2  +((this.gridDistance + offset)  * this.Enemies[i].indexX) - ((this.gridDistance + offset) * 5.5) ,80+(this.gridDistance*this.Enemies[i].indexY));

                    this.Enemies[i].path[this.Enemies[i].path.length -1] = finalPoint; 
                    this.Enemies[i].finalPosition = finalPoint;
        }
        
        
          
        
        
        
        
        if(this.initialMovement){
            for(var i = 0; i < this.currIndexEnemyToSpawn; i++){
                
                 if(this.Enemies[i].currentPath < this.Enemies[i].path.length - 1){
                    var firstPoint = this.Enemies[i].path[this.Enemies[i].currentPath];
                    var secondPoint = this.Enemies[i].path[this.Enemies[i].currentPath + 1];
                    
                    //var dir = Phaser.Point.subtract(secondPoint, firstPoint).getMagnitude();
                   // var point = Phaser.Point.add(firstPoint, Phaser.Point.subtract(secondPoint, firstPoint).setMagnitude(dir * this.Enemies[i].interpolate));
                     
                     var r = 100;
                     var dir = Phaser.Point.subtract(1, 0).normalize();
                     var Vi = new Phaser.Point(dir.y,dir.x);
                     var c = Phaser.Point.add(firstPoint,Vi.setMagnitude(r));
                     console.log(c.x, "  " , c.y);
                     var point = new Phaser.Point(Math.cos(this.Enemies[i].interpolate) * r + c.x, Math.sin(this.Enemies[i].interpolate) * r + c.y );
                     
                     
                     

                    this.Enemies[i].body.x = c.x;
                    this.Enemies[i].body.y = c.y;
                    
                    var angle = this.game.physics.arcade.angleBetween(secondPoint,this.Enemies[i].body);
                   // console.log(this.Enemies.length);
                   
                    if(i>this.Enemies.length-5 && i < this.Enemies.length)
                        {
                            this.Enemies.rotation = 0;
                        }
                    else{
                        this.Enemies[i].rotation = -angle;
                    }
                    
                    this.Enemies[i].interpolate += gameOptions.speedEnemies;
                    if(this.Enemies[i].interpolate >= 1.0){
                        this.Enemies[i].interpolate = 0.0;
                        this.Enemies[i].currentPath++;
                    }
                }
                else{
                    if(this.Enemies[i].angle > 1)
                    {
                        this.Enemies[i].angle--;        
                    }
                    else if(this.Enemies[i].angle <1)
                    {
                            this.Enemies[i].angle++;
                    }
                    else if(this.Enemies[i].angle != 0){
                        this.Enemies[i].angle = 0;
                    }
                }
            }
            
            if(this.nextWave){
                if(this.currTimeToSpawnEnemy >= this.timeToSpawnEnemy){
                    var i = this.currIndexEnemyToSpawn;
                    if(i >= this.Enemies.length){
                        if(this.Enemies[i - 1].currentPath >= this.Enemies[i - 1].path.length - 1){
                            this.initialMovement = false;
                            this.whoEnemiesAttack();
                                 
                            for(var i = 0; i < this.Enemies.length ; i++){
                                this.Enemies[i].angle = 0;
                                this.Enemies[i].path = [];
                            }

                        }
                    }
                    else{
                        this.currIndexEnemyToSpawn++;

                        var indexWave = this.currIndexEnemiesPerWave;
                        if(++this.currEnemiesPerWave >= this.numEnemiesPerWave[indexWave]){
                            this.currEnemiesPerWave = 0;
                            if(++this.currIndexEnemiesPerWave <= this.numEnemiesPerWave.length - 1){
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
        }else{
            for(var n = 0; n < this.indxEnemiesAttack; n++){
                if(this.indxEnemiesAttack[n] >= this.Enemies.length){
                    this.whoEnemiesAttack();
                    break;
                }
            }
            
            //Movimiento Separación
            for(var i = 0; i < this.Enemies.length; i++){
                var thisEnemieAttack = false;
                for(var n = 0; n < this.numEnemiesAttack; n++){
                    if(i == this.indxEnemiesAttack[n]){
                        thisEnemieAttack = true;
                        break;
                    }
                }
                
                if(!thisEnemieAttack){
                    this.Enemies[i].body.x = this.Enemies[i].finalPosition.x;                
                    this.Enemies[i].body.y = this.Enemies[i].finalPosition.y;
                }
                else{
                    //Si no hacemos el movimiento de ataque
                    this.Enemies[i].body.y++;
                    console.log("xD");//
                }
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
            
            if(this.Enemies.length <=0 )
            {
                if(this.isChangingStage)
                    {
                        this.numberStage++;
                        this.playerlife1.destroy();
                        this.playerlife2.destroy();
                        this.stageInfo();
                    }
                this.isChangingStage = false;


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