(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

window.Stepper = stepperjs.Stepper;
window.easings = stepperjs.easings;

var BG_IMAGE_WIDTH = 1920;
var BG_IMAGE_HEIGHT = 1080;
var CAR_IMAGE_WIDTH = 100; // 512, Fixed car image size.
var CAR_IMAGE_HEIGHT = 40.234375; // 206
var LAND_POSITION_Y = 840;

var _document$documentEle = document.documentElement;
var clientWidth = _document$documentEle.clientWidth;
var clientHeight = _document$documentEle.clientHeight;

var viewBoxWidth = clientWidth > 768 ? 768 : clientWidth;
var viewBoxHeight = clientHeight > 768 ? 768 : clientHeight;
var bgImageWidth = parseFloat((viewBoxHeight * (BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT)).toFixed(4));
var range = 0;
var speed = 0;

var map = {
    viewBoxWidth: viewBoxWidth,
    viewBoxHeight: viewBoxHeight,
    bgImageWidth: bgImageWidth,
    bgImageHeight: viewBoxHeight,
    landPositionY: parseFloat((viewBoxHeight * (LAND_POSITION_Y / BG_IMAGE_HEIGHT)).toFixed(4)),
    carImageWidth: CAR_IMAGE_WIDTH,
    carImageHeight: CAR_IMAGE_HEIGHT,
    carJumpHeight: CAR_IMAGE_HEIGHT * 3
};

var step = Object.defineProperties({}, {
    range: {
        get: function get() {
            return range;
        },
        configurable: true,
        enumerable: true
    },
    speed: {
        get: function get() {
            return speed;
        },
        set: function set(value) {
            speed = parseFloat(value.toFixed(2));
            range = bgImageWidth / parseInt(bgImageWidth / speed, 10);
        },
        configurable: true,
        enumerable: true
    }
});

function image(src) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.src = src;
        image.onload = function () {
            return resolve(image);
        };
        image.onerror = reject;
    });
}

function audio() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Promise(function (resolve, reject) {
        var sound = new Howl((options.src = src, options));
        sound.on('load', function () {
            return resolve(sound);
        });
        sound.on('loaderror', reject);
    });
}

function font() {
    var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return new Promise(function (resolve, reject) {
        WebFont.load({
            google: {
                families: names
            },
            active: resolve,
            inactive: reject
        });
    });
}

function load$1() {
    return Promise.all([image('dist/images/sunset.png'), image('dist/images/sun.png'), image('dist/images/tree.png'), image('dist/images/land.png'), audio('dist/sounds/background.mp3', { volume: .8, loop: true }), audio('dist/sounds/car-jump.mp3', { volume: .5 }), audio('dist/sounds/car-bang.wav', { volume: .5 }), font(['Dosis'])]).then(function (resources) {
        return {
            images: resources.slice(0, 4),
            sounds: resources.slice(4, 7)
        };
    });
}

function arrayFrom(arrayLike) {
    return [].slice.call(arrayLike);
}

var bgImageWidth$1 = map.bgImageWidth;

var bgParal = arrayFrom(document.querySelectorAll('.parallax__background-group'));
var bgImages = bgParal.map(function (p) {
    return arrayFrom(p.querySelectorAll('.parallax__background--parallax'));
});
var cache = [[0, bgImageWidth$1], [0, bgImageWidth$1]];
var steps = void 0;

