/* 

Toptions

1. Next set
2. hue shift, via sepia filter in some cases
3. variation on current style

1. Blue head
2. Ghost - just write with opacity .1 etc
3. Squares/dots
4. Slices: vetical, horizontal and both   
5. Draw rotated image/Bounce around screen


8. Delay ghosting
9. Ghost texture map
10. Line movement
11. Eye trails
12. Feature tracking

*/
var video;
var balls = [];
var pastFrame;
var firstTime = true;
var style = 0;
var substyle = 0;
var imageStep = 0;
var angle = 0.0;
var sliceCount = 0;
var next = false;
var mx;
var my;

var splash;
var button;
var button1;
var button2;
var button3;
var buttonl;
var buttonr;
var crosshairs;
var canvas;
var bdy;
window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
    splash = document.querySelector('splash');
    splash.onmousedown = function (e) {
        e.stopPropagation();
        splash.hidden = true;
    }
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    buttonl = document.querySelector('buttonl');
    buttonr = document.querySelector('buttonr');
    bdy = document.getElementById('body');
    button.onmousedown = function (e) {
        e.stopPropagation();
        Action(1);
    }
    button1.onmousedown = function (e) {
        e.stopPropagation();
        Action(2);
    }
    button2.onmousedown = function (e) {
        e.stopPropagation();
        Action(3);
    }
    crosshairs = document.querySelector('crosshairs');
    crosshairs.hidden = true;
}


function toggleButtons() {
    button.hidden = !button.hidden;
    button1.hidden = !button1.hidden;
    button2.hidden = !button2.hidden;
}

var player;
var player1;
var player2;
var player3;

function PlaySound(i) {
    try {
        switch (i) {
            case 1:
                if (player == undefined) {
                    player = document.getElementById('audio');
                    player.loop = false;
                }
                player.load();
                player.play();
                break;
            case 2:
                if (player1 == undefined) {
                    player1 = document.getElementById('audio1');
                }
                player1.load();
                player1.play();
                break;
            case 3:
                if (player2 == undefined) {
                    player2 = document.getElementById('audio2');
                }
                player2.load();
                player2.play();
                break;
        }
    } catch (e) {};
}

var huecount = 0;
var invert = false;

function Action(i) {
    switch (i) {
        case 1:
            substyle++;
            switch (style) {
                case 0:
                    if (substyle > 3)
                        substyle = 0;
                    break;
                case 1:
                    if (substyle > 3)
                        substyle = 0;
                    break;
                case 2:
                    if (substyle > 3)
                        substyle = 0;
                    break;
                case 3:
                    if (substyle > 2)
                        substyle = 0;
                    break;
                case 4:
                    if (substyle > 2)
                        substyle = 0;
                    if (substyle == 2) {
                        for (i = 0; i < balls.length * 3; i++) {
                            balls.pop();
                        }
                        balls.push(new Ball(100, 50));
                    }
                    break;
            }
            PlaySound(1);
            break;
        case 2:
            huecount++;
            if (huecount > 5) {
                huecount = 0;
                invert = !invert;
            }

            if (invert) {
                bdy.style.filter = "invert(100%) hue-rotate(" + (huecount * 60) + "deg)";
                button.style.filter = button1.style.filter = button2.style.filter = "invert(100%)"
            } else {
                bdy.style.filter = "hue-rotate(" + (huecount * 60) + "deg)";
                button.style.filter = button1.style.filter = button2.style.filter = ""
            }
            PlaySound(2);
            break;
        case 3:
        case 4:
            next = true;
            image(video, 0, 0, windowWidth, windowHeight);
            substyle = 0;
            style++;
            if (style > 4)
                style = 0;
            //            firstTime = true;
            imageStep = 30;
            PlaySound(3);
            break;
        case 7: // toggle buttons
            toggleButtons();
            break;
    }
}

function mousePressed() {
    mx = mouseX;
    my = mouseY;
    if (style == 4 && substyle == 2) {
        if (balls.length > 10)
            balls.shift();
        balls.push(new Ball(windowWidth - mouseX, mouseY))
    }
}

window.addEventListener('keydown', e => {
    if (e.repeat)
        return;
    mx = windowWidth / 2;
    my = windowHeight / 2;
    switch (e.keyCode) {
        case 32:
        case 49:
            Action(1);
            break;
        case 50:
            Action(2);
            break;
        case 51:
        case 13:
        case 52:
            Action(3);
            break;
        case 53:
            toggleButtons();
            break;

    }
});

function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);
    background(100);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    pastFrame = createGraphics(video.width, video.height);
    background(0);
    mx = windowWidth / 2;
    my = windowHeight / 2;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


