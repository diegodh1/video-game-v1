const config ={
    width: 640,
    height: 360,
    parent:"container",
    type: Phaser.AUTO,
    backgroundColor: '#469536',
    scene:{
        preload: preload,
        create: create,
        update: update,
    },
    physics:{
        default: 'arcade',
        arcade:{
            gravity:{
                y: 500,

            }
        }
    }
}

var game = new Phaser.Game(config);

function preload(){
    this.load.spritesheet("bruno", "./assets/bruno-sprites.png", {frameWidth: 650, frameHeight:460});
}

function create(){
    this.bruno = this.physics.add.sprite(80, 100, "bruno");
    this.bruno.setScale(0.1);
    this.bruno.setCollideWorldBounds(true);
    this.bruno.setBounce(0.5);
    this.bruno.setVelocity(50,0);
    console.log(this.anims.generateFrameNumbers('bruno',{
        frames:[0,1]
    }))
    this.anims.create({
        key: 'bruno_walk',
        frames: this.anims.generateFrameNumbers('bruno',{
            frames:[0,1]
        }),
        frameRate: 12,
        repeat: -1,
    });
    this.bruno.play('bruno_walk')
}

function update(time, delta){
}
