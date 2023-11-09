let c = document.querySelector("canvas");
let r = c.getContext("2d");
c.width = window.innerWidth - 20;
c.height = window.innerHeight - 20;
const w = c.width;
const h = c.height;

class Ripple {
    constructor(x, y, size, density) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.startSize = size;
        this.sizeIncrease = 1.02;
        this.density = density;
    }
}
let ripples = [];
ripples.push(new Ripple(w / 2, h / 2, 10, 5));

r.strokeStyle = "#B39DDB";

function loop() {        
    r.clearRect(0, 0, w, h);

    for(let ripple of ripples) {
        r.beginPath();

        // draw ripple
        r.arc(ripple.x, ripple.y, ripple.size, 0, 2 * Math.PI);

        // update properties, and make ripple "move"
        ripple.size *= ripple.sizeIncrease;
        ripple.sizeIncrease -= 0.0001;
        r.lineWidth = ripple.density;

        // delete ripple when density is small enough
        if(ripple.density > 0.025) {
            ripple.density -= 0.025;
        }
        else {
            ripples.splice(ripples.indexOf(ripple), 1);
        }
        r.stroke();

        r.closePath();
    }
}
window.setInterval(loop, Math.round(1000 / 60));