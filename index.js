

const canvas = document.querySelector('canvas');


gsap.to('#overlappingDiv', {
    opacity: 0,
})
canvas.width = 1024;
canvas.height = 576;
const collisionsMap = [];
const collisionSymbol = 1816 // see the value in data/collisions.js


// Map width is 40 tiles
for (let i = 0; i < collisions.length; i += 40) {
    collisionsMap.push(collisions.slice(i, i + 40));
}


// code snippet explained here https://www.youtube.com/watch?v=yP5DKzriqXA&ab_channel=ChrisCourses @2:30
const boundaries = [];
const offset = {
    x: -220,
    y: -380
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === collisionSymbol) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const    path = {
        right: canvas.width / 2 + 150,
        left: canvas.width / 2 - 150,
        top: canvas.height / 2 - 252,
        bottom: canvas.height / 2 - 150,
    }

const pathNPC = {
        topRight : {
            position: {
                x: path.right,
                y: path.top
            },
        },
        topLeft : {
            position: {
                x: path.left,
                y: path.top
            },
        },
        bottomRight : {
            position: {
                x: path.right,
                y: path.bottom
            },
        },
        bottomLeft : {
            position: {
                x: path.left,
                y: path.bottom
            },
        },
}
// c variable stands for big Context object, which in this case is a 2d API
const c = canvas.getContext('2d')

c.fillRect(0, 0, canvas.width, canvas.height);

// IMAGES ////////////////////////////////////////////////////////////////
// Images are at 300% their size when exported
// Create map image
const map = new Image()
map.src = './img/room.png';

// Create player image
const playerDownImage = new Image();
playerDownImage.src = './img/player/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/player/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/player/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/player/playerRight.png';

// Create NPC image
const guestPlayerDownImage = new Image();
guestPlayerDownImage.src = './img/guestPlayer/guestPlayerDown.png';

const guestPlayerUpImage = new Image();
guestPlayerUpImage.src = './img/guestPlayer/guestPlayerUp.png';

const guestPlayerLeftImage = new Image();
guestPlayerLeftImage.src = './img/guestPlayer/guestPlayerLeft.png';

const guestPlayerRightImage = new Image();
guestPlayerRightImage.src = './img/guestPlayer/guestPlayerRight.png';

// Create Josie image
const josieImage = new Image();
josieImage.src = './img/couple/josie.png';

// Create Alex image
const alexImage = new Image();
alexImage.src = './img/couple/alex.png';

// Create dialog images
const dialogInitiatorImage = new Image();
dialogInitiatorImage.src = './img/dialog/dialogInitiator.png'


// Create foreground image
const foregroundImage = new Image();
foregroundImage.src = './img/foreground.png';

////////////////////////////////////////////////////////////////////////////



// SPRITES ////////////////////////////////////////////////////////////////
// Player image is 288*96, hence the values below
const player = new Sprite({
    position: {
        x: canvas.width / 2 - (288 / 4) / 2,
        y: canvas.height / 2 - 96 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 6,
        hold: 10
    },
    sprites: {
        up:playerUpImage,
        down:playerDownImage,
        right:playerRightImage,
        left: playerLeftImage
    }
})

const guestPlayer = new Sprite({
    position: {
        x: canvas.width / 2 - 150,
        y: canvas.height / 2 - 150,
    },
    image: guestPlayerDownImage,
    frames: {
        max: 6,
        hold: 10
    },
    sprites: {
        up:guestPlayerUpImage,
        down:guestPlayerDownImage,
        right:guestPlayerRightImage,
        left: guestPlayerLeftImage
    },
})

const josie = new Sprite({
    position: {
        x: canvas.width / 2 - (288 / 4)/ 2 + 600,
        y: canvas.height / 2 - 96 / 2 - 170,
    },
    image: josieImage,
    frames: {
        max: 9,
        hold: 15,
        elapsed: 20,
    },
    sprites: {
        up: josieImage,
        down: josieImage,
        right: josieImage,
        left: josieImage
    },
})

const alex = new Sprite({
    position: {
        x: canvas.width / 2 - (288 / 4)/ 2 + 550,
        y: canvas.height / 2 - 96 / 2 - 170,
    },
    image: alexImage,
    frames: {
        max: 9,
        hold: 20
    },
    sprites: {
        up: alexImage,
        down: alexImage,
        right: alexImage,
        left: alexImage
    },
})

const dialogInitiatorSprite = new Sprite({
    position: {
        x: canvas.width / 2 - 150,
        y: canvas.height / 2 - 150
    },
    image: dialogInitiatorImage,
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage,
});

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: map,
});

////////////////////////////////////////////////////////////////////////////


const keys = {
    arrowDown: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    enter: {
        pressed: false
    },
    escape: {
        pressed: false
    }
}

//  ANIMATION /////////////////////////////////////////////////////

// drawImage args are:
// image Source
// x cropping startpoint
// y cropping startpoint
// cropping width 
// cropping height
// x position startpoint on the background 
// y position startpoint on the background 
// image width 
// image height


