const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var button = new Button(canvas.width / 4.6, canvas.height - 60, 240, 40);

var cakeImg = new Image();
cakeImg.src = "cake.png";
var clockImg = new Image();
clockImg.src = "clock.png";

var cakes = new Map();
var cakeIdGenerator = 0;
var generateCake = 0;
var cakeFrequency = 75;

var counter = 0;
var timer = 30;
var seconds = 30;

var theEnd = false;

gameLoop();
var game = setInterval(gameLoop, 15);

canvas.addEventListener("click", (e) => { checkImpact(e); checkButtonClick(e);}, false);
addEventListener("load", () => { setTimer(); })

function gameLoop() {
    drawBackground();
    drawCakes();
    drawCakeCounter();
    drawClock();

    checkState();

    if (theEnd) {
        drawReplaybutton();
    }

    ctx.imageSmoothingQuality = "high";
}

function drawBackground() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Green background (grass)
}

function drawCakes() {
    let offsetX = 32;
    let offsetY = 51;

    for (const [key, cake] of cakes) {
        ctx.beginPath();
        ctx.drawImage(cakeImg, cake.x, cake.y, cake.sizeX, cake.sizeY);
        
        ctx.font = "bold 45px Jua";

        switch (true) {
            case cake.number > 0:
                ctx.fillStyle = "Green";
                break;
            case cake.number < 0:
                ctx.fillStyle = "Red";
                break;
            default:
                ctx.fillStyle = "Green";
                break;
        }
        
        ctx.textAlign = "center"
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.1;
        ctx.fillText(cake.number, cake.x + offsetX, cake.y + offsetY);
        ctx.strokeText(cake.number, cake.x + offsetX, cake.y + offsetY);
        ctx.closePath();
        cake.y += cake.speed // Increase its Y position to move the cake

        // If the cake beats the bottom bound, delete it
        if (cake.y > canvas.height) {
            cakes.delete(key);
        }
    }

    // Generate a cake
    if (generateCake == cakeFrequency) {
        let cakeSize = 60;
        let cake = new Cake(cakeIdGenerator, random(0, canvas.width - cakeSize), - cakeSize, 1.5, cakeSize, cakeSize, random(-10, 10));
        cakes.set(cake.id, cake);
        
        cakeIdGenerator++;
        generateCake = 0;
    }

    generateCake++;    
}

function drawCakeCounter() {
    ctx.beginPath();

    ctx.font = "120px Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2.5;
    ctx.fillText(counter, canvas.width / 2 + 10, canvas.height / 2);
    ctx.strokeText(counter, canvas.width / 2 + 10, canvas.height / 2);

    ctx.closePath();
}

function drawClock() {
    ctx.beginPath();
    ctx.drawImage(clockImg, 0, 0, 60, 60);

    ctx.font = "45px Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "white";
    ctx.fillText(seconds, 85, 45);

    ctx.closePath();
}

function drawReplaybutton() {
    ctx.beginPath();
    ctx.roundRect(button.x, button.y, button.width, button.height, 12);
    ctx.fillStyle = 'rgba(194, 194, 194, 0.5)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0d00ca';
    ctx.stroke();
    ctx.closePath();
    ctx.font = '25pt Times';
    ctx.fillStyle = '#000000';
    ctx.fillText('Jugar de nuevo', button.x + button.width / 2, button.y + (button.height / 2 + 10));
    ctx.closePath();
}

function checkImpact(e) {
    for (const [key, cake] of cakes) {
        if ((e.x > cake.x && e.x < cake.x + 50) && (e.y > cake.y && e.y < cake.y + 50)) {//
            cakes.delete(key);
            counter += cake.number;
        }
    }
}

function checkState() {
    if (seconds === 0) {
        clearInterval(timer);
        clearInterval(game);
        theEnd = true;
    }
    
    if (counter === 37) {
        clearInterval(game);
        theEnd = true;
    } 
}

function checkButtonClick(e) {
    var mousePosition = getMousePosition(e);
    console.log("Checking click position", mousePosition);
    
    if (theEnd && isInside(mousePosition, button)){
        window.location.reload();
    }
}

function setTimer() {
    timer = window.setInterval(function () {
        seconds--;
    }, 1000);
}

function getMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

// Function to check whether a point is inside a rectangle
function isInside(position, rect) {
    return position.x > rect.x && position.x < rect.x + rect.width && position.y < rect.y + rect.height && position.y > rect.y
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (num === 0) return num + random(1, 10); //To avoid number 0
    return num;
}