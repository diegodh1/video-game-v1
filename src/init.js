const config ={
    width: 800,
    height: 500,
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
var limiteSaltoBruno = 200;

function preload(){
    this.load.spritesheet("bruno", "./assets/bruno-sprites2.png", {frameWidth: 650, frameHeight:460});
    this.load.spritesheet("diego", "./assets/diego-sprites.png", {frameWidth: 290, frameHeight:470});
    this.load.image("ximena", "./assets/pixel-art-ximena.png");
}

function create(){
    this.bruno = this.physics.add.sprite(80, 500, "bruno");
    this.bruno.setScale(0.1);
    this.bruno.setCollideWorldBounds(true);
    this.bruno.setBounce(0.4);
    this.anims.create({
        key: 'bruno_walk',
        frames: this.anims.generateFrameNumbers('bruno',{
            frames:[0,1]
        }),
        frameRate: 10,
        repeat: -1,
    });
    this.cursor = this.input.keyboard.createCursorKeys();
    this.bruno.play('bruno_walk')

    this.enemies = this.physics.add.group();
    this.enemies.setVelocityX(-200);
    //Detectaremos cuando las columnas salen de la pantalla...
    this.enemies.checkWorldBounds = true;
    //... y con la siguiente línea las eliminaremos
    this.enemies.outOfBoundsKill = true;

    setInterval(() =>{
        let random = Math.random();
        console.log(random)
        if(random > 0.5){
            console.log('creo ximena')
            this.ximena = this.physics.add.image(600, 500, "ximena");
            this.ximena.setScale(0.2);
            this.enemies.add(this.ximena)
        }
        else{
            console.log('creo diego')
            this.diego = this.physics.add.sprite(600, 500, "diego");
            this.diego.setScale(0.2);
            this.anims.create({
                key: 'diego_scream',
                frames: this.anims.generateFrameNumbers('diego', {
                    frames: [0, 1]
                }),
                frameRate: 10,
                repeat: -1,
            });
            this.diego.play('diego_scream');
            this.diego.setVelocity(-50);
            this.enemies.add(this.diego)
        }
    },2000);

}


function update(time, delta){
    if(this.cursor.up.isDown){
        if(this.bruno.y >= limiteSaltoBruno) {
            this.bruno.y -= 10;
            this.bruno.x += 1;
        }
    }
    else if(this.cursor.left.isDown){
        this.bruno.flipX = true;
        this.bruno.x -= 1;
    }
    else if(this.cursor.right.isDown){
        this.bruno.flipX = false;
        this.bruno.x += 1;
    }
    else if(this.cursor.down.isDown){
        this.bruno.y++;
    }
}