class Ball {

    constructor(x, y) {
        this.x = x
        this.y = y
        this.xv = random(-10, 10)
        this.yv = random(-10, 10)
        this.size = random(90, 190)
        this.r = 0
    }
    render() {
        fill(255, 255, 255, 32)
        this.x = this.x + this.xv
        this.y = this.y + this.yv
        if (this.x < 0 || this.x > windowWidth) {
            this.xv = -this.xv
        }
        if (this.y < 0 || this.y > windowHeight) {
            this.yv = -this.yv
        }
        push()
        translate(this.x, this.y)
        rotate(this.r)
        image(video, 0, 0, this.size, this.size)
        pop()
        this.r += 0.02; // PB 0, 0.2, -0.2
    }
}


function draw() {
    imageMode(CORNER);
    translate(width, 0);
    scale(-1.0, 1.0);
    if (firstTime) {
        tint(128);
        image(video, 0, 0, windowWidth, windowHeight);
        //        filter(BLUR, 5);
        firstTime = false;
        return;
    } else
        image(video, 0, 0, 1, 1);
    let ratioW = video.width / windowWidth;
    let ratioH = video.height / windowHeight;
    switch (style) {
        case 0: // blue head
            noTint();
            video.loadPixels();
            //On parcourt l'image
            switch (substyle) {
                case 0:
                    for (var i = 0; i < video.width; i++) {
                        for (var j = 0; j < video.height; j++) {
                            pos = 4 * (j * video.width + i);
                            var r = video.pixels[pos];
                            var g = video.pixels[pos + 1];
                            var b = video.pixels[pos + 2];
                            var alpha = video.pixels[pos + 3];

                            var moy = (r + g + b) / 3;

                            video.pixels[pos] = r; // normal colours
                            video.pixels[pos + 1] = g;
                            video.pixels[pos + 2] = g - r + 1.5 * b;
                            video.pixels[pos + 3] = r - g;

                            if (next) {
                                next = false;
                                return;
                            }
                        }
                    }
                    break;
                case 1:
                    for (var i = 0; i < video.width; i++) {
                        for (var j = 0; j < video.height; j++) {
                            pos = 4 * (j * video.width + i);
                            var r = video.pixels[pos];
                            var g = video.pixels[pos + 1];
                            var b = video.pixels[pos + 2];
                            var alpha = video.pixels[pos + 3];

                            video.pixels[pos] = g - b;
                            video.pixels[pos + 1] = g + b - r;
                            video.pixels[pos + 2] = g - r + 1.5 * b;
                            video.pixels[pos + 3] = r - g;

                            if (next) {
                                next = false;
                                return;
                            }
                        }
                    }
                    break;
                case 2:
                    for (var i = 0; i < video.width; i++) {
                        for (var j = 0; j < video.height; j++) {
                            pos = 4 * (j * video.width + i);
                            var r = video.pixels[pos];
                            var g = video.pixels[pos + 1];
                            var b = video.pixels[pos + 2];
                            var alpha = video.pixels[pos + 3];

                            video.pixels[pos] = g; // good green effect
                            video.pixels[pos + 1] = r;
                            video.pixels[pos + 2] = g - r + 1.5 * b;
                            video.pixels[pos + 3] = r - g;

                            if (next) {
                                next = false;
                                return;
                            }
                        }
                    }
                    break;
                case 3:
                    for (var i = 0; i < video.width; i++) {
                        for (var j = 0; j < video.height; j++) {
                            pos = 4 * (j * video.width + i);
                            var r = video.pixels[pos];
                            var g = video.pixels[pos + 1];
                            var b = video.pixels[pos + 2];
                            var alpha = video.pixels[pos + 3];

                            video.pixels[pos] = g - -b; // red
                            video.pixels[pos + 1] = g + b - r;
                            video.pixels[pos + 2] = g - r + 1.5 * b;
                            video.pixels[pos + 3] = r - g;
                            if (next) {
                                next = false;
                                return;
                            }
                        }
                    }
                    break;
            }
            video.updatePixels();
            image(video, 0, 0, windowWidth, windowHeight);
            break;
        case 1: // ghosting
            switch (substyle) {
                case 0:
                    tint(255, 255, 255, 15);
                    image(video, 0, 0, windowWidth, windowHeight);
                    break;
                case 1:
                    tint(255, 255, 255, 30);
                    image(video, 0, 0, windowWidth, windowHeight);
                    break;
                case 2: // ghosting 2
                    imageStep++;
                    if (imageStep < 20) {
                        return;
                    }
                    imageStep = 0;
                    tint(255, 255, 255, 50);
                    image(video, 0, 0, windowWidth, windowHeight);
                    break;
                case 3:
                    imageStep++;
                    if (imageStep < 10) {
                        return;
                    }
                    imageStep = 0;
                    tint(255, 255, 255, 50);
                    image(video, 0, 0, windowWidth, windowHeight);
                    break;
            }
            break;
        case 2: // draw with squareslet 
            switch (substyle) {
                case 0:
                    for (let i = 0; i < 200; i++) {
                        let x = int(random(video.width));
                        let y = int(random(video.height));
                        let col = video.get(x, y);
                        fill(col);
                        noStroke();
                        var size = Math.random() * windowHeight / 30;
                        rect(x / ratioW, y / ratioH, size, size);
                        if (next) {
                            next = false;
                            return;
                        }
                    }
                    break;
                case 1:
                    for (let i = 0; i < 500; i++) {
                        let x = int(random(video.width));
                        let y = int(random(video.height));
                        let col = video.get(x, y);
                        fill(col);
                        noStroke();
                        ellipse(x / ratioW, y / ratioH, 10);
                        if (next) {
                            next = false;
                            return;
                        }
                    }
                    break;
                case 2:
                    for (let i = 0; i < 200; i++) {
                        let x = int(random(video.width));
                        let y = int(random(video.height));
                        let col = video.get(x, y);
                        col[3] = Math.max(col[0] - col[1], 15); // alpha effect
                        fill(col);
                        noStroke();
                        var size = Math.random() * windowHeight / 30;
                        rect(x / ratioW, y / ratioH, size, size);
                        if (next) {
                            next = false;
                            return;
                        }
                    }
                    break;
                case 3:
                    for (let i = 0; i < 500; i++) {
                        let x = int(random(video.width));
                        let y = int(random(video.height));
                        let col = video.get(x, y);
                        col[3] = Math.max(col[0] - col[1], 15); // alpha effect
                        fill(col);
                        noStroke();
                        ellipse(x / ratioW, y / ratioH, 10);
                        if (next) {
                            next = false;
                            return;
                        }
                    }
                    break;
            }
            break;
        case 3:
            switch (substyle) {
                case 0:
                case 9: // vertical slices
                    // How many slices of the image should we make
                    const strips = 5;

                    // Vertical Strips
                    // Get the source x,y,width,height
                    const sx = roundToNearest(random(640), strips);
                    const sy = 0;
                    const sw = 640 / strips;
                    const sh = 480;

                    // Get the destination x,y,width,height
                    const dx = sx * windowWidth / 640;
                    const dy = int(random(-5, 5));
                    const dw = sw; // PB + Math.random() * strips;
                    const dh = windowHeight;
                    // Call the copy function with the given parameters
                    copy(video, sx, sy, sw, sh, dx, dy, dw, dh);
                    break;
                case 1: // horizontal slices
                    // How many slices of the image should we make
                    const strips2 = 8;

                    // Horizontal Strips
                    // Get the source x,y,width,height
                    const sx2 = 0;
                    const sy2 = roundToNearest(random(480), strips2);
                    const sw2 = 640;
                    const sh2 = 480 / strips2;

                    // Get the destination x,y,width,height
                    const dx2 = int(random(-5, 5));
                    const dy2 = sy2 * windowHeight / 480;
                    const dw2 = windowWidth;
                    const dh2 = sh2;

                    // Call the copy function with the given parameters
                    copy(video, sx2, sy2, sw2, sh2, dx2, dy2, dw2, dh2);
                    break;
                case 2: // horizontal & vertical slices
                    // How many slices of the image should we make
                    const strips3 = 15;

                    // Vertical Strips
                    // Get the source x,y,width,height
                    const sx3 = roundToNearest(random(640), strips3);
                    const sy3 = 0;
                    const sw3 = 640 / strips3;
                    const sh3 = 480;

                    // Get the destination x,y,width,height
                    const dx3 = sx3 * windowWidth / 640;
                    const dy3 = int(random(-5, 5));
                    const dw3 = sw3;
                    const dh3 = windowHeight;

                    // Call the copy function with the given parameters
                    copy(video, sx3, sy3, sw3, sh3, dx3, dy3, dw3, dh3);

                    // Horizontal Strips
                    // Get the source x,y,width,height
                    const sx4 = 0;
                    const sy4 = roundToNearest(random(480), strips3);
                    const sw4 = 640;
                    const sh4 = 480 / strips3;

                    // Get the destination x,y,width,height
                    const dx4 = int(random(-5, 5));
                    const dy4 = sy4 * windowHeight / 480;
                    const dw4 = windowWidth;
                    const dh4 = sh4;

                    // Call the copy function with the given parameters
                    copy(video, sx4, sy4, sw4, sh4, dx4, dy4, dw4, dh4);
                    break;
            }
            break;
        case 4: // image rotations

            switch (substyle) {
                case 0:
                    tint(255);
                    imageMode(CENTER)
                    translate(windowWidth - mx, my);
                    rotate(angle);
                    image(video, 0, 0, windowWidth / 5, windowHeight / 5);
                    angle += 0.05; // .15, .05, -.05, .15
                    break;
                case 1:
                    tint(255);
                    imageMode(CENTER)
                    translate(windowWidth - mx, my);
                    rotate(angle);
                    image(video, 0, 0, windowWidth / 5, windowHeight / 5);
                    angle += -0.05; // .15, .05, -.05, .15
                    break;
                case 2: // image rotations and bounce
                    tint(255);
                    imageMode(CENTER);
                    for (b of balls) {
                        b.render()
                    }
                    break;
            }
    }
    // A little utility for rounding a value to the nearest 10, 20, 30 or whatever
    function roundToNearest(value, nearest) {
        return ceil(value / nearest - 1) * nearest;
    }

    function AdvanceBuffer() {
        lastImageData = currentImageData;
        currentImageData = drawingContext.getImageData(0, 0, width, height).data;
    }
}

