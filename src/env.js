window.Stepper = stepperjs.Stepper;
window.easings = stepperjs.easings;

const BG_IMAGE_WIDTH   = 1920;
const BG_IMAGE_HEIGHT  = 1080;
const CAR_IMAGE_WIDTH  = 100;       // 512, Fixed car image size.
const CAR_IMAGE_HEIGHT = 40.234375; // 206
const LAND_POSITION_Y  = 840;

const {clientWidth, clientHeight} = document.documentElement;
const viewBoxWidth  = clientWidth  > 768 ? 768 : clientWidth;
const viewBoxHeight = clientHeight > 768 ? 768 : clientHeight;
const bgImageWidth  = parseFloat((viewBoxHeight * (BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT)).toFixed(4));
let range = 0;
let speed = 0;

const map = {
    viewBoxWidth,
    viewBoxHeight,
    bgImageWidth,
    bgImageHeight: viewBoxHeight,
    landPositionY: parseFloat((viewBoxHeight * (LAND_POSITION_Y / BG_IMAGE_HEIGHT)).toFixed(4)),
    carImageWidth: CAR_IMAGE_WIDTH,
    carImageHeight: CAR_IMAGE_HEIGHT,
    carJumpHeight: CAR_IMAGE_HEIGHT * 3
};

const step = {
    get range() {
        return range;
    },
    get speed() {
        return speed;
    },
    set speed(value) {
        speed = parseFloat(value.toFixed(2));
        range = bgImageWidth / parseInt(bgImageWidth / speed, 10);
    }
};

const db = {};

export {map, step, db};
