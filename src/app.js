import {map, step} from './env';
import resource from './utils/resource';
import backgroundDOM from './background-dom';
import backgroundSVG from './background-svg';
import car from './car';
import obstacles from './obstacles';
import colliding from './utils/colliding';

window.Stepper = stepperjs.Stepper;
window.easings = stepperjs.easings;

const loading = document.querySelector('.showcase__loading');
const greeting = document.querySelector('.showcase__greeting');
const gameover = document.querySelector('.showcase__gameover');
const menus = document.querySelector('.showcase__menus');
const board = document.querySelector('.showcase__board');
const counter = board.querySelector('.showcase__counter');
const score = gameover.querySelector('.showcase__score__counter');
const startButton = document.querySelector('.showcase__start-btn');
const reStartButton = document.querySelector('.showcase__restart-btn');
const reloadButton = menus.querySelector('.showcase__menu-reload');
let soundBg;
let soundJump;
let soundBang;
let background;
let started = false;
let count = 0;

document.querySelector('.showcase').style.height = `${map.viewBoxHeight}px`;
document.querySelector('svg').setAttribute('viewBox', `0 0 ${map.viewBoxWidth} ${map.viewBoxHeight}`);

resource().then((resources) => {
    soundBg = resources.sounds[0];
    soundJump = resources.sounds[1];
    soundBang = resources.sounds[2];

    new Stepper({duration: 500}).on({
        update(n) {
            loading.style.opacity = 1 - n;
            greeting.style.opacity = n;
            board.style.opacity = n;
            menus.style.opacity = n;
        },
        ended() {
            loading.style.display = 'none';
        }
    }).start();
});

if ((navigator.userAgent.indexOf('Safari') !== -1 &&
    navigator.userAgent.indexOf('Chrome') === -1) ||
    navigator.userAgent.indexOf('AppleWebKit') !== -1) {
    background = backgroundSVG.use();
} else {
    background = backgroundDOM.use();
}

const stepper = new Stepper({
    duration: 5000,
    loop: true
}).on({
    update() {
        background.draw();
        obstacles.draw();
        if (colliding(car.guide, obstacles.get(0)) ||
            colliding(car.guide, obstacles.get(1))) {
            soundBang.play();
            stepper.stop();
            car.stop();
            soundBg.stop();
            started = false;
            clearInterval(speedIncreaseTime);
            new Stepper({duration: 200}).on({
                update(n) {
                    gameover.style.opacity = n;
                },
                ended() {
                    gameover.style.display = 'block';
                }
            }).start();
        }
        if (obstacles.get(0).x < 40 &&
            !obstacles.get(0).counted) {
            updateScore(count + 1);
            obstacles.get(0).counted = true;
        }
    }
});

function createObstacles() {
    obstacles.create();
    obstacles.create();
    obstacles.create();
    obstacles.create();
    obstacles.create();
}

function resetSpeed(speed) {
    step.speed = speed;
    car.updateStep(step.range);
    background.updateStep(step.range);
    obstacles.updateStep(step.range);
}

function increaseSpeed(speed) {
    step.speed = step.speed + speed;
    car.updateStep(step.range);
    background.updateStep(step.range);
    obstacles.updateStep(step.range);
}

function updateScore(value) {
    count = value;
    counter.innerHTML = count;
    score.innerHTML = count;
}

startButton.addEventListener('click', startGame);
reStartButton.addEventListener('click', startGame);
reloadButton.addEventListener('click', () => window.location.reload());

document.addEventListener('touchstart', () => {
    if (started && car.jump()) {
        soundJump.play();
    }
});

document.addEventListener('keydown', ({code}) => {
    if (code === 'Enter' && !started) {
        startGame();
    }
    if ((code === 'ArrowUp' || code === 'Space') &&
        started && car.jump()) {
        soundJump.play();
    }
});

let speedIncreaseTime = 0;

function startGame() {
    if (gameover.style.display === 'block') {
        new Stepper({duration: 300}).on({
            update(n) {
                gameover.style.opacity = 1 - n;
            },
            ended() {
                gameover.style.display = 'none';
            }
        }).start();
    }
    updateScore(0);
    obstacles.clear();
    resetSpeed(.5);
    createObstacles();
    car.clear();
    let time = setInterval(() => {
        increaseSpeed(.5);
        if (step.speed >= 7) {
            clearInterval(time);
            speedIncreaseTime = setInterval(() => {
                increaseSpeed(.2);
            }, 8000);
        }
    }, 200);
    new Stepper({duration: 500}).on({
        update(n) {
            greeting.style.opacity = 1 - n;
        },
        ended() {
            greeting.style.display = 'none';
        }
    }).start();
    stepper.start();
    soundBg.play();
    started = true;
}