function MoveMouse(xm, ym) {
    crosshairs.hidden = false;
    try {
        mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
        mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;
        //            console.log('Moving: ', xm, ym);
        mouseX += xm;
        mouseY += ym;
        if (mouseX < 10)
            mouseX = 10;
        if (mouseY < 10)
            mouseY = 10;
        if (mouseX >= window.innerWidth - 10)
            mouseX = window.innerWidth - 10;
        if (mouseY >= window.innerHeight - 10)
            mouseY = window.innerHeight - 10;
//        console.log('MoveTo: ', mouseX, mouseY);
        crosshairs.style.left = mouseX - crosshairs.offsetWidth / 2 + "px";
        crosshairs.style.top = mouseY - crosshairs.offsetHeight / 2 + "px";
    } catch {}
}

function JoystickMoveTo(jy, jx) {
    if (splash.hidden) {
        if (Math.abs(jx) < .1 && Math.abs(jy) < .1) {
            try {
                if (gpad.getButton(14).value > 0) // dpad left
                    MoveMouse(-5, 0);
                if (gpad.getButton(12).value > 0) // dup
                    MoveMouse(0, -3);
                if (gpad.getButton(13).value > 0) // ddown
                    MoveMouse(0, 3);
                if (gpad.getButton(15).value > 0) // dright
                    MoveMouse(5, 0);
            } catch {}
            return;
        }
        if (Math.abs(jx) < .1)
            jx = 0;
        if (Math.abs(jy) < .1)
            jy = 0;
        if (jx == 0 && jy == 0)
            return;
        MoveMouse(jx * 10, jy * 10);
    }
}

