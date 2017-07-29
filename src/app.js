import {map, step, db} from './env';
import resource from './utils/resource';
import backgroundDOM from './background-dom';
import backgroundSVG from './background-svg';
import car from './car';
import obstacles from './obstacles';
import colliding from './utils/colliding';
import scores from './scores';
window.Stepper = stepperjs.Stepper;
window.easings = stepperjs.easings;

const svg = document.querySelector('svg');
const showcase = document.querySelector('.showcase');
const infoInner = document.querySelector('.information__inner');
const menuList = document.querySelector('.information__menu-list');
const board = document.querySelector('.information__counter');
const greeting = document.querySelector('.information__greeting');
const gameover = document.querySelector('.information__gameover');
const gamerecord = document.querySelector('.information__game-record');
const preloader = document.querySelector('.information__preloader');
const formRecord = document.querySelector('.form-record-score');
const gamescores = document.querySelector('.information__game-scores');
const counter = board.querySelector('span');
const score = gameover.querySelector('.information__gameover .pane__desc span:last-child');
const startButton = greeting.querySelector('.pane__button');
const recordButton = gameover.querySelector('.btn-record');
const restartButton = gameover.querySelector('.btn-restart');
const reloadButton = menuList.querySelector('.information__menu-item--type-reload');
const rankingButton = menuList.querySelector('.information__menu-item--type-ranking');
const closeButton = gamescores.querySelector('.game-scores__close .button');
const initialsInput = formRecord.querySelector('input[name=initials]');
let soundBg;
let soundJump;
let soundBang;
let background;
let started = false;
let notRobot = false;
let count = 0;

firebase.initializeApp(db);
showcase.style.height = `${map.viewBoxHeight}px`;
svg.setAttribute('viewBox', `0 0 ${map.viewBoxWidth} ${map.viewBoxHeight}`);
scores.firebase(firebase);

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
            speedIncreaseTime && speedIncreaseTime.stop();
            new Stepper({duration: 200}).on({
                start() {
                    gameover.style.display = 'block';
                },
                update(n) {
                    gameover.style.opacity = n;
                },
                ended() {
                    started = false;
                }
            }).start();
        } else if (headObstacle.x < 40 && !headObstacle.counted) {
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
restartButton.addEventListener('click', startGame);
recordButton.addEventListener('click', onRecordScore);
formRecord.addEventListener('submit', onSubmitRecord);
closeButton.addEventListener('click', onCloseResord);
reloadButton.addEventListener('click', () => window.location.reload());
rankingButton.addEventListener('click', onClickRanking);

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
    if (started) {
        return;
    }
    started = true;
    obstacles.clear();
    car.clear();
    obstacles.clear();
    updateScore(0);
    resetSpeed(.5);
    createObstacles();
    if (infoInner.contains(greeting)) {
        new Stepper({duration: 300}).on({
            update(n) {
                greeting.style.opacity = 1 - n;
            },
            ended() {
                infoInner.removeChild(greeting);
            }
        }).start();
    }
    new Stepper({duration: 200}).on({
        update(n) {
            gameover.style.opacity = 1 - n;
        },
        ended() {
            gameover.style.display = 'none';
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
            stepper.start();
            soundBg.play();
        }
    }).start();
}

function renderRanking() {
    gamescores.classList.add('game-scores--state-loading');
    scores.select().then((data) => {
        gamescores.querySelector('tbody').innerHTML = data.map((datum, index) => (`
            <tr>
                <td>${index + 1}</td>
                <td>${datum.initials}</td>
                <td>${datum.score}</td>
            </tr>
        `)).join('');
        gamescores.classList.remove('game-scores--state-loading');
    });
}

function onRecordScore() {
    new Stepper({duration: 200}).on({
        start() {
            gamerecord.style.display = 'block';
        },
        update(n) {
            gamerecord.style.opacity = n;
        }
    }).start();
}

function onSubmitRecord(event) {
    event.preventDefault();

    if (!initialsInput.value) {
        alert('Enter yout initials.');
        return;
    }

    if (!notRobot) {
        alert('PLZ recaptcha.');
        return;
    }

    formRecord.removeEventListener('submit', onSubmitRecord);
    formRecord.querySelector('.form__submit').setAttribute('disabled', '');

    scores.insert(initialsInput.value, count).then(() => {
        formRecord.addEventListener('submit', onSubmitRecord);
        formRecord.querySelector('.form__submit').removeAttribute('disabled');
        grecaptcha.reset();
        notRobot = false;
        gamerecord.style.opacity = 0;
        gamescores.style.opacity = 1;
        gamerecord.style.display = 'none';
        gamescores.style.display = 'block';
        renderRanking();
    });
}

function onCloseResord() {
    new Stepper({duration: 200}).on({
        update(n) {
            gamescores.style.opacity = 1 - n;
        },
        ended() {
            gamescores.style.display = 'none';
        }
    }).start();
}

function onClickRanking() {
    new Stepper({duration: 200}).on({
        start() {
            gamescores.style.display = 'block';
        },
        update(n) {
            gamescores.style.opacity = n;
        },
        ended() {
            renderRanking();
        }
    }).start();
}

window.onRecaptchaed = function() {
    notRobot = true;
};
