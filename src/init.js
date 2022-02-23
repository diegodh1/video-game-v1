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
var limiteSaltoBruno = 200;

function preload(){
    this.load.spritesheet("bruno", "./assets/bruno-sprites2.png", {frameWidth: 650, frameHeight:460});
    this.load.spritesheet("diego", "./assets/diego-sprites.png", {frameWidth: 290, frameHeight:470});
    this.load.image("ximena", "./assets/pixel-art-ximena.png");
}

function create(){
    game.bruno = this.physics.add.sprite(80, 500, "bruno");
    game.bruno.setScale(0.1);
    game.bruno.setCollideWorldBounds(true);
    game.bruno.setBounce(0.4);
    game.bruno.body.gravity.y = 500;
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
        delay: 1500,
        callback: addEnemy,
        callbackScope: this,
        loop: true
    });

    game.physics = this.physics
    game.physics.add.collider(game.bruno, game.enemies, function (plane, obstacle) {
        game.bruno.destroy()
        game.enemies.clear(true);
        game.timer.remove();
    });


}

function addEnemy() {
    let diego = this.physics.add.sprite(700, 452, "diego");
    diego.setScale(0.2);
    this.anims.create({
        key: 'diego_scream',
        frames: game.anims.generateFrameNumbers('diego', {
            frames: [0, 1]
        }),
        frameRate: 10,
        repeat: -1,
    });
    diego.play('diego_scream');
    diego.body.velocity.x = -50;
    diego.checkWorldBounds = true;
    diego.outOfBoundsKill = true;
    // Add the pipe to our previously created group
    game.enemies.add(diego);

}


function update(time, delta){

    if(game.cursor.up.isDown){
        if(game.bruno.y >= limiteSaltoBruno) {
            game.bruno.y -= 10;
            game.bruno.x += 1;
        }
    }
    else if(game.cursor.left.isDown){
        game.bruno.flipX = true;
        game.bruno.x -= 1;
    }
    else if(game.cursor.right.isDown){
        game.bruno.flipX = false;
        game.bruno.x += 1;
    }
    else if(game.cursor.down.isDown){
        game.bruno.y++;
    }
}
