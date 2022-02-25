const config ={
    width: 800,
    height: 500,
    parent:"container",
    type: Phaser.AUTO,
    backgroundColor: '#49BE59',
    scene:{
        preload: this.preload,
        create: this.create,
        update: this.update,
    },
    physics:{
        default: 'arcade',
        arcade:{
            debug: false
        }
    }
}

var game = new Phaser.Game(config);
console.log(game)
var velocity = -80;
var score = 0;

function preload(){
    this.load.spritesheet("bruno", "./assets/bruno-sprites2.png", {frameWidth: 650, frameHeight:460});
    this.load.spritesheet("diego", "./assets/diego-sprites.png", {frameWidth: 290, frameHeight:470});
    this.load.spritesheet("ximena", "./assets/ximena-sprites.png", {frameWidth: 494, frameHeight:494});
    this.load.bitmapFont('carrier_command', './assets/fonts/carrier_command.png', './assets/fonts/carrier_command.xml');
    this.load.audio('audio_theme', './assets/music/theme.wav');
    this.load.audio('bruno_cry', './assets/music/brunollorando.mp3');
    this.load.image('score_board', './assets/score-board.png');
    this.load.image('happy', './assets/happy.png');
    this.load.image('sad', './assets/sad.png');
    this.load.image('house', './assets/casa.png');
    this.load.image('grass', './assets/pasto-pixel.png');
}

function create(){
    game.bruno = this.physics.add.sprite(80, 500, "bruno");
    game.bruno.setScale(0.1);
    //houses
    game.house = this.physics.add.image(710, 250, "house");
    game.house.setScale(0.3);
    game.house2 = this.physics.add.image(710, 100, "house");
    game.house2.setScale(0.3);
    game.house3 = this.physics.add.image(710, 395, "house");
    game.house3.setScale(0.3);
    //grass
    game.grass = this.physics.add.image(550, 395, "grass");
    game.grass.setScale(0.08);
    game.grass = this.physics.add.image(100, 385, "grass");
    game.grass.setScale(0.08);
    game.grass = this.physics.add.image(200, 100, "grass");
    game.grass.setScale(0.08);
    game.grass = this.physics.add.image(400, 200, "grass");
    game.grass.setScale(0.08);
    game.grass = this.physics.add.image(400, 50, "grass");
    game.grass.setScale(0.08);
    game.bruno.setCollideWorldBounds(true);
    game.bruno.setBounce(0.4);
    game.anims.create({
        key: 'bruno_walk',
        frames: game.anims.generateFrameNumbers('bruno',{
            frames:[0,1]
        }),
        frameRate: 10,
        repeat: -1,
    });
    game.cursor = this.input.keyboard.createCursorKeys();
    game.bruno.play('bruno_walk')
    //add  enemies
    game.enemies = this.add.group();
    game.enemies.enableBody = true;
    game.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    //add enemy every n seconds
    game.timer = this.time.addEvent({
        delay: 2000,
        callback: addEnemy,
        callbackScope: this,
        loop: true
    });

    //increase enemy velocity each 1.1 seconds
    game.seconds = this.time.addEvent({
        delay: 2000,
        callback: () => velocity *= 1.1,
        callbackScope: this,
        loop: true
    });

    //update score
    game.score = this.time.addEvent({
        delay: 200,
        callback: () => score++,
        callbackScope: this,
        loop: true
    });

    //show score
    this.textScore = this.add.bitmapText(10, 10, 'carrier_command','SCORE: '+ score,20);
    //game audio
    game.audio = this.sound.add('audio_theme', {loop: true})
    game.audiobruno = this.sound.add('bruno_cry', {loop: false})
    game.audio.play()

    game.physics = this.physics
    game.context = this
    game.finalpoints = score
    game.physics.add.collider(game.bruno, game.enemies, function (plane, obstacle) {
        game.bruno.destroy()
        game.audio.destroy();
        game.enemies.clear(true);
        game.timer.remove();
        game.seconds.remove();
        game.score.remove();
        game.audiobruno.play();
        //show score
        //score board
        game.board = game.context.physics.add.image(400, 250, "score_board");
        game.board.setScale(0.5);

        game.points = game.context.add.bitmapText(290, 250, 'carrier_command','YOUR POINTS: '+ game.finalpoints,13);
        game.points.setTint(0x1A1918);
        game.minPoints = game.context.add.bitmapText(290, 300, 'carrier_command','MIN POINTS: '+ 200,13);
        game.minPoints.setTint(0x1A1918);

        game.container = game.context.add.container(0, -300);
        if(game.finalpoints < 200){
            game.mood = game.context.physics.add.image(400, 180, "sad");
            game.mood.setScale(0.07);
            game.result = game.context.add.bitmapText(290, 350, 'carrier_command','YOU LOSS',13);
            game.result.setTint(0xff0000);
        }
        else{
            game.mood = game.context.physics.add.image(400, 180, "happy");
            game.mood.setScale(0.09);
            game.result = game.context.add.bitmapText(290, 350, 'carrier_command','YOU WIN',13);
            game.result.setTint(0x067715);
        }
        game.container.add([game.board,game.points, game.minPoints, game.mood, game.result])

        game.context.tweens.add({
            targets: game.container,
            duration: 600,
            ease: 'Pointer1',
            y: 0
        })
    });
}


function addEnemy() {

    // Add the pipe to our previously created group
    let enemy = createEnemy()
    game.enemies.add(enemy);

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createEnemy(){
    let arr =[100,200, 300, 400, 450]
    let option = getRandomInt(1, 5);
    console.log(option)
    let positiony = arr[option - 1]
    if(Math.random() > 0.5) {
        let diego = game.physics.add.sprite(700, positiony, "diego");
        diego.setScale(0.2);
        game.anims.create({
            key: 'diego_scream',
            frames: game.anims.generateFrameNumbers('diego', {
                frames: [0, 1]
            }),
            frameRate: 10,
            repeat: -1,
        });
        diego.play('diego_scream');
        diego.body.velocity.x = velocity;
        diego.checkWorldBounds = true;
        diego.outOfBoundsKill = true;
        return diego;
    }
    else{
        let ximena = game.physics.add.sprite(700, positiony, "ximena");
        ximena.setScale(0.2);
        game.anims.create({
            key: 'ximena_cry',
            frames: game.anims.generateFrameNumbers('ximena', {
                frames: [0, 1]
            }),
            frameRate: 9,
            repeat: -1,
        });
        ximena.play('ximena_cry');
        ximena.body.velocity.x = velocity;
        ximena.checkWorldBounds = true;
        ximena.outOfBoundsKill = true;
        return ximena;
    }
}


function update(time, delta){
    this.textScore.text = 'SCORE: '+ score;
    game.finalpoints = score
    if(game.cursor.up.isDown){
        game.bruno.y -= 5;
    }
    else if(game.cursor.left.isDown){
        game.bruno.flipX = true;
        game.bruno.x -= 5;
    }
    else if(game.cursor.right.isDown){
        game.bruno.flipX = false;
        game.bruno.x += 5;
    }
    else if(game.cursor.down.isDown){
        game.bruno.y += 5;
    }
}
