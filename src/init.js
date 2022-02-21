const config ={
    width: 640,
    height: 360,
    parent:"container",
    type: Phaser.AUTO,
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
    this.load.image("bruno", "./assets/pixel-art-bruno.png")
}

function create(){
    this.bruno = this.physics.add.image(80, 100, "bruno");
    this.bruno.setScale(0.1);
    this.bruno.setCollideWorldBounds(true);
    this.bruno.setBounce(0.5);
    this.bruno.setVelocity(50,0);
}

function update(time, delta){
    console.log(delta);
}
