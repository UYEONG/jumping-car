import {map, step} from './env';

const {carImageHeight, carJumpHeight} = map;
const carEl = document.querySelector('.graphic__car');
const landPositionY = map.landPositionY - carImageHeight + .5;
let stepValue = step.range;
let carY = landPositionY;
let jumpCount = 0;
let stepper = null;

carEl.setAttribute('transform', `translate(40,${carY})`);

const car = {
    guide: {
        width: 70,
        height: 30,
        x: 40 + 15,
        y: carY + 4
    },
    updateStep(newStepValue) {
        stepValue = newStepValue;
    },
    jump() {
        if (jumpCount >= 2) {
            return false;
        }
        const cy = carY;
        jumpCount = jumpCount + 1;
        this.stop();
        stepper = new Stepper({
            duration: 300 - (stepValue * 10),
            easing: easings.outQuad
        }).on({
            update: (n) => {
                carY = cy - (carJumpHeight * n);
                this.guide.y = carY + 4;
                carEl.setAttribute('transform', `translate(40,${carY})`);
            },
            ended: () => {
                const cy = carY;
                const ty = landPositionY - cy;
                stepper = new Stepper({
                    duration: 300 - (stepValue * 10),
                    easing: easings.inQuad,
                }).on({
                    update: (n) => {
                        carY = cy + (ty * n);
                        this.guide.y = carY + 4;
                        carEl.setAttribute('transform', `translate(40,${carY})`);
                    },
                    ended: () => jumpCount = 0
                });
                stepper.start();
            }
        });
        stepper.start();
        return true;
    },
    stop() {
        stepper && stepper.stop();
    },
    clear() {
        carY = landPositionY;
        carEl.setAttribute('transform', `translate(40,${carY})`);
    }
};

export default car;