var background$1 = {
    use: function use() {
        this.updateStep(step.range);
        bgParal.forEach(function (g) {
            return g.classList.add('show');
        });
        bgImages.forEach(function (bgs) {
            bgs.forEach(function (bg, i) {
                bg.style.width = bgImageWidth$1 + 'px';
                bg.style.transform = 'translate3d(' + i * bgImageWidth$1 + 'px,0,0)';
            });
        });
        return this;
    },
    updateStep: function updateStep(range) {
        steps = bgParal.map(function (bg, i) {
            return range / (bgParal.length - i);
        });
    },
    draw: function draw() {
        // for (let i = 0, n = bgParal.length; i < n; i++) {
        //     let x1 = cache[i][0] - steps[i];
        //     let x2 = cache[i][1] - steps[i];
        //     x1 = x1 < -bgImageWidth ? x2 + bgImageWidth : x1;
        //     x2 = x2 < -bgImageWidth ? x1 + bgImageWidth : x2;
        //     bgImages[i][0].style.transform = 'translate3d(' + (x1 < x2 ? x1 : x1 - 1) + 'px,0,0)';
        //     bgImages[i][1].style.transform = 'translate3d(' + (x2 < x1 ? x2 : x2 - 1) + 'px,0,0)';
        //     cache[i][0] = x1;
        //     cache[i][1] = x2;
        // }
        // -------
        var x1 = cache[0][0] - steps[0];
        var x2 = cache[0][1] - steps[0];
        x1 = x1 < -bgImageWidth$1 ? x2 + bgImageWidth$1 : x1;
        x2 = x2 < -bgImageWidth$1 ? x1 + bgImageWidth$1 : x2;
        bgImages[0][0].style.transform = 'translate3d(' + (x1 < x2 ? x1 : x1 - 1) + 'px,0,0)';
        bgImages[0][1].style.transform = 'translate3d(' + (x2 < x1 ? x2 : x2 - 1) + 'px,0,0)';
        cache[0][0] = x1;
        cache[0][1] = x2;
        // -------
        x1 = cache[1][0] - steps[1];
        x2 = cache[1][1] - steps[1];
        x1 = x1 < -bgImageWidth$1 ? x2 + bgImageWidth$1 : x1;
        x2 = x2 < -bgImageWidth$1 ? x1 + bgImageWidth$1 : x2;
        bgImages[1][0].style.transform = 'translate3d(' + (x1 < x2 ? x1 : x1 - 1) + 'px,0,0)';
        bgImages[1][1].style.transform = 'translate3d(' + (x2 < x1 ? x2 : x2 - 1) + 'px,0,0)';
        cache[1][0] = x1;
        cache[1][1] = x2;
    }
};

var bgImageWidth$2 = map.bgImageWidth;

var bgParal$1 = arrayFrom(document.querySelectorAll('.graphic__background-group'));
var bgImages$1 = bgParal$1.map(function (p) {
    return arrayFrom(p.querySelectorAll('.graphic__background'));
});
var cache$1 = [[0, bgImageWidth$2], [0, bgImageWidth$2]];
var steps$1 = void 0;

