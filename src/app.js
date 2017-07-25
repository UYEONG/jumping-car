import {map, step} from './env';
import resource from './utils/resource';
import backgroundDOM from './background-dom';
import backgroundSVG from './background-svg';
import car from './car';
import obstacles from './obstacles';
import colliding from './utils/colliding';

window.Stepper = stepperjs.Stepper;
window.easings = stepperjs.easings;

const infoInner = document.querySelector('.information__inner');
const menuList = document.querySelector('.information__menu-list');
const board = document.querySelector('.information__counter');
const greeting = document.querySelector('.information__greeting');
const gameover = document.querySelector('.information__gameover');
const preloader = document.querySelector('.information__preloader');
const counter = board.querySelector('span');
const score = gameover.querySelector('.information__gameover .pane__desc span:last-child');
const startButton = greeting.querySelector('.pane__button');
const reStartButton = gameover.querySelector('.pane__button');
const reloadButton = menuList.querySelector('.information__menu-item--type-reload');
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
        start() {
            greeting.style.display = 'block';
        },
        update(n) {
            preloader.style.opacity = 1 - n;
            greeting.style.opacity = n;
            board.style.opacity = n;
            menuList.style.opacity = n;
        },
        ended() {
            infoInner.removeChild(preloader);
        }
    }).start();
});

if ((navigator.userAgent.indexOf('Safari') !== -1 ||
    navigator.userAgent.indexOf('AppleWebKit') !== -1)
    && navigator.userAgent.indexOf('Chrome') === -1) {
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
        const headObstacle = obstacles.get(0);
        if (colliding(car.guide, headObstacle) ||
            colliding(car.guide, obstacles.get(1))) {
            soundBang.play();
            soundBg.stop();
            stepper.stop();
            car.stop();
            speedIncreaseTime.stop();
            started = false;
            new Stepper({duration: 200}).on({
                start() {
                    gameover.style.display = 'block';
                },
                update(n) {
                    gameover.style.opacity = n;
                }
            }).start();
        } else if (headObstacle.x < 40 &&
            !headObstacle.counted) {
            updateScore(count + 1);
            headObstacle.counted = true;
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
                setTimeout(() => gameover.style.display = 'none', 0);
            }
        }).start();
    }
    updateScore(0);
    obstacles.clear();
    resetSpeed(.5);
    createObstacles();
    car.clear();
    let starting = new Stepper({
        duration: 200,
        loop: true
    }).on({
        update(n) {
            if (step.speed === 7) {
                starting.stop();
                starting = null;
                speedIncreaseTime = new Stepper({
                    duration: 8000,
                    loop: true
                }).on({
                    update(n) {
                        if (n >= 1) {
                            increaseSpeed(.2);
                        }
                    }
                });
                speedIncreaseTime.start();
            } else if (n >= 1) {
                increaseSpeed(.5);
            }
        }
    });
    starting.start();

    if (infoInner.contains(greeting)) {
        new Stepper({duration: 500}).on({
            update(n) {
                greeting.style.opacity = 1 - n;
            },
            ended() {
                if (infoInner.contains(greeting)) {
                    infoInner.removeChild(greeting);
                }
            }
        }).start();
    }
    stepper.start();
    soundBg.play();
    started = true;
}
