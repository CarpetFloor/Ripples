let c = document.querySelector("canvas");
let r = c.getContext("2d");
c.width = window.innerWidth - 20;
c.height = window.innerHeight - 20;
const w = c.width;
const h = c.height;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

class RippleGroup {
    constructor(x, y, size, strength, maxCount) {
        this.x = x;
        this.y = y;
        this.size = size;
        // rate at which size increases and strength decreases
        // lower is slower
        this.rate = 1.02;
        // how different the change in strength is from the change in size
        // lower is slower
        this.strengthRateInfluence = random(0.04, 0.1);
        this.strength = strength;
        this.ripples = [];
        this.count = 0;
        this.maxCount = maxCount;
        this.maxFrame = Math.floor(random(15, 35));
        /**
         * start at maxFrame - 1 so that on very first frame 
         * ripple will be created (-1 because frame is incremented 
         * right away), rather than having to wait until frame = 
         * maxFrame
         */
        this.frame = this.maxFrame - 1;
        this.color = "#" + 
        (
            parseInt("B39DDB", 16) 
            + Math.floor(random(-20, 35))
        ).toString(16);
    }
    update() {
        // add new ripple
        if(this.count < this.maxCount) {
            ++this.frame;

            if(this.frame % this.maxFrame == 0) {
                ++this.count;
                this.frame = 0;

                this.ripples.push(new Ripple(
                    this.x, this.y, 
                    this.size, this.rate, 
                    this.strength, this.strengthRateInfluence, 
                    this.color)
                );
            }
        }

        // update existing ripples
        for(let ripple of this.ripples) {
            ripple.draw();
            ripple.update();

            // delete ripple when strength is small enough
            if(ripple.strength < 0.05) {
                this.ripples.splice(this.ripples.indexOf(ripple), 1);
            }
        }

        // delete group if all ripples are gone
        if((this.count == this.maxCount) && (this.ripples.length == 0)) {
            ripples.splice(ripples.indexOf(this), 1);
        }
    }
}

class Ripple {
    constructor(x, y, size, rate, strength, strengthRateInfluence, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.rate = rate;
        this.strength = strength;
        this.strengthRateInfluence = strengthRateInfluence;
        this.color = color;
    }
    draw() {
        r.beginPath();

        // draw ripple
        r.arc(this.x, this.y, this.size, 0, 2 * Math.PI);

        r.lineWidth = this.strength;
        r.strokeStyle = this.color;
        r.stroke();
        
        r.closePath();
    }
    update() {
        // update properties, and make ripple "move"
        this.size *= this.rate;
        this.strength -= this.rate * this.strengthRateInfluence;

        this.rate -= 0.000102;
    }
}

let ripples = [];

function newGroup() {
    ripples.push(new RippleGroup(
        random(0, w), // x pos
        random(0, h), // y pos
        random(15, 50), // size
        random(4, 8), // strength
        random(5, 10) // ripples count
    ));
}

let frequency = 60 * (w * (0.4 / w));
console.log(frequency);
let maxFrame = frequency;
let frame = maxFrame - 1;

function loop() {        
    r.clearRect(0, 0, w, h);

    for(let ripple of ripples) {
        ripple.update();
    }

    ++frame;
    if(frame % maxFrame == 0) {
        frame = 0;

        newGroup();
    }
}

window.setInterval(loop, Math.round(1000 / 60));