var currentButton = 0;


function MouseClick() {
    var s; //        
    var elements = document.elementsFromPoint(crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2, crosshairs.offsetTop + (crosshairs.offsetHeight) / 2);
    try {
        if (elements[0].id == "canvas") {
            mousePressed();
        } else {
            elements[0].click();
            mouseState = 0;
        }
    } catch (e) {}
}

function showPressedButton(index) {
    //      console.log("Pressed: ", index);
    if (!splash.hidden) { // splash screen
        splash.hidden = true;
    } else {
        switch (index) {
            case 0: // A
                if (crosshairs.hidden) {
                    Action(1);
                } else {
                    MouseClick();
                }
                break;
            case 8:
                toggleButtons();
                break
            case 9:
                break;
            case 1: // B - 
                Action(2);
                break;
            case 2: // X
                Action(3);
                break;
            case 3: // Y
                Action(3);
                break;
            case 4: // LT
            case 6: //
                break;
            case 5: // RT
            case 7: //
                break;
            case 10: // XBox
                break;
            case 12: // dpad handled by timer elsewhere
            case 13:
            case 14:
            case 15:
                break;
            default:
        }
    }
}

function removePressedButton(index) {
    mousedown = false;
}

function moveJoystick(values, isLeft) {
    if (splash.hidden)
        JoystickMoveTo(values[1], values[0]);
}

var gpad;

function getAxes() {
    //       console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getButton(14).value);
    if (splash.hidden) {
        JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0));
        JoystickMoveTo(gpad.getAxis(3), gpad.getAxis(2));
    }
    setTimeout(function () {
        getAxes();
    }, 50);
}

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    gpad = e.gamepad;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    setTimeout(function () {
        getAxes();
    }, 50);
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
});

gamepads.start();
