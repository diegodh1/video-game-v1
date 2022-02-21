const config ={
    width: 640,
    height: 360,
    parent:"container",
    type: Phaser.AUTO,
    scene:{
        preload: preload,
        create: create,
        update: update,
    }
}

var game = new Phaser.Game(config);

function preload(){
    console.log('hola soy preload');
}

function create(){
    console.log('hola soy create');
}

function update(time, delta){
    console.log(delta);
}