const movables = [background, ...boundaries, foreground, guestPlayer, alex, josie, pathNPC.topRight, pathNPC.topLeft, pathNPC.bottomLeft, pathNPC.bottomRight]
function rectangularCollision({rectangle1, rectangle2}) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )   
}

function movePlayer() {
    let moving = true
    player.animate = false
    if (keys.arrowUp.pressed && lastKey === 'arrowUp') {
        player.animate = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {  // {...boundary}reates a clone of boundary so we don't overwrite it
                    x: boundary.position.x,
                    y: boundary.position.y + 3,        // +3px is to foresee a collision in the future
                }} 
            }) 
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.y +=3
            })
        }
    }
    else if (keys.arrowDown.pressed && lastKey === 'arrowDown') {
        player.animate = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3,
                }} 
            }) 
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.y -=3
            })
        }
    }
    else if (keys.arrowRight.pressed && lastKey === 'arrowRight') {
        player.animate = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y,
                }} 
            }) 
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x -=3
            })
        }
    }
    else if (keys.arrowLeft.pressed && lastKey === 'arrowLeft') {
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y,
                }} 
            }) 
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x +=3
            })
        }
    }
}

function moveGuest() {
    let guestMoving = true;
    guestPlayer.animate = true;

    if (rectangularCollision({
        rectangle1: guestPlayer,
        rectangle2: player
    }) 
    ) {
        guestPlayer.animate = false
        guestMoving = false
        dialogInitiatorSprite.position.x = guestPlayer.position.x - dialogInitiatorSprite.width / 4
        dialogInitiatorSprite.position.y = guestPlayer.position.y - 55
        dialogInitiatorSprite.draw()

    }

    // go right
    while (guestPlayer.position.x < pathNPC.topRight.position.x && guestPlayer.position.y === pathNPC.bottomLeft.position.y) {
            guestPlayer.image = guestPlayer.sprites.right;
            if (guestMoving) {
                    guestPlayer.position.x++;
                }
        return
    }

    // // go UP
    while (guestPlayer.position.y > pathNPC.topLeft.position.y && guestPlayer.position.x === pathNPC.bottomRight.position.x) {
        guestPlayer.image = guestPlayer.sprites.up;
        if (guestMoving) {
                guestPlayer.position.y--;
            }
        return
    }

    //  go LEFT
    while (guestPlayer.position.x > pathNPC.topLeft.position.x && guestPlayer.position.y === pathNPC.topLeft.position.y) {
        guestPlayer.image = guestPlayer.sprites.left;
        if (guestMoving) {
                guestPlayer.position.x--;
            }
        return;
    }

    // go DOWN
    while (guestPlayer.position.y < pathNPC.bottomLeft.position.y && guestPlayer.position.x === pathNPC.bottomLeft.position.x) {
        guestPlayer.image = guestPlayer.sprites.down;
        if (guestMoving) {
                guestPlayer.position.y++;
            }
        return;
    }
    

}

function moveCouple() {
    alex.animate = true;
    josie.animate = true;
}

const dialog = {
    initiated: false
}

function openGuestDialog() {
    if (keys.enter.pressed && lastKey === 'enter' && !guestPlayer.animate && !dialog.initiated) {
        dialog.initiated = true   
    }
}

function closeGuestDialog() {
    if (keys.escape.pressed && lastKey === 'escape' && !guestPlayer.animate && dialog.initiated) {
        dialog.initiated = false   
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    var animatedDialog = window.requestAnimationFrame(animateGuestDialog);


    // Each draw is a new layer on top of the others
    background.draw()
    // boundaries.forEach( boundary => {
    //     boundary.draw()
    // })
    if (guestPlayer.position.y > player.position.y) {
        player.draw()
        guestPlayer.draw()

    }
    else {
        guestPlayer.draw()
        player.draw()
    }
    alex.draw()
    josie.draw()
    foreground.draw()

    // If there is a dialog, stop moving
    openGuestDialog()
    if (dialog.initiated) {
        gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete() {
                animateGuestDialog()
            }
        })
    }
    closeGuestDialog();

    if (!dialog.initiated) {
        gsap.to('#overlappingDiv', {
            opacity: 0,
            onComplete() {
            window.cancelAnimationFrame(animatedDialog)
            }
        })
        movePlayer();
        moveGuest();
        moveCouple();
    }
};
animate();



//  EVENTS LISTENERS /////////////////////////////////////////////////////
//Param e stands for event

// When an arrow is pressed
let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            keys.arrowDown.pressed = true;
            lastKey = 'arrowDown'
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = true;
            lastKey = 'arrowUp'
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
            lastKey = 'arrowLeft'
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true;
            lastKey = 'arrowRight'
            break
        case 'Enter':
            keys.enter.pressed = true;
            lastKey = "enter"
            break
        case 'Escape':
            keys.escape.pressed = true;
            lastKey = "escape"
            break
    }
});

// When an arrow is released
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            keys.arrowDown.pressed = false;
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = false;
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false;
            break
        case 'Enter':
            keys.enter.pressed = false;
            break
        case 'Escape':
            keys.escape.pressed = false;
            break
    }
});
