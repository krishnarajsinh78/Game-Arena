
const buttons = document.querySelectorAll(".color");
const message = document.getElementById("message");
const levelText = document.getElementById("level");
const bestText = document.getElementById("best");
const start = document.getElementById("start");

let sequence = [], player = [], level = 0, best = 0, locked = true;

const audio = new (window.AudioContext || window.webkitAudioContext)();
const sounds = { green: 500, red: 200, yellow: 700, blue: 350 };

function sound(f, d = 200) {
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(0.12, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + d / 1000);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + d / 1000);
}

function flash(c) {
    const b = document.querySelector(`[data-color="${c}"]`);
    b.classList.add("active");
    sound(sounds[c]);
    setTimeout(() => b.classList.remove("active"), 300);
}

function nextRound() {
    player = [];
    sequence.push(Object.keys(sounds)[Math.floor(Math.random() * 4)]);
    locked = true;
    message.textContent = "Watch the sequence!";

    sequence.forEach((c, i) => setTimeout(() => {
        flash(c);
        if (i === sequence.length - 1)
            setTimeout(() => {
                locked = false;
                message.textContent = "Your Turn!";
            }, 400);
    }, (i + 1) * 700));
}

function startGame() {
    audio.resume();
    sequence = [];
    level = 0;
    levelText.textContent = 0;
    start.textContent = "RESTART GAME";
    nextRound();
}

buttons.forEach(b => b.addEventListener("click", () => {
    if (locked) return;

    const c = b.dataset.color;
    flash(c);
    player.push(c);

    const i = player.length - 1;

    if (player[i] !== sequence[i]) {
        locked = true;
        message.textContent = "GAME OVER!";
        start.textContent = "PLAY AGAIN";
        sound(120, 500);
    }
    else if (player.length === sequence.length) {
        locked = true;
        level++;
        levelText.textContent = level;
        best = Math.max(best, level);
        bestText.textContent = best;
        message.textContent = "CORRECT! NEXT LEVEL!";
        sound(900, 300);
        setTimeout(nextRound, 800);
    }
}));

start.addEventListener("click", startGame);