var background$2 = {
    use: function use() {
        this.updateStep(step.range);
        bgParal$1.forEach(function (g) {
            return g.classList.add('show');
        });
        bgImages$1.forEach(function (bgs) {
            bgs.forEach(function (bg, i) {
                bg.setAttribute('width', bgImageWidth$2);
                bg.setAttribute('transform', 'translate(' + i * bgImageWidth$2 + ',0)');
            });
        });
        return this;
    },
    updateStep: function updateStep(range) {
        steps$1 = bgParal$1.map(function (bg, i) {
            return range / (bgParal$1.length - i);
        });
    },
    draw: function draw() {
        // for (let i = 0, n = bgParal.length; i < n; i++) {
        //     let x1 = cache[i][0] - steps[i];
        //     let x2 = cache[i][1] - steps[i];
        //     x1 = x1 < -bgImageWidth ? x2 + bgImageWidth : x1;
        //     x2 = x2 < -bgImageWidth ? x1 + bgImageWidth : x2;
        //     bgImages[i][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
        //     bgImages[i][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
        //     cache[i][0] = x1;
        //     cache[i][1] = x2;
        // }
        // ------
        var x1 = cache$1[0][0] - steps$1[0];
        var x2 = cache$1[0][1] - steps$1[0];
        x1 = x1 < -bgImageWidth$2 ? x2 + bgImageWidth$2 : x1;
        x2 = x2 < -bgImageWidth$2 ? x1 + bgImageWidth$2 : x2;
        bgImages$1[0][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
        bgImages$1[0][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
        cache$1[0][0] = x1;
        cache$1[0][1] = x2;
        // ------
        x1 = cache$1[1][0] - steps$1[1];
        x2 = cache$1[1][1] - steps$1[1];
        x1 = x1 < -bgImageWidth$2 ? x2 + bgImageWidth$2 : x1;
        x2 = x2 < -bgImageWidth$2 ? x1 + bgImageWidth$2 : x2;
        bgImages$1[1][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
        bgImages$1[1][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
        cache$1[1][0] = x1;
        cache$1[1][1] = x2;
    }
};

var carImageHeight = map.carImageHeight;
var carJumpHeight = map.carJumpHeight;

var carEl = document.querySelector('.graphic__car');
var landPositionY = map.landPositionY - carImageHeight + .5;
var stepValue = step.range;
var carY = landPositionY;
var jumpCount = 0;
var stepper$1 = null;

carEl.setAttribute('transform', 'translate(40,' + carY + ')');

var car = {
    guide: {
        width: 70,
        height: 30,
        x: 40 + 15,
        y: carY + 4
    },
    updateStep: function updateStep(newStepValue) {
        stepValue = newStepValue;
    },
    jump: function jump() {
        var _this = this;

        if (jumpCount >= 2) {
            return false;
        }
        var cy = carY;
        jumpCount = jumpCount + 1;
        this.stop();
        stepper$1 = new Stepper({
            duration: 300 - stepValue * 10,
            easing: easings.outQuad
        }).on({
            update: function update(n) {
                carY = cy - carJumpHeight * n;
                _this.guide.y = carY + 4;
                carEl.setAttribute('transform', 'translate(40,' + carY + ')');
            },
            ended: function ended() {
                var cy = carY;
                var ty = landPositionY - cy;
                stepper$1 = new Stepper({
                    duration: 300 - stepValue * 10,
                    easing: easings.inQuad
                }).on({
                    update: function update(n) {
                        carY = cy + ty * n;
                        _this.guide.y = carY + 4;
                        carEl.setAttribute('transform', 'translate(40,' + carY + ')');
                    },
                    ended: function ended() {
                        return jumpCount = 0;
                    }
                });
                stepper$1.start();
            }
        });
        stepper$1.start();
        return true;
    },
    stop: function stop() {
        stepper$1 && stepper$1.stop();
    },
    clear: function clear() {
        carY = landPositionY;
        carEl.setAttribute('transform', 'translate(40,' + carY + ')');
        jumpCount = 0;
    }
};

function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

var viewBoxWidth$1 = map.viewBoxWidth;
var carImageWidth = map.carImageWidth;
var carJumpHeight$1 = map.carJumpHeight;
var landPositionY$1 = map.landPositionY;

var obstaclesEl = document.querySelector('.graphic__obstacles');
var gapRange = [carImageWidth * 2.5, carImageWidth * 5.5];
var heightRange = [carJumpHeight$1 / 4, carJumpHeight$1 / 1.5];
var collection = [];
var stepValue$1 = step.range;

var obstacles = {
    get: function get(index) {
        return collection[index];
    },
    create: function create() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var lastObstacle = collection[collection.length - 1] || null;
        var gap = random(gapRange[0], gapRange[1]);
        var width = carImageWidth / 5;
        var height = random(heightRange[0], heightRange[1]);
        var x = (lastObstacle ? lastObstacle.x : viewBoxWidth$1) + gap;
        var y = landPositionY$1 - height + 1;
        svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('class', 'svg-obstacles__obstacle');
        svg.setAttribute('x', x);
        svg.setAttribute('y', y);
        svg.insertAdjacentHTML('afterbegin', '\n            <rect x="0"   y="0" width="100%" height="100%" opacity="1" fill="#eeeeee"></rect>\n            <rect x="0"   y="0" width="65%"  height="100%" opacity="1" fill="#d3d3d3"></rect>\n            <rect x="82%" y="0" width="18%"  height="100%" opacity="1" fill="#d3d3d3"></rect>\n            <rect x="0"   y="0" width="30%"  height="100%" opacity="1" fill="#b3b3b3"></rect>\n            <rect x="40%" y="0" width="10%"  height="100%" opacity="1" fill="#b3b3b3"></rect>\n            <line x1="1"   y1="100%" x2="1"    y2="0"    stroke="#7f7f7f" stroke-width="2"></line>\n            <line x1="0"   y1="0"    x2="100%" y2="0"    stroke="#7f7f7f" stroke-width="2"></line>\n            <line x1="98%" y1="0"    x2="98%"  y2="100%" stroke="#979797" stroke-width="2"></line>\n        ');
        collection.push({ svg: svg, x: x, y: y, width: width, height: height, counted: false });
        obstaclesEl.appendChild(svg);
    },
    updateStep: function updateStep(newStepValue) {
        stepValue$1 = newStepValue;
    },
    draw: function draw() {
        var _this = this;

        // for (let i = 0; i < 5; i++) {
        //     let obstacle = collection[i];
        //     obstacle.x = obstacle.x - stepValue;
        //     obstacle.svg.setAttribute('x', obstacle.x);
        // }
        // ------
        var obstacle = collection[0];
        obstacle.x = obstacle.x - stepValue$1;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[1];
        obstacle.x = obstacle.x - stepValue$1;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[2];
        obstacle.x = obstacle.x - stepValue$1;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[3];
        obstacle.x = obstacle.x - stepValue$1;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[4];
        obstacle.x = obstacle.x - stepValue$1;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[0];
        if (obstacle.x + parseInt(obstacle.width, 10) < 0) {
            obstaclesEl.removeChild(obstacle.svg);
            collection = collection.filter(function (o) {
                return o.svg !== obstacle.svg;
            });
            setTimeout(function () {
                return _this.create();
            }, 0);
        }
    },
    clear: function clear() {
        collection.forEach(function (obstacle) {
            obstaclesEl.removeChild(obstacle.svg);
        });
        collection = [];
    }
};

function colliding(rect1, rect2) {
    var x1 = parseInt(rect1.x, 10);
    var y1 = parseInt(rect1.y, 10);
    var w1 = parseInt(rect1.width, 10);
    var h1 = parseInt(rect1.height, 10);
    var x2 = parseInt(rect2.x, 10);
    var y2 = parseInt(rect2.y, 10);
    var w2 = parseInt(rect2.width, 10);

    return x1 + w1 > x2 && y1 + h1 > y2 && x1 < x2 + w2;
}

window.Stepper = stepperjs.Stepper;
window.easings = stepperjs.easings;

var svg = document.querySelector('svg');
var showcase = document.querySelector('.showcase');
var infoInner = document.querySelector('.information__inner');
var menuList = document.querySelector('.information__menu-list');
var board = document.querySelector('.information__counter');
var greeting = document.querySelector('.information__greeting');
var gameover = document.querySelector('.information__gameover');
var preloader = document.querySelector('.information__preloader');
var counter = board.querySelector('span');
var score = gameover.querySelector('.information__gameover .pane__desc span:last-child');
var startButton = greeting.querySelector('.pane__button');
var reStartButton = gameover.querySelector('.pane__button');
var reloadButton = menuList.querySelector('.information__menu-item--type-reload');
var soundBg = void 0;
var soundJump = void 0;
var soundBang = void 0;
var background = void 0;
var started = false;
var count = 0;

showcase.style.height = map.viewBoxHeight + 'px';
svg.setAttribute('viewBox', '0 0 ' + map.viewBoxWidth + ' ' + map.viewBoxHeight);

load$1().then(function (resources) {
    soundBg = resources.sounds[0];
    soundJump = resources.sounds[1];
    soundBang = resources.sounds[2];
    new Stepper({ duration: 500 }).on({
        start: function start() {
            greeting.style.display = 'block';
        },
        update: function update(n) {
            preloader.style.opacity = 1 - n;
            greeting.style.opacity = n;
            board.style.opacity = n;
            menuList.style.opacity = n;
        },
        ended: function ended() {
            infoInner.removeChild(preloader);
        }
    }).start();
});

if ((navigator.userAgent.indexOf('Safari') !== -1 || navigator.userAgent.indexOf('AppleWebKit') !== -1) && navigator.userAgent.indexOf('Chrome') === -1) {
    background = background$2.use();
} else {
    background = background$1.use();
}

var stepper = new Stepper({
    duration: 5000,
    loop: true
}).on({
    update: function update() {
        background.draw();
        obstacles.draw();
        var headObstacle = obstacles.get(0);
        if (colliding(car.guide, headObstacle) || colliding(car.guide, obstacles.get(1))) {
            soundBang.play();
            soundBg.stop();
            stepper.stop();
            car.stop();
            speedIncreaseTime.stop();
            new Stepper({ duration: 200 }).on({
                start: function start() {
                    gameover.style.display = 'block';
                },
                update: function update(n) {
                    gameover.style.opacity = n;
                },
                ended: function ended() {
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
reStartButton.addEventListener('click', startGame);
reloadButton.addEventListener('click', function () {
    return window.location.reload();
});

document.addEventListener('touchstart', function () {
    if (started && car.jump()) {
        soundJump.play();
    }
});

document.addEventListener('keydown', function (_ref) {
    var code = _ref.code;

    if (code === 'Enter' && !started) {
        startGame();
    }
    if ((code === 'ArrowUp' || code === 'Space') && started && car.jump()) {
        soundJump.play();
    }
});

var speedIncreaseTime = 0;

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
        new Stepper({ duration: 300 }).on({
            update: function update(n) {
                greeting.style.opacity = 1 - n;
            },
            ended: function ended() {
                infoInner.removeChild(greeting);
            }
        }).start();
    }
    new Stepper({ duration: 200 }).on({
        update: function update(n) {
            gameover.style.opacity = 1 - n;
        },
        ended: function ended() {
            gameover.style.display = 'none';
            var starting = new Stepper({
                duration: 200,
                loop: true
            }).on({
                update: function update(n) {
                    if (step.speed === 7) {
                        starting.stop();
                        starting = null;
                        speedIncreaseTime = new Stepper({
                            duration: 8000,
                            loop: true
                        }).on({
                            update: function update(n) {
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

})));
