const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var cakeImg = new Image();
cakeImg.src = "cake.png";

var cakes = new Map();
var cakeIdGenerator = 0;
var generateCake = 0;
var cakeFrequency = 50;

gameLoop();
var game = setInterval(gameLoop, 15);

function gameLoop() {
    drawBackground();
    drawCakes();

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
        
        ctx.font = "45px Times";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2.5;
        ctx.fillText(cake.number, cake.x + offsetX, cake.y + offsetY);
        ctx.strokeText(cake.number, cake.x + offsetX, cake.y + offsetY);
        ctx.closePath();
        cake.y += cake.speed // Increase its Y position to move the cake

        // If the cake beats the bottom bound, delete it
        if (cake.y > canvas.height) {
            cakes.delete(key);
        }

        // if (checkImpact(cake)) {
        //     showAdvice = false;
        //     theEnd = true;
        //     lost = true;
        // }
    }

    // Generate a cake
    if (generateCake == cakeFrequency) {
        let cakeSize = 60;
        let cake = new Cake(cakeIdGenerator, random(0, canvas.width - cakeSize), - cakeSize, 1, cakeSize, cakeSize, random(-10, 10));
        cakes.set(cake.id, cake);
        
        cakeIdGenerator++;
        generateCake = 0;
    }

    generateCake++;    
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}