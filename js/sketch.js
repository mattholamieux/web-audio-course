let things = [];
const notes = [
    "C2",
    "D2",
    "E2",
    "G2",
    "A2",
    "C3",
    "D3",
    "E3",
    "G3",
    "A3",
    "C4",
    "D4",
    "E4"
];
let init = false;

function setup() {
    rectMode(CENTER);
    cnv = createCanvas(700, 500);
    cnv.parent('vizzie')
    for (let i = 0; i < 4; i++) {
        let note = random(notes);
        let index = notes.indexOf(note);
        notes.splice(index, 1);
        let thing1 = new Thing(100, i * 80 + 80, 40, random(2) + 0.1, 0, note);
        note = random(notes);
        index = notes.indexOf(note);
        notes.splice(index, 1);
        let thing2 = new Thing(i * 80 + 80, 450, 40, 0, random(2) + 0.1, random(notes));
        things.push(thing1, thing2);
    }
}

function draw() {
    background(255, 0);
    clear();
    noStroke();
    if (init) {
        for (let thing of things) {
            thing.show();
            thing.move();
            for (let other of things) {
                if (thing !== other) {
                    thing.collision(other);
                }
            }
        }
    } else {
        fill(255);
        text('click for sound', width / 2 - 70, 250);
    }
}

function mousePressed() {
    if (mouseX < width && mouseX > 0 && mouseY > 0 && mouseY < height) {
        startUp();
    } else {
        init = false;
    }
}

function startUp() {
    if (!init) {
        Tone.start();
    } else {
        // Tone.stop();
    }
    init = !init;
}





class Thing {
    constructor(x, y, w, xVel, yVel, note) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.xVel = xVel;
        this.yVel = yVel;
        this.color = 255;
        this.note = note;
    }

    show() {
        fill(color(this.color));
        rect(this.x, this.y, this.w);
    }

    move() {
        this.x += this.xVel;
        this.y += this.yVel;

        if (this.x > width - this.w / 2 || this.x < this.w - this.w / 2) {
            this.xVel *= -1;
        }
        if (this.y > height - this.w / 2 || this.y < this.w - this.w / 2) {
            this.yVel *= -1;
        }
    }

    changeColor() {
        this.color = [random(255), random(255), random(255)];
        // this.note = notes[floor(map(this.color[0], 0, 255, 0, notes.length-1))]
    }

    collision(other) {
        let d = (dist(this.x, this.y, other.x, other.y));
        if (d < this.w / 2 + other.w / 2) {
            this.changeColor();
            this.xVel *= -1;
            this.yVel *= -1;
            sampler.triggerAttackRelease(this.note, "4n");
        }
    }
}




const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 4,
    modulationIndex: 2,
    envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.8,
        release: 3
    },
    modulationEnvelope: {
        attack: 0.2,
        decay: 0.01,
        sustain: 0.5,
        release: 1
    }
});
synth.maxPolyphony = 32;

const sampler = new Tone.Sampler({
    urls: {
        A1: "A1.mp3",
        A2: "A2.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/casio/"
})

const gain = new Tone.Gain(0.5);
const reverb = new Tone.Reverb({
    decay: 3,
    preDelay: 0.3,
    wet: 0.4
});


sampler.chain(reverb, gain);

gain.toDestination();