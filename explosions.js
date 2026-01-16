
// Request animation frame
const requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

// Options
const particlesPerExplosion = 20;
const particlesMinSpeed = 3;
const particlesMaxSpeed = 6;
const particlesMinSize = 1;
const particlesMaxSize = 3;
const explosions = [];

// Draw explosion(s)
function drawExplosion() {
    if (explosions.length === 0) {
        return;
    }

    for (let i = 0; i < explosions.length; i++) {

        const explosion = explosions[i];
        const particles = explosion.particles;

        if (particles.length === 0) {
            explosions.splice(i, 1);
            return;
        }

        const particlesAfterRemoval = particles.slice();
        for (let ii = 0; ii < particles.length; ii++) {

            const particle = particles[ii];

            // Check particle size
            // If 0, remove
            if (particle.size <= 0) {
                particlesAfterRemoval.splice(ii, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
            ctx.closePath();
            ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
            ctx.fill();

            // Update
            particle.x += particle.xv;
            particle.y += particle.yv;
            particle.size -= .1;
        }

        explosion.particles = particlesAfterRemoval;
    }
}

// Clicked
function createExplosion(e) {
    let xPos, yPos;

    if (e.offsetX) {
        xPos = e.offsetX;
        yPos = e.offsetY;
    } else if (e.layerX) {
        xPos = e.layerX;
        yPos = e.layerY;
    }

    explosions.push(
        new explosion(xPos, yPos)
    );

}

// Explosion
function explosion(x, y) {
    this.particles = [];

    for (let i = 0; i < particlesPerExplosion; i++) {
        this.particles.push(
            new particle(x, y)
        );
    }
}

// Particle
function particle(x, y) {
    this.x = x;
    this.y = y;
    this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.size = randInt(particlesMinSize, particlesMaxSize, true);

    let rnd = randInt(0,2, true);
    console.log(rnd);
    
    if (rnd) {
        this.r = randInt(210, 255);
        this.g = 135;
        this.b = 141;
    } else {
        this.r = 255;
        this.g = randInt(230, 250);
        this.b = 215;
    }
}

// Returns an random integer, positive or negative
// between the given value
function randInt(min, max, positive) {
    let num;
    if (positive === false) {
        num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    } else {
        num = Math.floor(Math.random() * max) + min;
    }

    return num;
}