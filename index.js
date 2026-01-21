const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var button = new Button(canvas.width / 2 - 120, canvas.height - 60, 240, 40);

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
var time = 0;

var red = 0, green = 0, blue = 0;

var showAdvice = true;

var theEnd = false;
var win = false;

gameLoop();
var game = setInterval(gameLoop, 15);

canvas.addEventListener("click", (e) => { checkImpact(e); checkButtonClick(e);}, false);
window.addEventListener("load", () => { setTimer(); })
window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, true);


function gameLoop() {
    drawBackground();
    drawCakeCounter();

    if (!win) {
        drawCakes();
        drawClock();
        
        checkState();
        
        drawExplosion();

        drawAdvice();
    } else {
        drawConfetti();
        drawWinWords();
    }

    if (theEnd) {
        drawReplaybutton();
    }

    ctx.imageSmoothingQuality = "high";
    time++;
}

function drawBackground() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCakes() {
    let offsetX = 32;
    let offsetY = 51;

    for (const [key, cake] of cakes) {
        ctx.beginPath();
        ctx.drawImage(cakeImg, cake.x, cake.y, cake.sizeX, cake.sizeY);
        
        ctx.font = "bold 45px Archivo Black";

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
        ctx.lineWidth = 1;
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
        let cake = new Cake(cakeIdGenerator, random(0, canvas.width - cakeSize), - cakeSize, 1.8, cakeSize, cakeSize, random(-10, 10));
        cakes.set(cake.id, cake);
        
        cakeIdGenerator++;
        generateCake = 0;
    }

    generateCake++;    
}

function drawCakeCounter() {
    ctx.beginPath();

    if (win) {
        //Variable text size
        var textSize = Math.abs(90 * Math.sin(time * 0.01)) + 60;
        ctx.font = `${textSize}px Times`;

        //Variable stroke style
        setVariableRGB();
        ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;

    } else {
        ctx.font = "120px Times";
        ctx.strokeStyle = "black";
    }

    ctx.textAlign = "center"
    ctx.fillStyle = "white";
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

function drawAdvice() {
    if (showAdvice) {
        ctx.beginPath();
        ctx.font = "7vw Times";
        ctx.fillStyle = "red";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;

        ctx.fillText("¡Toca las tartas para sumar 37!", canvas.width / 2, canvas.height - 50, canvas.width - 40);
        ctx.strokeText("¡Toca las tartas para sumar 37!", canvas.width / 2, canvas.height - 50, canvas.width - 40);

        ctx.closePath();
    }
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

function drawConfetti() {
    var number = random(0,200);

    if (number === 1) {
        confetti({
            angle: random(55, 125),
            spread: random(50, 70),
            particleCount: random(50, 100),
            origin: { y: 0.9 },
            colors: ["#ff0000", "#ffffff", "#1100ff"]
        });
    }
}

function drawWinWords() {
    ctx.beginPath();

    ctx.font = "70px Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2.5;
    ctx.fillText("Feliz", canvas.width / 2 + 10, canvas.height / 3.6);
    ctx.strokeText("Feliz", canvas.width / 2 + 10, canvas.height / 3.6);
    ctx.fillText("cumpleaños", canvas.width / 2 + 10, canvas.height / 1.5);
    ctx.strokeText("cumpleaños", canvas.width / 2 + 10, canvas.height / 1.5);

    ctx.closePath();
}

function checkImpact(e) {
    for (const [key, cake] of cakes) {
        if ((e.x > cake.x && e.x < cake.x + 50) && (e.y > cake.y && e.y < cake.y + 50)) {//
            cakes.delete(key);
            counter += cake.number;
            createExplosion(e);
            showAdvice = false;
        }
    }
}

async function checkState() {
    if (seconds === 0) {
        showAdvice = false;
        clearInterval(timer);
        clearInterval(game);
        theEnd = true;
    }
    
    if (counter === 37) {
        // clearInterval(game);
        theEnd = true;
        win = true;
    } 
}

function checkButtonClick(e) {
    var mousePosition = getMousePosition(e);
    
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

function setVariableRGB() {
    if (green === 0 && blue === 0) {
        if (red < 255) {
            red++;
        }
    }
    if (red === 255 && blue === 0) {
        if (green < 255) {
            green++;
        }
    }
    if (green === 255 && red === 255) {
        if (blue < 255) {
            blue++;
        }
    }

    if (green === 255 && blue === 255) {
        if (red > 0) {
            red--;
        }
    }
    if (red === 0 && blue === 255) {
        if (green > 0) {
            green--;
        }
    }
    if (green === 0 && red === 0) {
        if (blue > 0) {
            blue--;
        }
    }
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (num === 0) return num + random(1, 10); //To avoid number 0
    return num;
}