const config ={
    width: 800,
    height: 500,
    parent:"container",
    type: Phaser.AUTO,
    backgroundColor: '#469536',
    scene:{
        preload: this.preload,
        create: this.create,
        update: this.update,
    },
    physics:{
        default: 'arcade',
        arcade:{
            debug: true
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
    this.load.audio('bruno_cry', './assets/music/brunollorando.mp3')
}

function create(){
    game.bruno = this.physics.add.sprite(80, 500, "bruno");
    game.bruno.setScale(0.1);
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
    //add diego enemy

    game.enemies = this.add.group();
    game.enemies.enableBody = true;
    game.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    game.timer = this.time.addEvent({
        delay: 2000,
        callback: addEnemy,
        callbackScope: this,
        loop: true
    });

    game.seconds = this.time.addEvent({
        delay: 2000,
        callback: () => velocity *= 1.1,
        callbackScope: this,
        loop: true
    });

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
    game.physics.add.collider(game.bruno, game.enemies, function (plane, obstacle) {
        game.bruno.destroy()
        game.audio.destroy();
        game.enemies.clear(true);
        game.timer.remove();
        game.seconds.remove();
        game.score.remove();
        game.audiobruno.play()
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
